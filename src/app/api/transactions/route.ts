import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { FLOWS, type FlowType, type CustomerType, type PaymentMethod } from "@/lib/types";
const CUSTOMER_TYPES: CustomerType[] = ["SOCIO", "INVITADO"];
const PAYMENT_METHODS: PaymentMethod[] = ["CASH", "TRANSFER"];

function parseBody(body: unknown): {
  flow: FlowType;
  balls: number;
  amount: number;
  idempotencyKey?: string;
  customerType?: CustomerType;
  paymentMethod?: PaymentMethod;
  associateNumber?: string;
} | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const flow = o.flow;
  const balls = o.balls;
  const amount = o.amount;
  if (
    typeof flow !== "string" ||
    !FLOWS.includes(flow as FlowType) ||
    typeof balls !== "number" ||
    typeof amount !== "number"
  ) {
    return null;
  }
  const idempotencyKey =
    o.idempotencyKey != null && typeof o.idempotencyKey === "string"
      ? o.idempotencyKey
      : undefined;
  const customerType =
    o.customerType != null && CUSTOMER_TYPES.includes(o.customerType as CustomerType)
      ? (o.customerType as CustomerType)
      : undefined;
  const paymentMethod =
    o.paymentMethod != null && PAYMENT_METHODS.includes(o.paymentMethod as PaymentMethod)
      ? (o.paymentMethod as PaymentMethod)
      : undefined;
  const associateNumber =
    o.associateNumber != null && typeof o.associateNumber === "string"
      ? o.associateNumber
      : undefined;
  return {
    flow: flow as FlowType,
    balls,
    amount,
    idempotencyKey,
    customerType,
    paymentMethod,
    associateNumber,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = parseBody(body);
    if (!data) {
      return NextResponse.json(
        { error: "Invalid body: flow, balls, amount required" },
        { status: 400 }
      );
    }
    await db.insert(transactions).values({
      idempotencyKey: data.idempotencyKey ?? null,
      flow: data.flow,
      balls: data.balls,
      amount: data.amount,
      customerType: data.customerType ?? null,
      paymentMethod: data.paymentMethod ?? null,
      associateNumber: data.associateNumber ?? null,
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : null;
    // 23505 = PostgreSQL unique_violation (duplicate idempotency key → treat as success)
    if (code === "23505") {
      return NextResponse.json({ ok: true });
    }
    console.error("POST /api/transactions:", err);
    return NextResponse.json(
      { error: "Failed to save transaction" },
      { status: 500 }
    );
  }
}
