import { Roles } from './../permissions/enum/roles';
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  integer,
  text,
} from 'drizzle-orm/pg-core';
import { books } from '../book/schema';
import { pgEnum } from 'drizzle-orm/pg-core';
import { users } from '../user/schema';

export const roleEnum = pgEnum(
  'roles',
  Object.values(Roles) as [string, ...string[]],
);

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  bookId: integer('book_id')
    .notNull()
    .references(() => books.id),
  invitedBy: integer('invited_by')
    .notNull()
    .references(() => users.id),
  email: varchar('email').notNull(),
  role: roleEnum('role').$type<Roles>().notNull(),
  accepted: boolean('accepted').default(false).notNull(),
  clerkInviteId: text('clerk_invite_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
