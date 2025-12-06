import {
  pgTable,
  serial,
  varchar,
  timestamp,
  numeric,
  integer,
} from 'drizzle-orm/pg-core';
import { users } from '../user/schema';
import { InferSelectModel } from 'drizzle-orm';

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  balance: numeric('balance', { precision: 10, scale: 2 })
    .default('0.00')
    .notNull(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  credited: numeric('credited', { precision: 10, scale: 2 }).default('0.00'),
  debited: numeric('debited', { precision: 10, scale: 2 }).default('0.00'),
  members: integer('members').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Book = InferSelectModel<typeof books>;
