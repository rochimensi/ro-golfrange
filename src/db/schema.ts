import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import type { FlowType, CustomerType, PaymentMethod } from "@/lib/types";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  idempotencyKey: text("idempotency_key").unique(),
  flow: text("flow").$type<FlowType>().notNull(),
  balls: integer("balls").notNull(),
  amount: integer("amount").notNull(),
  customerType: text("customer_type").$type<CustomerType>(),
  paymentMethod: text("payment_method").$type<PaymentMethod>(),
  associateNumber: text("associate_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
