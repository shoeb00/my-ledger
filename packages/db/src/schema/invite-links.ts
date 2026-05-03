import {
    pgTable,
    serial,
    timestamp,
    integer,
    text,
} from 'drizzle-orm/pg-core';
import { books } from './books.js';

export const inviteLinks = pgTable('invite_links', {
    id: serial('id').primaryKey(),
    bookId: integer('book_id')
        .notNull()
        .references(() => books.id, { onDelete: 'cascade' }),
    token: text('token').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
