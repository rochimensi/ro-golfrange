"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  APP_NAME,
  AUTO_SERVICIO_MESSAGE,
  TRANSFER_ALIAS,
  TRANSFER_LABEL,
  TRANSFER_TITULAR,
} from "@/lib/constants";
import { useAutoServicio } from "@/lib/useAutoServicio";
import {
  BASKET_SIZES,
  PRICES,
  type CustomerType,
  type PaymentMethod,
} from "@/lib/types";

type Step = "customer" | "size" | "payment" | "confirm";

export default function PurchasePage() {
  const router = useRouter();
  const { isAutoServicio } = useAutoServicio();
  const [step, setStep] = useState<Step>("customer");
  const [customerType, setCustomerType] = useState<CustomerType | null>(null);
  const [associateNumber, setAssociateNumber] = useState("");
  const [basketSize, setBasketSize] = useState<30 | 60 | 100 | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [matriculaError, setMatriculaError] = useState(false);

  const amount =
    customerType && basketSize ? PRICES[customerType][basketSize] : 0;

  // In Auto-Servicio mode, skip payment choice and show summary directly
  useEffect(() => {
    if (step === "payment" && isAutoServicio && !paymentMethod) {
      setPaymentMethod("TRANSFER");
    }
  }, [step, isAutoServicio, paymentMethod]);

  const handleFinish = (effectiveMethod?: PaymentMethod) => {
    const method = effectiveMethod ?? paymentMethod ?? (isAutoServicio ? "TRANSFER" : null);
    if (!method) return;
    const params = new URLSearchParams({
      flow: "purchase",
      balls: String(basketSize!),
      amount: String(amount),
      customerType: customerType!,
      paymentMethod: method,
    });
    if (customerType === "SOCIO" && associateNumber.trim()) {
      params.set("associateNumber", associateNumber.trim());
    }
    params.set("idempotencyKey", crypto.randomUUID());
    router.push(`/thank-you?${params.toString()}`);
  };

  return (
    <div className="flex min-h-screen flex-col text-white">
      <header className="relative flex items-center border-b border-white/10 px-6 py-4">
        <Link
          href="/"
          className="relative z-10 inline-flex items-center gap-2 text-base text-white/90 hover:text-white md:gap-2.5 md:text-lg"
        >
          <ArrowLeftIcon className="h-6 w-6 md:h-7 md:w-7" />
          INICIO
        </Link>
        <h1 className="absolute left-0 right-0 text-center font-heading text-xl font-bold md:text-2xl pointer-events-none">
          {APP_NAME}
        </h1>
      </header>

      <main className="flex flex-1 flex-col overflow-x-hidden px-6 py-8">
        <div className={`mx-auto w-full space-y-8 ${isAutoServicio ? "max-w-4xl" : "max-w-lg"}`}>
          {step === "customer" && (
            <>
              <h2 className="font-heading text-2xl font-semibold md:text-3xl">
                ¿SOCIO o INVITADO?
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerType("SOCIO");
                    setStep("size");
                  }}
                  className="min-h-[7rem] rounded-xl border border-white/20 bg-white/5 py-8 text-lg font-medium transition hover:border-white/30 hover:bg-white/10 md:min-h-[8rem] md:py-12 md:text-xl"
                >
                  SOCIO
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerType("INVITADO");
                    setStep("size");
                  }}
                  className="min-h-[7rem] rounded-xl border border-white/20 bg-white/5 py-8 text-lg font-medium transition hover:border-white/30 hover:bg-white/10 md:min-h-[8rem] md:py-12 md:text-xl"
                >
                  INVITADO
                </button>
              </div>
              <Link
                href="/"
                className="mt-6 block w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-center font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                Cancelar
              </Link>
            </>
          )}

          {step === "size" && (
            <>
              <button
                type="button"
                onClick={() => setStep("customer")}
                className="inline-flex items-center gap-2 text-lg text-white/80 hover:text-white"
              >
                <ArrowLeftIcon className="h-5 w-5" aria-hidden />
                {customerType === "SOCIO" ? "No soy socio" : "Soy socio"}
              </button>
              {customerType === "SOCIO" && (
                <div>
                  <label className="block text-base font-medium text-white/90 md:text-lg" htmlFor="associate-number">
                    Matrícula <span className="text-amber-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="associate-number"
                    type="text"
                    inputMode="numeric"
                    value={associateNumber}
                    onChange={(e) => {
                      setAssociateNumber(e.target.value);
                      setMatriculaError(false);
                    }}
                    onBlur={() => {
                      // Scroll back to top after keyboard closes (iPad/mobile)
                      setTimeout(() => {
                        window.scrollTo(0, 0);
                        document.documentElement.scrollTop = 0;
                        document.body.scrollTop = 0;
                      }, 100);
                    }}
                    placeholder="Ej: 12345"
                    required
                    aria-required="true"
                    aria-invalid={matriculaError}
                    aria-describedby={matriculaError ? "matricula-error" : undefined}
                    className={`mt-2 w-full rounded-lg border bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 ${
                      matriculaError
                        ? "border-amber-500 focus:border-amber-500 focus:ring-amber-500/50"
                        : "border-white/20 focus:border-amber-500 focus:ring-amber-500/50"
                    }`}
                  />
                  {matriculaError && (
                    <p id="matricula-error" className="mt-1.5 text-sm text-amber-400" role="alert">
                      Ingresá tu matrícula para continuar
                    </p>
                  )}
                </div>
              )}
              <h2 className="font-heading text-2xl font-semibold md:text-3xl">
                Elegí el canasto
              </h2>
              <div className="grid gap-4">
                {BASKET_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      if (customerType === "SOCIO" && !associateNumber.trim()) {
                        setMatriculaError(true);
                        return;
                      }
                      setBasketSize(size);
                      setStep("payment");
                    }}
                    className="flex items-center justify-between rounded-xl border border-white/20 bg-white/5 px-5 py-4 text-left transition hover:border-white/30 hover:bg-white/10"
                  >
                    <span className="text-base md:text-lg">
                      {size} pelotas
                    </span>
                    <span className="font-semibold">
                      $
                      {PRICES[customerType!][size].toLocaleString("es-AR")}
                    </span>
                  </button>
                ))}
              </div>
              <Link
                href="/"
                className="mt-6 block w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-center font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                Cancelar
              </Link>
            </>
          )}

          {step === "payment" && !paymentMethod && !isAutoServicio && (
            <>
              <button
                type="button"
                onClick={() => setStep("size")}
                className="inline-flex items-center gap-2 text-lg text-white/80 hover:text-white"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Cambiar canasto
              </button>
              <h2 className="font-heading text-2xl font-semibold md:text-3xl">
                Forma de pago
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CASH")}
                  className="rounded-xl border border-white/20 bg-white/5 py-6 font-medium transition hover:border-white/30 hover:bg-white/10 md:py-8"
                >
                  Efectivo
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("TRANSFER")}
                  className="rounded-xl border border-white/20 bg-white/5 py-6 font-medium transition hover:border-white/30 hover:bg-white/10 md:py-8"
                >
                  Transferencia
                </button>
              </div>
              <Link
                href="/"
                className="mt-6 block w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-center font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                Cancelar
              </Link>
            </>
          )}

          {step === "payment" && (paymentMethod || isAutoServicio) && (() => {
            const effectivePaymentMethod = paymentMethod ?? "TRANSFER";
            return (
            isAutoServicio ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-amber-500/50 bg-amber-500/15 px-5 py-6 text-center md:py-8">
                  <ClockIcon className="h-14 w-14 md:h-16 md:w-16 text-amber-300/90 mb-3 md:mb-4" aria-hidden />
                  <h2 className="font-heading text-xl font-semibold md:text-2xl mb-2 text-amber-200">
                    {AUTO_SERVICIO_MESSAGE.title}
                  </h2>
                  <p className="font-medium tracking-wide text-amber-200 text-base md:text-lg">
                    {AUTO_SERVICIO_MESSAGE.lines[0]}
                  </p>
                  <p className="mt-1 font-medium tracking-wide text-amber-200 text-lg md:text-xl">
                    {AUTO_SERVICIO_MESSAGE.lines[1]}
                  </p>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/5 p-6">
                <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setStep("size")}
                      className="mb-3 inline-flex items-center gap-2 text-lg text-white/80 hover:text-white self-start"
                    >
                      <ArrowLeftIcon className="h-5 w-5" aria-hidden />
                      Cambiar canasto
                    </button>
                    <div className="rounded-lg border border-white/15 bg-white/5 px-4 py-4 text-center">
                      <p className="text-2xl font-bold text-white md:text-3xl">
                        {basketSize} pelotas — ${amount.toLocaleString("es-AR")}
                      </p>
                      <p className="mt-1 text-sm text-white/75">
                        {customerType}
                        {customerType === "SOCIO" && associateNumber.trim() && (
                          <> · {associateNumber.trim()}</>
                        )}
                        {" · "}
                        {effectivePaymentMethod === "CASH" ? "Efectivo" : "Transferencia"}
                      </p>
                    </div>
                    {effectivePaymentMethod === "TRANSFER" && (
                      <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 text-center">
                        <p className="text-sm font-medium uppercase tracking-wider text-amber-400/90">
                          Transferir a
                        </p>
                        <p className="mt-2 text-2xl font-bold text-white md:text-3xl">
                          Alias: {TRANSFER_ALIAS}
                        </p>
                        <p className="mt-1 text-lg font-medium text-white/95">
                          Titular: {TRANSFER_TITULAR}
                        </p>
                        <p className="mt-0.5 text-base text-white/80">
                          {TRANSFER_LABEL}
                        </p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleFinish(effectivePaymentMethod)}
                      className="mt-4 w-full rounded-xl bg-amber-600 px-4 py-4 font-medium text-white transition hover:bg-amber-500"
                    >
                      Confirmar venta
                    </button>
                    <Link
                      href="/"
                      className="mt-3 block w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-center font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
                    >
                      Cancelar
                    </Link>
                </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-white/20 bg-white/5 p-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod(null)}
                  className="mb-3 inline-flex items-center gap-2 text-lg text-white/80 hover:text-white"
                >
                  <ArrowPathIcon className="h-5 w-5" aria-hidden />
                  Cambiar forma de pago
                </button>
                <div className="rounded-lg border border-white/15 bg-white/5 px-4 py-4 text-center">
                  <p className="text-2xl font-bold text-white md:text-3xl">
                    {basketSize} pelotas — ${amount.toLocaleString("es-AR")}
                  </p>
                  <p className="mt-1 text-sm text-white/75">
                    {customerType}
                    {customerType === "SOCIO" && associateNumber.trim() && (
                      <> {associateNumber.trim()}</>
                    )}
                    {" · "}
                    {effectivePaymentMethod === "CASH" ? "Efectivo" : "Transferencia"}
                  </p>
                </div>
                {effectivePaymentMethod === "TRANSFER" && (
                  <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 text-center">
                    <p className="text-sm font-medium uppercase tracking-wider text-amber-400/90">
                      Transferir a
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white md:text-3xl">
                      Alias: {TRANSFER_ALIAS}
                    </p>
                    <p className="mt-1 text-lg font-medium text-white/95">
                      Titular: {TRANSFER_TITULAR}
                    </p>
                    <p className="mt-0.5 text-base text-white/80">
                      {TRANSFER_LABEL}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleFinish(effectivePaymentMethod)}
                  className="mt-4 w-full rounded-xl bg-amber-600 px-4 py-4 font-medium text-white transition hover:bg-amber-500"
                >
                  Confirmar venta
                </button>
                <Link
                  href="/"
                  className="mt-3 block w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-center font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
                >
                  Cancelar
                </Link>
              </div>
            )
            );
          })()}
        </div>
      </main>
    </div>
  );
}
