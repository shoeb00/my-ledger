import { permissions } from './../permissions/schema';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as usersSchema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UserResponseDto } from './dto/user-response';
import { CreateUserRequestDto } from './dto/create-user-request';
import { and, eq, inArray, ne, sql } from 'drizzle-orm';
import { InviteUserRequestDto } from './dto/invite-user-request';
import { PermissionsService } from '../permissions/permissions.service';
import { books } from '../book/schema';
import { RequestContextService } from '../common/request-context.service';

const schema = { ...usersSchema, permissions, books };

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly permissionsService: PermissionsService,
    private readonly cxt: RequestContextService,
  ) {}

  async getUser({
    clerkUserId,
    email,
  }: {
    clerkUserId?: string;
    email?: string;
  }): Promise<UserResponseDto | undefined> {
    if (!clerkUserId && !email)
      throw new BadRequestException('Missing clerkUserId or email');
    return await this.db.query.users.findFirst({
      where: clerkUserId
        ? eq(schema.users.clerkUserId, clerkUserId)
        : eq(schema.users.email, email!),
    });
  }

  async registerUser(body: CreateUserRequestDto): Promise<UserResponseDto> {
    const [user] = await this.db.insert(schema.users).values(body).returning();
    const invitations = await this.db
      .selectDistinctOn([schema.invitations.bookId])
      .from(schema.invitations)
      .where(eq(schema.invitations.email, body.email));
    if (!user) throw new InternalServerErrorException('Failed to create');
    const permissions = invitations.map(({ bookId, role }) => ({
      bookId,
      role,
      userId: user.id,
    }));
    await this.db.insert(schema.permissions).values(permissions);
    await this.db
      .update(schema.invitations)
      .set({ accepted: true, updatedAt: sql`now()` })
      .where(eq(schema.invitations.email, body.email));
    return user;
  }

  async updateClerkUserId(userId: number, clerkUserId: string): Promise<void> {
    await this.db
      .update(schema.users)
      .set({ clerkUserId, updatedAt: sql`now()` })
      .where(eq(schema.users.id, userId));
  }

  async getInvitations(bookId: number) {
    const user = this.cxt.getUser();
    return await this.db.query.invitations.findMany({
      where: and(
        eq(schema.invitations.bookId, bookId),
        eq(schema.invitations.invitedBy, user.id),
        eq(schema.invitations.accepted, false),
      ),
    });
  }

  async inviteUnregisteredUser(body: InviteUserRequestDto) {
    const currentUser = this.cxt.getUser();
    const [count] = await this.db
      .select({ count: schema.invitations.id })
      .from(schema.invitations);
    if (Number(count?.count) >= 20)
      throw new BadRequestException('Max invites reached');
    const invite = await this.db.query.invitations.findFirst({
      where: and(
        eq(schema.invitations.email, body.email),
        eq(schema.invitations.invitedBy, currentUser.id),
        eq(schema.invitations.bookId, body.bookId),
      ),
    });
    if (invite) throw new BadRequestException('Already invited');
    const [invitation] = await this.db
      .insert(schema.invitations)
      .values({ ...body, invitedBy: currentUser.id })
      .returning();
    return invitation;
  }

  async inviteUser(body: InviteUserRequestDto) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, body.email),
    });
    if (!user) return await this.inviteUnregisteredUser(body);
    const permission = await this.permissionsService.getPermissions({
      bookId: body.bookId,
      userId: user.id,
    });
    if (permission) throw new BadRequestException('User already has access');
    await this.permissionsService.createPermissions({
      bookId: body.bookId,
      role: body.role,
      userId: user.id,
    });
    return 'Success';
  }

  async cancelInvite(id: number) {
    const user = this.cxt.getUser();
    const invite = await this.db.query.invitations.findFirst({
      where: and(eq(schema.invitations.id, id)),
    });
    if (!invite) throw new BadRequestException('Invite not found');
    if (invite.invitedBy !== user.id)
      throw new UnauthorizedException('Unauthorized');
    if (invite.accepted)
      throw new BadRequestException('Invite already accepted');
    await this.db
      .delete(schema.invitations)
      .where(eq(schema.invitations.id, id));
  }

  async getEmails() {
    const { id: userId } = this.cxt.getUser();
    const bookIdsSubquery = this.db
      .select({ bookId: schema.permissions.bookId })
      .from(schema.permissions)
      .where(eq(schema.permissions.userId, userId));

    const rows = await this.db
      .selectDistinct({
        email: schema.users.email,
        name: schema.users.name,
        userId: schema.users.id,
      })
      .from(schema.permissions)
      .leftJoin(schema.users, eq(schema.users.id, schema.permissions.userId))
      .where(
        and(
          inArray(schema.permissions.bookId, bookIdsSubquery),
          ne(schema.users.id, userId),
        ),
      );
    return rows;
  }
}
