"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { CustomerType, FlowType, PaymentMethod } from "@/lib/types";

export interface TransactionBody {
  flow: FlowType;
  balls: number;
  amount: number;
  idempotencyKey?: string;
  customerType?: CustomerType;
  paymentMethod?: PaymentMethod;
  associateNumber?: string;
}

const ERROR_MESSAGES = {
  network:
    "No se pudo registrar la transacción. Revisa tu conexión; puedes continuar con normalidad.",
  server:
    "Error del servidor al guardar la transacción. Puedes continuar con normalidad.",
} as const;

export function useRecordTransaction() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recordAndNavigate = useCallback(
    async (body: TransactionBody) => {
      setError(null);
      setIsSubmitting(true);
      const bodyWithKey = {
        ...body,
        idempotencyKey: body.idempotencyKey ?? crypto.randomUUID(),
      };
      try {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyWithKey),
        });
        if (!res.ok) {
          setError(ERROR_MESSAGES.server);
          return;
        }
        router.push("/thank-you");
      } catch {
        setError(ERROR_MESSAGES.network);
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  return { recordAndNavigate, error, setError, isSubmitting };
}
