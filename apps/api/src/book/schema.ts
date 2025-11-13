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
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  balance: numeric('balance', { precision: 10, scale: 2 })
    .default('0.00')
    .notNull(),
  name: varchar('name').notNull(),
  credited: numeric('credited', { precision: 10, scale: 2 }).default('0.00'),
  debited: numeric('debited', { precision: 10, scale: 2 }).default('0.00'),
  description: varchar('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
