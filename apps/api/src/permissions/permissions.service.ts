import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as permissionsSchema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { SavePermissionsRequestDto } from './dto/create-or-update-permissions-request';
import { PermissionsResponse } from './dto/permissions-response';
import { GetPermissionsRequestDto } from './dto/get-permissions-request';
import { and, eq, sql } from 'drizzle-orm';
import * as booksSchema from '../book/schema';
import { DeletePermissionRequestDto } from './dto/delete-permission-request';

const schema = { ...permissionsSchema, ...booksSchema };

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getPermissions(
    body: GetPermissionsRequestDto,
  ): Promise<PermissionsResponse | undefined> {
    return await this.db.query.permissions.findFirst({
      where: and(
        eq(schema.permissions.userId, body.userId),
        eq(schema.permissions.bookId, body.bookId),
      ),
    });
  }

  async createPermissions(body: SavePermissionsRequestDto) {
    const [row] = await this.db
      .insert(schema.permissions)
      .values(body)
      .returning();
    if (!row) throw new InternalServerErrorException('Failed to update');
    await this.db
      .update(schema.books)
      .set({ members: sql`members + 1` })
      .where(eq(schema.books.id, body.bookId));
    return row;
  }

  async updatePermissions(
    body: SavePermissionsRequestDto,
  ): Promise<PermissionsResponse> {
    const [row] = await this.db
      .update(schema.permissions)
      .set(body)
      .returning();
    if (!row) throw new InternalServerErrorException('Failed to update');
    return row;
  }

  async deletePermission(query: DeletePermissionRequestDto) {
    const [row] = await this.db
      .delete(schema.permissions)
      .where(
        and(
          eq(schema.permissions.userId, query.userId),
          eq(schema.permissions.bookId, query.bookId),
        ),
      )
      .returning();
    if (!row) throw new InternalServerErrorException('Failed to update');
    await this.db
      .update(schema.books)
      .set({ members: sql`members - 1` })
      .where(eq(schema.books.id, query.bookId));
    return row;
  }
}
