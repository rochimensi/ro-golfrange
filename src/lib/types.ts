export type CustomerType = "SOCIO" | "INVITADO";
export type PaymentMethod = "CASH" | "TRANSFER";
export type FlowType = "voucher" | "sportclub" | "purchase";

/** Valid flow values for URL/API validation */
export const FLOWS: FlowType[] = ["purchase", "voucher", "sportclub"];

export const BASKET_SIZES = [30, 60, 100] as const;
export type BasketSize = (typeof BASKET_SIZES)[number];

export const PRICES: Record<CustomerType, Record<BasketSize, number>> = {
  SOCIO: { 30: 6000, 60: 10000, 100: 14000 },
  INVITADO: { 30: 8000, 60: 12000, 100: 16000 },
};

export interface PurchaseSummary {
  flow: FlowType;
  balls: number;
  amount: number; // 0 for free flows
  customerType?: CustomerType;
  paymentMethod?: PaymentMethod;
  associateNumber?: string;
}
