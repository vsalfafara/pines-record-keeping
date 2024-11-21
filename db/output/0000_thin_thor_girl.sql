
--> statement-breakpoint
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
	"created_at" date DEFAULT now()
);
