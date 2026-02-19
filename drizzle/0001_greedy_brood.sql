ALTER TABLE "transactions" ADD COLUMN "idempotency_key" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_idempotency_key_unique" UNIQUE("idempotency_key");