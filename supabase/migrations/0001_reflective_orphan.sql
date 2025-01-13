CREATE TYPE "public"."mode_of_payment" AS ENUM('Bank Transfer', 'Cash Payment', 'Check Payment');--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "modeOfPayment" "mode_of_payment" DEFAULT 'Cash Payment' NOT NULL;