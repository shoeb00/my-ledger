import { permissions } from './../permissions/schema';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as usersSchema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UserResponseDto } from './dto/user-response';
import { CreateUserRequestDto } from './dto/create-user-request';
import { and, eq, SQL } from 'drizzle-orm';
import { InviteUserRequestDto } from './dto/invite-user-request';
import { PermissionsService } from '../permissions/permissions.service';
import { rolesEnum } from '../permissions/dto/create-or-update-permissions-request';
import { BookService } from '../book/book.service';
import { books } from '../book/schema';
import { GetUserRequestDto } from './dto/get-user-request';

const schema = { ...usersSchema, permissions, books };

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly permissionsService: PermissionsService,
    private readonly bookService: BookService,
  ) {}

  async getUser(query: GetUserRequestDto) {
    const clauses: SQL[] = [];

    if (query.email) clauses.push(eq(schema.users.email, query.email));
    if (query.id) clauses.push(eq(schema.users.id, query.id));
    if (query.clerkUserId)
      clauses.push(eq(schema.users.clerkUserId, query.clerkUserId));

    if (clauses.length === 0) {
      throw new BadRequestException('No query provided');
    }

    const whereExpr = clauses.length === 1 ? clauses[0] : and(...clauses);
    return await this.db.query.users.findFirst({
      where: whereExpr,
    });
  }

  async registerUser(body: CreateUserRequestDto): Promise<UserResponseDto> {
    const [user] = await this.db.insert(schema.users).values(body).returning();
    const invitations = await this.db.query.invitations.findMany({
      where: eq(schema.invitations.email, body.email),
    });
    if (!user) throw new InternalServerErrorException('Failed to create');
    for (const { id, role, bookId } of invitations) {
      const userRole = role as rolesEnum;
      await this.db
        .update(schema.invitations)
        .set({ accepted: true })
        .where(eq(schema.invitations.id, id));
      await this.permissionsService.createPermissions({
        bookId,
        userId: user.id,
        role: userRole,
      });
    }
    return user;
  }

  async getInvitations(email: string) {
    return await this.db.query.invitations.findMany({
      where: eq(schema.invitations.invitedBy, email),
    });
  }

  async inviteUser(body: InviteUserRequestDto) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, body.email),
    });
    if (!user) {
      const [count] = await this.db
        .select({ count: schema.invitations.id })
        .from(schema.invitations);
      if (Number(count?.count) >= 20)
        throw new BadRequestException('Max invites reached');
      const [invitation] = await this.db
        .insert(schema.invitations)
        .values(body)
        .returning();
      return invitation;
    }
    const book = await this.bookService.getBooks({
      userId: user.id,
      bookId: body.bookId,
    });
    if (book.length) throw new BadRequestException('User already has access');
    await this.permissionsService.createPermissions({
      bookId: body.bookId,
      userId: user.id,
      role: body.role,
    });
    return 'Success';
  }

  async cancelInvite(id: number) {
    const [row] = await this.db
      .delete(schema.invitations)
      .where(
        and(
          eq(schema.invitations.id, id),
          eq(schema.invitations.accepted, false),
        ),
      )
      .returning();
    if (!row)
      throw new BadRequestException('Invite not found or already accepted');
    return row;
  }

  async getEmails(userId: number) {
    return await this.db
      .select({ email: schema.users.email, userId: schema.users.id })
      .from(schema.permissions)
      .leftJoin(
        schema.users,
        eq(schema.books.userId, schema.permissions.userId),
      )
      .where(eq(schema.permissions.userId, userId));
  }
}
