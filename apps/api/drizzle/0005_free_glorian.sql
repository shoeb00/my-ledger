ALTER TABLE "invitations" DROP CONSTRAINT "invitations_invited_by_users_email_fk";
--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "invited_by" SET DATA TYPE integer;--> statement-breakpoint

ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;