import {
  serial,
  timestamp,
  pgTable,
  integer,
  varchar,
} from 'drizzle-orm/pg-core';
import { books } from '../book/schema';
import { InferSelectModel } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  bookId: integer('book_id')
    .notNull()
    .references(() => books.id),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Category = InferSelectModel<typeof categories>;
