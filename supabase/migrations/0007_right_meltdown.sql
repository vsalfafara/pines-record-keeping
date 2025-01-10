CREATE TYPE "public"."type" AS ENUM('Flesh', 'Bone');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pines-dev"."interments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."interments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_lot_id" integer NOT NULL,
	"dig" integer NOT NULL,
	"type" "type" NOT NULL,
	"deceased_name" varchar NOT NULL,
	"deceased_born" date NOT NULL,
	"deceased_died" date NOT NULL,
	"remains_name" varchar NOT NULL,
	"remains_born" date NOT NULL,
	"remains_died" date NOT NULL,
	"interment_date" date NOT NULL,
	"contractor_name" varchar NOT NULL,
	"contractor_mobile_number" varchar NOT NULL,
	"created_by" varchar,
	"created_at" date DEFAULT now() NOT NULL
);
