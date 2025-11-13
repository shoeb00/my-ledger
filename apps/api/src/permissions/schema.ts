import {
  serial,
  timestamp,
  pgTable,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { books } from '../book/schema';
import { users } from '../user/schema';
import { Roles } from './enum/roles';

export const roleEnum = pgEnum(
  'roles',
  Object.values(Roles) as [string, ...string[]],
);

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  bookId: integer('book_id')
    .notNull()
    .references(() => books.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  role: roleEnum('role').$type<Roles>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
