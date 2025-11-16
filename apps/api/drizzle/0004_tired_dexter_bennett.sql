ALTER TABLE "books" ALTER COLUMN "members" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_user_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id");