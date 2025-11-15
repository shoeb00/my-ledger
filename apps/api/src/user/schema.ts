import { Roles } from './../permissions/enum/roles';
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core';
import { books } from '../book/schema';
import { pgEnum } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email').unique().notNull(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const roleEnum = pgEnum(
  'roles',
  Object.values(Roles) as [string, ...string[]],
);

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  bookId: integer('book_id')
    .notNull()
    .references(() => books.id),
  invitedBy: varchar('invited_by')
    .notNull()
    .references(() => users.email),
  email: varchar('email').notNull(),
  role: roleEnum('role').$type<Roles>().notNull(),
  accepted: boolean('accepted').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
