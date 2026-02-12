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
import { paymentMethods } from '../payment-method/schema';
import { categories } from '../category/schema';
import { InferSelectModel } from 'drizzle-orm';

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  bookId: integer('book_id')
    .notNull()
    .references(() => books.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  description: varchar('description'),
  paymentMethodId: integer('payment_method_id').references(
    () => paymentMethods.id,
  ),
  categoryId: integer('category_id').references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Transaction = InferSelectModel<typeof transactions>;
