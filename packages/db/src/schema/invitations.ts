import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  integer,
  text,
} from 'drizzle-orm/pg-core';
import { books } from './books.js';
import { users } from './users.js';
import { Roles } from './roles.js';
import { roleEnum } from './permissions.js';

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  bookId: integer('book_id')
    .notNull()
    .references(() => books.id, { onDelete: 'cascade' }),
  invitedBy: integer('invited_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  email: varchar('email').notNull(),
  role: roleEnum('role').$type<Roles>().notNull(),
  accepted: boolean('accepted').default(false).notNull(),
  clerkInviteId: text('clerk_invite_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
