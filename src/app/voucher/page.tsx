"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TicketIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { APP_NAME, VOUCHER_BALLS } from "@/lib/constants";

export default function VoucherPage() {
  const router = useRouter();

  const handleRedeem = () => {
    const params = new URLSearchParams({
      flow: "voucher",
      balls: String(VOUCHER_BALLS),
      amount: "0",
    });
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
        <h1 className="absolute left-0 right-0 text-center font-heading text-xl font-bold md:text-2xl">
          {APP_NAME}
        </h1>
      </header>

      <main className="flex flex-1 flex-col px-6 py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/20 bg-white/5 p-8">
          <div className="text-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <TicketIcon className="h-9 w-9 text-amber-400" />
            </span>
            <h2 className="mt-4 font-heading text-2xl font-semibold md:text-3xl">
              Voucher
            </h2>
            <p className="mt-3 text-lg text-white/85">
              Canjeás <strong>{VOUCHER_BALLS} pelotas gratis</strong> con tu
              voucher.
            </p>
            <div
              className="mt-4 flex items-start gap-3 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3"
              role="status"
              aria-live="polite"
            >
              <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
              <p className="text-sm font-medium text-sky-100">
                Entrega tu ticket de Voucher aquí para su validación.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRedeem}
            className="mt-8 w-full rounded-xl bg-amber-600 px-4 py-4 font-medium text-white transition hover:bg-amber-500"
          >
            Canjear 20 pelotas gratis
          </button>
          <Link
            href="/"
            className="mt-4 block w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-center font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            Cancelar
          </Link>
        </div>
      </main>
    </div>
  );
}
