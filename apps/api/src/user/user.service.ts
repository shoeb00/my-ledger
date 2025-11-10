import { Inject, Injectable, Post } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UserResponseDto } from './dto/user-response';
import { CreateUserRequestDto } from './dto/create-user-request';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  @Post()
  async registerUser(
    body: CreateUserRequestDto,
  ): Promise<UserResponseDto | undefined> {
    const [user] = await this.db.insert(schema.users).values(body).returning();
    return user;
  }
}
