import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email').unique().notNull(),
    name: varchar('name').notNull(),
    // timeZone: varchar('time_zone').notNull(),
    clerkUserId: varchar('clerk_user_id').unique().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
