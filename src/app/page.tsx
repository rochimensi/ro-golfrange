"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  TicketIcon,
  ShoppingCartIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { APP_NAME, ADMIN_PIN } from "@/lib/constants";

export default function WelcomePage() {
  const router = useRouter();
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [adminError, setAdminError] = useState(false);
  const adminInputRef = useRef<HTMLInputElement>(null);

  const handleAdminSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (adminCode === ADMIN_PIN) {
        setAdminError(false);
        setAdminModalOpen(false);
        setAdminCode("");
        router.push("/admin");
      } else {
        setAdminError(true);
        setAdminCode("");
        setTimeout(() => adminInputRef.current?.focus(), 0);
      }
    },
    [adminCode, router]
  );

  useEffect(() => {
    if (adminModalOpen) setAdminError(false);
  }, [adminModalOpen]);

  const closeModal = useCallback(() => {
    setAdminModalOpen(false);
    setAdminCode("");
    setAdminError(false);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col text-white">
      <header className="relative flex shrink-0 flex-row items-center justify-center gap-4 border-b border-white/10 px-4 py-4 md:gap-5 md:py-5">
        <button
          type="button"
          onClick={() => setAdminModalOpen(true)}
          className="absolute left-2 top-2 p-1.5 text-white/20 hover:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
          aria-label="Admin"
        >
          <Cog6ToothIcon className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <Image
          src="/Logo_blank.png"
          alt={APP_NAME}
          width={200}
          height={200}
          className="h-28 w-28 shrink-0 object-contain md:h-36 md:w-36"
          priority
        />
        <div className="flex flex-col">
          <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
            {APP_NAME}
          </h1>
          <p className="mt-0.5 text-base text-white/80 md:text-lg">
            Academia Omar Peralta
          </p>
        </div>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col justify-start gap-4 px-6 pt-2 pb-4 md:gap-5 md:px-10 md:pt-3 md:pb-6">
        <p className="text-center font-heading text-xl font-semibold text-white/95 md:text-2xl">
          ¿Qué deseas adquirir?
        </p>

        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 md:gap-5">
          {/* Main CTA: Comprar canasto */}
          <Link
            href="/purchase"
            className="flex flex-col items-center gap-4 rounded-2xl border-2 border-amber-400/50 bg-[#f5efc4] p-6 text-center transition hover:border-amber-400 hover:bg-[#efe8b8] md:min-h-0 md:flex-row md:justify-center md:gap-8 md:py-8"
          >
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#102C1A]/10 md:h-24 md:w-24">
              <ShoppingCartIcon className="h-12 w-12 text-[#102C1A] md:h-14 md:w-14" />
            </span>
            <div className="md:text-left">
              <span className="font-heading text-2xl font-bold text-[#102C1A] md:text-3xl">
                Comprar canasto
              </span>
              <p className="mt-2 text-base text-[#102C1A]/80 md:text-lg">
                30, 60 o 100 pelotas
              </p>
            </div>
          </Link>

          {/* Secondary: Voucher + SportClub */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <Link
              href="/voucher"
              className="flex items-center gap-4 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-left transition hover:border-white/30 hover:bg-white/10 md:py-4"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <TicketIcon className="h-6 w-6 text-amber-400" />
              </span>
              <div className="min-w-0">
                <span className="font-heading text-lg font-semibold md:text-xl">
                  Voucher
                </span>
                <p className="text-sm text-white/75">
                  20 pelotas gratis para usar en el día
                </p>
              </div>
            </Link>

            <Link
              href="/sportclub"
              className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-left transition hover:border-white/30 hover:bg-white/10 md:gap-4 md:py-3"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white md:h-16 md:w-16">
                <Image
                  src="/sportclub-logo.png"
                  alt=""
                  width={64}
                  height={64}
                  className="h-10 w-10 object-contain md:h-12 md:w-12"
                />
              </span>
              <div className="min-w-0">
                <span className="font-heading text-lg font-semibold md:text-xl">
                  SportClub
                </span>
                <p className="text-sm text-white/75">
                  30 pelotas gratis semanalmente
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {adminModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={closeModal}
        >
          <div
            className={`w-full max-w-xs rounded-2xl border bg-[#102C1A] p-6 shadow-xl ${adminError ? "animate-shake border-red-500/50" : "border-white/20"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-lg font-semibold text-white">
              Acceso Admin
            </h3>
            <p className="mt-1 text-sm text-white/70">
              Ingresá el código de 4 dígitos
            </p>
            <form onSubmit={handleAdminSubmit} className="mt-4 space-y-3">
              <input
                ref={adminInputRef}
                type="password"
                inputMode="numeric"
                maxLength={4}
                autoComplete="one-time-code"
                value={adminCode}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setAdminCode(v);
                  setAdminError(false);
                }}
                placeholder="····"
                className={`w-full rounded-xl border bg-white/10 px-4 py-3 text-center text-lg tracking-[0.5em] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 ${
                  adminError
                    ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/50"
                    : "border-white/20 focus:border-amber-500 focus:ring-amber-500/50"
                }`}
                autoFocus
                aria-invalid={adminError}
                aria-describedby={adminError ? "admin-pin-error" : undefined}
              />
              {adminError && (
                <p id="admin-pin-error" className="text-center text-sm text-red-400" role="alert">
                  Código incorrecto. Intentá de nuevo.
                </p>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-white/20 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-[#102C1A] hover:bg-amber-400"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
