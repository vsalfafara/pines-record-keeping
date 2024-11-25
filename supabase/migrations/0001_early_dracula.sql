CREATE TABLE IF NOT EXISTS "pines-dev"."properties" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pines-dev"."properties_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar,
	"number_of_blocks" integer,
	"number_of_lots" integer,
	"taken_lots" integer,
	"available_lots" integer,
	"created_by" varchar
);
