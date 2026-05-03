import { schema, and, eq, inArray, ne, sql } from '@my-ledger/db';
import type { DB } from '@my-ledger/db/connection';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { UserResponseDto } from './dto/user-response';
import { CreateUserRequestDto } from './dto/create-user-request';
import { RequestContextService } from '../common/request-context.service';


@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: DB,
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
    return await this.db.transaction(async (tx) => {
      const [user] = await tx.insert(schema.users).values(body).returning();
      if (!user) throw new InternalServerErrorException('Failed to create');

      const invitationsRes = await tx
        .selectDistinctOn([schema.invitations.bookId])
        .from(schema.invitations)
        .where(eq(schema.invitations.email, body.email));

      if (invitationsRes.length > 0) {
        const permissions = invitationsRes.map(({ bookId, role }) => ({
          bookId,
          role,
          userId: user.id,
        }));
        const bookIds = invitationsRes.map(({ bookId }) => bookId);
        
        await tx.insert(schema.permissions).values(permissions);
        await tx
          .update(schema.books)
          .set({ members: sql`members + 1` })
          .where(inArray(schema.books.id, bookIds));
      }

      await tx
        .update(schema.invitations)
        .set({ accepted: true, updatedAt: sql`now()` })
        .where(eq(schema.invitations.email, body.email));

      return user;
    });
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
