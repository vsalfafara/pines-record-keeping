CREATE TABLE IF NOT EXISTS "pines-dev"."blocks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."blocks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"property_id" integer,
	"name" varchar NOT NULL,
	"created_by" varchar NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pines-dev"."client_lots" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."client_lots_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_id" integer NOT NULL,
	"property_id" integer NOT NULL,
	"block_id" integer NOT NULL,
	"lot_id" integer NOT NULL,
	"reservation" integer,
	"payment_type" varchar,
	"payment_plan" varchar,
	"in_need" "in_need",
	"downpayment" varchar,
	"discount" integer,
	"months_to_pay" integer,
	"monthly" integer,
	"total_interest" integer,
	"actual_price" integer,
	"balance" integer,
	"agent" varchar,
	"created_by" varchar,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pines-dev"."clients" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."clients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"birth_date" date NOT NULL,
	"email" varchar NOT NULL,
	"full_address" varchar NOT NULL,
	"mobile_number" varchar NOT NULL,
	"landline_number" varchar,
	"created_by" varchar NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pines-dev"."invoices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."invoices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_lot_id" integer NOT NULL,
	"purpose" "purpose" NOT NULL,
	"payment" integer NOT NULL,
	"date_of_payment" date NOT NULL,
	"remarks" varchar,
	"created_by" varchar,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pines-dev"."lots" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."lots_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"block_id" integer,
	"name" varchar NOT NULL,
	"lotType" "lot_type" NOT NULL,
	"price" numeric NOT NULL,
	"remarks" varchar,
	"created_by" varchar NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pines-dev"."perpetual_cares" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."perpetual_cares_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_lot_id" integer NOT NULL,
	"installment_months" integer NOT NULL,
	"due_date" date NOT NULL,
	"payment_due" varchar NOT NULL,
	"paid" integer NOT NULL,
	"remaining_balance" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pines-dev"."properties" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."properties_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"full_address" varchar NOT NULL,
	"number_of_blocks" integer DEFAULT 0,
	"number_of_lots" integer DEFAULT 0,
	"taken_lots" integer DEFAULT 0,
	"available_lots" integer DEFAULT 0,
	"created_by" varchar NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pines-dev"."users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"role" "role" DEFAULT 'ACCOUNTS_CLERK',
	"has_logged_in_once" boolean DEFAULT false,
	"created_by" varchar,
	"created_at" date DEFAULT now() NOT NULL
);
