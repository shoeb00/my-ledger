import { Module } from '@nestjs/common';
import { DATABASE_CONNECTION } from './database-connection';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as usersSchema from '../user/schema';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          user: configService.getOrThrow('DATABASE_USER'),
          password: configService.getOrThrow('DATABASE_PASSWORD'),
          host: configService.getOrThrow('DATABASE_HOST'),
          database: configService.getOrThrow('DATABASE_NAME'),
          port: configService.getOrThrow('DATABASE_PORT'),
        });
        return drizzle(pool, {
          schema: {
            ...usersSchema,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
