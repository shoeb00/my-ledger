import { serial, timestamp, pgTable, integer } from 'drizzle-orm/pg-core';
import { books } from '../book/schema';
import { users } from '../user/schema';
import { Roles } from './enum/roles';
import { pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum(
  'roles',
  Object.values(Roles) as [string, ...string[]],
);

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  bookId: integer('book_id')
    .notNull()
    .references(() => books.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: roleEnum('role').$type<Roles>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
