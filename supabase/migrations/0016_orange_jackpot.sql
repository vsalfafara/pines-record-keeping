ALTER TABLE "pines-dev"."client_lots" ALTER COLUMN "payment_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."client_lots" ALTER COLUMN "payment_plan" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."client_lots" ALTER COLUMN "terms" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."client_lots" ALTER COLUMN "downpayment" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."client_lots" ALTER COLUMN "months_to_pay" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."client_lots" ALTER COLUMN "monthly" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."client_lots" ALTER COLUMN "total_interest" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."client_lots" ALTER COLUMN "actual_price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."client_lots" ALTER COLUMN "created_by" DROP NOT NULL;