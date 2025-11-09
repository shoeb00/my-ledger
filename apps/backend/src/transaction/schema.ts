import {
  serial,
  timestamp,
  pgTable,
  numeric,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';
import { books } from '../book/schema';
import { users } from '../user/schema';

export const transaction = pgTable('transaction', {
  id: serial().primaryKey(),
  bookId: integer()
    .notNull()
    .references(() => books.id),
  userId: integer()
    .notNull()
    .references(() => users.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  description: varchar(),
  paymentType: varchar(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
