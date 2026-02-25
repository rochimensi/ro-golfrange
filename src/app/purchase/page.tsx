"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
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
  useRecordTransaction,
  type TransactionBody,
} from "@/lib/useRecordTransaction";
import {
  BASKET_SIZES,
  PRICES,
  type CustomerType,
  type PaymentMethod,
} from "@/lib/types";
import { TransactionErrorAlert } from "@/components/TransactionErrorAlert";

type Step = "customer" | "size" | "payment" | "confirm";

export default function PurchasePage() {
  const { isAutoServicio } = useAutoServicio();
  const [step, setStep] = useState<Step>("customer");
  const [customerType, setCustomerType] = useState<CustomerType | null>(null);
  const [associateNumber, setAssociateNumber] = useState("");
  const [basketSize, setBasketSize] = useState<30 | 60 | 100 | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [matriculaError, setMatriculaError] = useState(false);
  const { recordAndNavigate, error: transactionError, setError: setTransactionError, isSubmitting } = useRecordTransaction();

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
    if (!method || !basketSize) return;
    const body: TransactionBody = {
      flow: "purchase",
      balls: basketSize,
      amount,
      customerType: customerType!,
      paymentMethod: method,
      idempotencyKey: crypto.randomUUID(),
    };
    if (customerType === "SOCIO" && associateNumber.trim()) {
      body.associateNumber = associateNumber.trim();
    }
    recordAndNavigate(body);
  };

  return (
    <div className="flex min-h-screen flex-col text-white">
      <header className="relative flex items-center border-b border-white/10 px-6 py-4">
        <Link
          href="/"
          className="relative z-10 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-3 py-2 text-base text-white/90 transition hover:bg-white/5 hover:text-white md:gap-2.5 md:text-lg"
        >
          <ArrowLeftIcon className="h-5 w-5 md:h-6 md:w-6" />
          INICIO
        </Link>
        <h1 className="absolute left-0 right-0 text-center font-heading text-xl font-bold md:text-2xl pointer-events-none">
          {APP_NAME}
        </h1>
      </header>

      <main className="flex flex-1 flex-col overflow-x-hidden px-6 py-8">
        <div className={`mx-auto w-full space-y-8 ${isAutoServicio ? "max-w-4xl" : "max-w-lg"}`}>
          {step === "customer" && (
            <div className="mx-auto w-full max-w-[512px]">
              <div className="grid grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerType("SOCIO");
                    setStep("size");
                  }}
                  className="min-h-[7rem] rounded-xl border-2 border-amber-500/60 bg-amber-500/15 py-8 text-lg font-medium text-amber-100 transition hover:border-amber-400 hover:bg-amber-500/25 md:min-h-[8rem] md:py-12 md:text-xl"
                >
                  Soy SOCIO
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerType("INVITADO");
                    setStep("size");
                  }}
                  className="min-h-[7rem] rounded-xl border border-white/20 bg-white/5 py-8 text-lg font-medium transition hover:border-white/30 hover:bg-white/10 md:min-h-[8rem] md:py-12 md:text-xl"
                >
                  Soy Invitado
                </button>
              </div>
              <Link
                href="/"
                className="mt-6 block w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-center font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                Cancelar
              </Link>
            </div>
          )}

          {step === "size" && customerType && (
            <>
              <button
                type="button"
                onClick={() => setStep("customer")}
                className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-3 py-2 text-lg text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                <ArrowLeftIcon className="h-5 w-5" aria-hidden />
                {customerType === "SOCIO" ? "No soy socio" : "Soy socio"}
              </button>
              {customerType === "SOCIO" && (
                <div>
                  <label className="block text-lg font-medium text-white/90" htmlFor="associate-number">
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
              <h2 className="font-heading text-3xl font-semibold">
                Elegí el canasto
              </h2>
              <div className="flex justify-center gap-6 px-8 md:px-12">
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
                    className="flex h-[200px] w-[200px] flex-col items-center justify-center rounded-full border-2 border-amber-500/50 bg-amber-500/10 text-amber-100 transition hover:border-amber-400 hover:bg-amber-500/20"
                  >
                    <span className="font-heading text-2xl font-bold text-amber-100 md:text-3xl">
                      {size}
                    </span>
                    <span className="mt-0.5 text-sm text-amber-200/90 md:text-base">
                      pelotas
                    </span>
                    <span className="mt-1.5 text-base font-semibold text-amber-100 md:mt-2 md:text-lg">
                      $
                      {PRICES[customerType][size].toLocaleString("es-AR")}
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
                className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-3 py-2 text-lg text-white/80 transition hover:bg-white/5 hover:text-white"
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
              <>
                <button
                  type="button"
                  onClick={() => setStep("size")}
                  className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-3 py-2 text-lg text-white/80 transition hover:bg-white/5 hover:text-white"
                >
                  <ArrowLeftIcon className="h-5 w-5" aria-hidden />
                  Cambiar canasto
                </button>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[30%_1fr] md:gap-8">
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
                    {transactionError && (
                      <TransactionErrorAlert
                        error={transactionError}
                        onDismiss={() => setTransactionError(null)}
                        className="mt-4"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleFinish(effectivePaymentMethod)}
                      disabled={isSubmitting}
                      className="mt-8 flex h-button-primary w-full items-center justify-center rounded-xl bg-amber-600 px-4 font-medium text-white transition hover:bg-amber-500 disabled:opacity-70 disabled:pointer-events-none"
                    >
                      {isSubmitting ? "Guardando…" : "Confirmar compra"}
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
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setPaymentMethod(null)}
                  className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-3 py-2 text-lg text-white/80 transition hover:bg-white/5 hover:text-white"
                >
                  <ArrowLeftIcon className="h-5 w-5" aria-hidden />
                  Cambiar forma de pago
                </button>
                <div className="rounded-xl border border-white/20 bg-white/5 p-6">
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
                {transactionError && (
                  <TransactionErrorAlert
                    error={transactionError}
                    onDismiss={() => setTransactionError(null)}
                    className="mt-4"
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleFinish(effectivePaymentMethod)}
                  disabled={isSubmitting}
                  className="mt-8 flex h-button-primary w-full items-center justify-center rounded-xl bg-amber-600 px-4 font-medium text-white transition hover:bg-amber-500 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isSubmitting ? "Guardando…" : "Confirmar compra"}
                </button>
                <Link
                  href="/"
                  className="mt-3 block w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-center font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
                >
                  Cancelar
                </Link>
                </div>
              </>
            )
            );
          })()}
        </div>
      </main>
    </div>
  );
}
