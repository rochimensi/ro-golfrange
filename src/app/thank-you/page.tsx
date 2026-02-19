"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { APP_NAME } from "@/lib/constants";
import { FLOWS, type FlowType } from "@/lib/types";

const ERROR_MESSAGES = {
  network:
    "No se pudo registrar la transacción. Revisa tu conexión; puedes continuar con normalidad.",
  server:
    "Error del servidor al guardar la transacción. Puedes continuar con normalidad.",
} as const;

function ThankYouContent() {
  const searchParams = useSearchParams();
  const recorded = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recorded.current) return;
    const flow = searchParams.get("flow");
    const balls = searchParams.get("balls");
    const amount = searchParams.get("amount");
    if (
      !flow ||
      !FLOWS.includes(flow as FlowType) ||
      balls == null ||
      amount == null
    ) {
      return;
    }
    recorded.current = true;
    const body: Record<string, unknown> = {
      flow,
      balls: Number(balls),
      amount: Number(amount),
    };
    const idempotencyKey = searchParams.get("idempotencyKey");
    const customerType = searchParams.get("customerType");
    const paymentMethod = searchParams.get("paymentMethod");
    const associateNumber = searchParams.get("associateNumber");
    if (idempotencyKey) body.idempotencyKey = idempotencyKey;
    if (customerType) body.customerType = customerType;
    if (paymentMethod) body.paymentMethod = paymentMethod;
    if (associateNumber) body.associateNumber = associateNumber;
    if (process.env.NODE_ENV === "development") {
      console.log("[thank-you] POST /api/transactions", body);
    }
    fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) setError(ERROR_MESSAGES.server);
      })
      .catch(() => setError(ERROR_MESSAGES.network));
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col text-white">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 border-b border-red-500/30 bg-red-500/15 px-4 py-3 text-sm text-red-100"
        >
          <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <p className="flex-1">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 rounded p-1 text-red-300 hover:bg-red-500/20 hover:text-red-100"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}
      <header className="border-b border-white/10 px-6 py-6 text-center">
        <h1 className="font-heading text-xl font-bold md:text-2xl">
          {APP_NAME}
        </h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-start px-6 pt-10 pb-10">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/20 bg-white/5 p-10 text-center">
          <span className="inline-flex items-center justify-center text-amber-400">
            <CheckCircleIcon className="h-16 w-16 md:h-20 md:w-20" />
          </span>
          <h2 className="mt-6 font-heading text-2xl font-semibold md:text-3xl">
            ¡Muchas gracias!
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Te recomendamos ubicarte en las alfombras o en la
            zona de césped con divisores.
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left">
            <ExclamationTriangleIcon className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" />
            <p className="text-sm text-amber-100/95">
              Te pedimos que procures no pisar el césped donde está indicado.
            </p>
          </div>
          <Link
            href="/"
            className="mt-10 inline-block w-full rounded-xl bg-amber-600 px-4 py-4 font-medium text-white transition hover:bg-amber-500"
          >
            INICIO
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-start justify-center pt-10 text-white">
          Cargando…
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
