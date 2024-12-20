CREATE TABLE IF NOT EXISTS "pines-dev"."clients" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."clients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"birth_date" date NOT NULL,
	"email" varchar NOT NULL,
	"full_address" varchar NOT NULL,
	"mobile_number" varchar NOT NULL,
	"landline_number" varchar NOT NULL,
	"created_by" varchar NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
