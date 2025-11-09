import {
  pgTable,
  serial,
  varchar,
  timestamp,
  numeric,
  integer,
} from 'drizzle-orm/pg-core';
import { users } from '../user/schema';

export const books = pgTable('books', {
  id: serial().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => users.id),
  balance: numeric('balance', { precision: 10, scale: 2 })
    .default('0.00')
    .notNull(),
  name: varchar().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
