import { FLOWS, type FlowType, type CustomerType, type PaymentMethod } from "@/lib/types";

const CUSTOMER_TYPES: CustomerType[] = ["SOCIO", "INVITADO"];
const PAYMENT_METHODS: PaymentMethod[] = ["CASH", "TRANSFER"];

export function parseTransactionBody(body: unknown): {
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
