import { schema, and, eq, sql } from '@my-ledger/db';
import type { DB } from '@my-ledger/db/connection';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { SavePermissionsRequestDto } from './dto/update-permissions-request';
import { PermissionsResponse } from './dto/permissions-response';
import { GetPermissionsRequestDto } from './dto/get-permissions-request';
import { DeletePermissionRequestDto } from './dto/delete-permission-request';
import { RequestContextService } from '../common/request-context.service';
import { Roles } from './enum/roles';
import { UpdatePermissionsRequestDto } from './dto/create-permissions-request';


@Injectable()
export class PermissionsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: DB,
    private readonly cxt: RequestContextService,
  ) {}

  async getPermissions(
    body: GetPermissionsRequestDto,
  ): Promise<PermissionsResponse | undefined> {
    const user = this.cxt.getUser();
    return await this.db.query.permissions.findFirst({
      where: and(
        eq(schema.permissions.userId, body.userId || user.id),
        eq(schema.permissions.bookId, body.bookId),
      ),
    });
  }

  async createPermissions(body: SavePermissionsRequestDto) {
    body.userId ??= this.cxt.getUser().id;
    const [row] = await this.db
      .insert(schema.permissions)
      .values({ ...body, userId: body.userId })
      .returning();
    if (!row) throw new InternalServerErrorException('Failed to update');
    await this.db
      .update(schema.books)
      .set({ members: sql`members + 1`, updatedAt: sql`now()` })
      .where(eq(schema.books.id, body.bookId));
    return row;
  }

  async updatePermissions(
    body: UpdatePermissionsRequestDto,
  ): Promise<PermissionsResponse> {
    const user = this.cxt.getUser();
    if (user.id === body.userId)
      throw new BadRequestException('Cannot update author permissions');
    const userId = await this.db.query.users.findFirst({
      where: eq(schema.users.id, body.userId),
    });
    if (!userId) throw new BadRequestException('User not found');
    const permission = await this.db.query.permissions.findFirst({
      where: and(
        eq(schema.permissions.userId, body.userId || user.id),
        eq(schema.permissions.bookId, body.bookId),
      ),
    });
    if (!permission) throw new BadRequestException('Permission not found');
    if (permission.role === body.role) return permission;
    const [row] = await this.db
      .update(schema.permissions)
      .set({ role: body.role, updatedAt: sql`now()` })
      .where(eq(schema.permissions.id, permission.id))
      .returning();
    if (!row) throw new InternalServerErrorException('Failed to update');
    return row;
  }

  async deletePermission(query: DeletePermissionRequestDto) {
    const permission = await this.db.query.permissions.findFirst({
      where: and(
        eq(schema.permissions.userId, query.userId),
        eq(schema.permissions.bookId, query.bookId),
      ),
    });
    if (!permission) throw new BadRequestException('Permission not found');
    if (permission.role === Roles.AUTHOR)
      throw new BadRequestException('Cannot delete author permissions');
    await this.db.transaction(async () => {
      await this.db
        .delete(schema.permissions)
        .where(eq(schema.permissions.id, permission.id));
      await this.db
        .update(schema.books)
        .set({
          members: sql`members - 1`,
          updatedAt: sql`now()`,
        })
        .where(eq(schema.books.id, query.bookId));
    });
  }
}
