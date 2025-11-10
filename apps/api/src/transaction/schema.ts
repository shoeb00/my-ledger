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

export const transaction = pgTable('transactions', {
  id: serial('id').primaryKey(),
  bookId: integer('book_id')
    .notNull()
    .references(() => books.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  description: varchar('description'),
  paymentType: varchar('payment_type'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
