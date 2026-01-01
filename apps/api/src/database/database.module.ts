import { Module } from '@nestjs/common';
import { DATABASE_CONNECTION, DATABASE_POOL } from './database-connection';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as usersSchema from '../user/schema';
import * as booksSchema from '../book/schema';
import * as transactionSchema from '../transaction/schema';
import * as permissionSchema from '../permissions/schema';
import { DatabaseHealthService } from './database.health';
import { DatabaseInitService } from './database.init';

@Module({
  providers: [
    {
      provide: DATABASE_POOL,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          user: configService.getOrThrow('DATABASE_USER'),
          password: configService.getOrThrow('DATABASE_PASSWORD'),
          host: configService.getOrThrow('DATABASE_HOST'),
          database: configService.getOrThrow('DATABASE_NAME'),
          port: configService.getOrThrow('DATABASE_PORT'),
        });
        return pool;
      },
      inject: [ConfigService],
    },
    {
      provide: DATABASE_CONNECTION,
      useFactory: (pool: Pool) => {
        return drizzle(pool, {
          schema: {
            ...usersSchema,
            ...booksSchema,
            ...transactionSchema,
            ...permissionSchema,
          },
          casing: 'snake_case',
        });
      },
      inject: [DATABASE_POOL],
    },
    DatabaseHealthService,
    DatabaseInitService,
  ],
  exports: [DATABASE_CONNECTION, DATABASE_POOL, DatabaseHealthService],
})
export class DatabaseModule {}
