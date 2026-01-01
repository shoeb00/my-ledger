import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_POOL } from './database-connection';
import { Pool } from 'pg';

@Injectable()
export class DatabaseHealthService {
  constructor(
    @Inject(DATABASE_POOL)
    private readonly db_pool: Pool,
  ) {}

  async check() {
    try {
      await this.db_pool.query('SELECT 1');
      return { status: 'up' } as const;
    } catch (err) {
      console.error(err);
      return { status: 'down' } as const;
    }
  }
}
