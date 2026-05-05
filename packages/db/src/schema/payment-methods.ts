import {
    serial,
    timestamp,
    pgTable,
    integer,
    varchar,
} from 'drizzle-orm/pg-core';
import { books } from './books.js';
import { InferSelectModel } from 'drizzle-orm';

export const paymentMethods = pgTable('payment_methods', {
    id: serial('id').primaryKey(),
    bookId: integer('book_id')
        .notNull()
        .references(() => books.id, { onDelete: 'cascade' }),
    name: varchar('name').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type PaymentMethod = InferSelectModel<typeof paymentMethods>;
