ALTER TABLE "pines-dev"."client_lots" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."expenses" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."invoices" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."properties" ALTER COLUMN "created_on" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pines-dev"."users" ALTER COLUMN "created_by" SET NOT NULL;