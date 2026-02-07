import { permissions } from './../permissions/schema';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { users } from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UserResponseDto } from './dto/user-response';
import { CreateUserRequestDto } from './dto/create-user-request';
import { and, eq, inArray, ne, sql } from 'drizzle-orm';
import { PermissionsService } from '../permissions/permissions.service';
import { books } from '../book/schema';
import { RequestContextService } from '../common/request-context.service';
import { ClerkService } from '../clerk/clerk.service';
import { invitations } from '../invitations/schema';

const schema = { users, permissions, books, invitations };

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly permissionsService: PermissionsService,
    private readonly cxt: RequestContextService,
    private readonly clerkService: ClerkService,
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
    const bookIds = invitations.map(({ bookId }) => bookId);
    await this.db.insert(schema.permissions).values(permissions);
    await this.db
      .update(schema.books)
      .set({ members: sql`members + 1` })
      .where(inArray(schema.books.id, bookIds));
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
