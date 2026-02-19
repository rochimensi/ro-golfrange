import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { parseTransactionBody } from "@/lib/parseTransactionBody";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = parseTransactionBody(body);
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
