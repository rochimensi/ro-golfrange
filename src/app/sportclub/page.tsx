"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { APP_NAME, SPORTCLUB_BALLS } from "@/lib/constants";
import { useRecordTransaction } from "@/lib/useRecordTransaction";
import { TransactionErrorAlert } from "@/components/TransactionErrorAlert";

export default function SportClubPage() {
  const { recordAndNavigate, error, setError, isSubmitting } = useRecordTransaction();

  const handleConfirm = () => {
    recordAndNavigate({
      flow: "sportclub",
      balls: SPORTCLUB_BALLS,
      amount: 0,
      idempotencyKey: crypto.randomUUID(),
    });
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
        <h1 className="absolute left-0 right-0 text-center font-heading text-xl font-bold md:text-2xl">
          {APP_NAME}
        </h1>
      </header>

      <main className="flex flex-1 flex-col px-6 py-6 md:flex-row md:items-start md:gap-10 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[280px] shrink-0 overflow-hidden rounded-2xl bg-black shadow-lg md:mx-0 md:max-w-[35%] md:min-w-[260px]">
          <Image
            src="/sportclub-qr.png"
            alt="SportClub — Escaneá el QR para poder ingresar. Sportclub Carnet. Club Golf los Acantilados"
            width={600}
            height={800}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
        <div className="mt-6 flex flex-1 flex-col justify-start md:mt-0 md:max-w-md">
          <p className="text-center text-lg text-white/90 md:text-left md:text-xl">
            Como socio SportClub tenés derecho a un canasto de{" "}
            <strong className="text-white">{SPORTCLUB_BALLS} pelotas gratis</strong>. <br/><br/>Escaneá el QR con tu <strong>App de SportClub</strong> y
            confirmá en caja.
          </p>
          {error && (
            <TransactionErrorAlert
              error={error}
              onDismiss={() => setError(null)}
              className="mt-6"
            />
          )}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="mt-8 w-full rounded-xl bg-amber-600 px-6 py-5 text-lg font-semibold text-white transition hover:bg-amber-500 md:mt-10 md:py-6 md:text-xl disabled:opacity-70 disabled:pointer-events-none"
          >
            {isSubmitting ? "Guardando…" : "Confirmar 30 pelotas gratis"}
          </button>
          <Link
            href="/"
            className="mt-4 block w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-center text-lg font-medium text-white/80 transition hover:bg-white/5 hover:text-white md:py-4"
          >
            Cancelar
          </Link>
        </div>
      </main>
    </div>
  );
}
