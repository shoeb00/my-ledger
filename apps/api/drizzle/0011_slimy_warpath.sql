ALTER TABLE "transactions" DROP COLUMN IF EXISTS "payment_type";
--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN IF EXISTS "category";
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "payment_method_id" integer;
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "category_id" integer;
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payment_method_id_payment_methods_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
