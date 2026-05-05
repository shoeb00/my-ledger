import {
  serial,
  timestamp,
  pgTable,
  integer,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { books } from './books.js';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  bookId: integer('book_id')
    .notNull()
    .references(() => books.id, { onDelete: 'cascade' }),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Category = InferSelectModel<typeof categories>;
