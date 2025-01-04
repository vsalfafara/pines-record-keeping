CREATE TABLE IF NOT EXISTS "pines-dev"."client_lots" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."client_lots_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"lot_id" integer NOT NULL,
	"reservation" integer NOT NULL,
	"payment_type" varchar NOT NULL,
	"payment_plan" varchar NOT NULL,
	"in_need" boolean DEFAULT false,
	"terms" varchar NOT NULL,
	"downpayment" varchar NOT NULL,
	"discount" integer,
	"months_to_pay" integer NOT NULL,
	"monthly" integer NOT NULL,
	"total_interest" integer NOT NULL,
	"actual_price" integer NOT NULL,
	"agent" varchar,
	"created_by" varchar NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pines-dev"."clients" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."lots" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pines-dev"."users" ALTER COLUMN "created_at" SET NOT NULL;