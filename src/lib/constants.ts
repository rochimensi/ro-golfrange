export const APP_NAME = "R&O Golf Range";

export const VOUCHER_BALLS = 20;
export const SPORTCLUB_BALLS = 30;

export const TRANSFER_ALIAS = "ro.golfrange";
export const TRANSFER_TITULAR = "Antonio Omar Peralta";
export const TRANSFER_LABEL = "Mercado Pago";

/** 4-digit PIN to access Admin (set NEXT_PUBLIC_ADMIN_PIN in .env.local to override) */
export const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "1234";

/** localStorage key for Auto-Servicio mode (admin toggle) */
export const AUTO_SERVICIO_STORAGE_KEY = "ro-golfrange-auto-servicio";

/** Message shown on payment step when Auto-Servicio is ON */
export const AUTO_SERVICIO_MESSAGE = {
  title: "Auto-Servicio",
  lines: [
    "Sr Cliente: Pague con transferencia y retire su canasto",
    "Ya volvemos!",
  ],
} as const;

/** Operating hours text displayed in floating buttons (set NEXT_PUBLIC_OPERATING_HOURS in .env.local to override) */
export const OPERATING_HOURS = process.env.NEXT_PUBLIC_OPERATING_HOURS ?? "Todos los días de 8hs a 18hs";
