CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"flow" text NOT NULL,
	"balls" integer NOT NULL,
	"amount" integer NOT NULL,
	"customer_type" text,
	"payment_method" text,
	"associate_number" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
