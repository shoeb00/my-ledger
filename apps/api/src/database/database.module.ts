import { Module } from '@nestjs/common';
import { DATABASE_CONNECTION, DATABASE_POOL } from './database-connection';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DatabaseHealthService } from './database.health';
import { DatabaseInitService } from './database.init';
import { createDb } from '@my-ledger/db/connection';

@Module({
  providers: [
    {
      provide: DATABASE_POOL,
      useFactory: (configService: ConfigService) => {
        return new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
          ssl: {
            rejectUnauthorized: false,
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: DATABASE_CONNECTION,
      useFactory: (pool: Pool) => {
        return createDb(pool);
      },
      inject: [DATABASE_POOL],
    },
    DatabaseHealthService,
    DatabaseInitService,
  ],
  exports: [DATABASE_CONNECTION, DATABASE_POOL, DatabaseHealthService],
})
export class DatabaseModule { }
