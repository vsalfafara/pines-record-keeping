ALTER TABLE "pines-dev"."blocks" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."properties" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."properties" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."blocks" ADD COLUMN "created_by" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."lots" ADD COLUMN "created_by" varchar NOT NULL;