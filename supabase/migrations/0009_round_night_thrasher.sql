CREATE TYPE "public"."lot_type" AS ENUM('Corner', 'Family Estate', 'Inner', 'Pathway', 'Roadside');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pines-dev"."blocks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."blocks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"property_id" integer,
	"name" varchar NOT NULL,
	"created_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pines-dev"."lots" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."lots_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"block_id" integer,
	"name" varchar NOT NULL,
	"note" varchar NOT NULL,
	"lotType" "lot_type" NOT NULL,
	"price" numeric NOT NULL,
	"created_at" date DEFAULT now()
);
