import { describe, it, expect } from "vitest";
import { FLOWS, PRICES, BASKET_SIZES } from "./types";

describe("lib/types", () => {
  describe("FLOWS", () => {
    it("includes all expected flow values", () => {
      expect(FLOWS).toContain("purchase");
      expect(FLOWS).toContain("voucher");
      expect(FLOWS).toContain("sportclub");
      expect(FLOWS).toHaveLength(3);
    });
  });

  describe("BASKET_SIZES", () => {
    it("includes 30, 60, 100", () => {
      expect(BASKET_SIZES).toEqual([30, 60, 100]);
    });
  });

  describe("PRICES", () => {
    it("has prices for SOCIO and INVITADO", () => {
      expect(PRICES.SOCIO).toBeDefined();
      expect(PRICES.INVITADO).toBeDefined();
    });

    it("has price for each basket size per customer type", () => {
      for (const customerType of ["SOCIO", "INVITADO"] as const) {
        for (const size of BASKET_SIZES) {
          const price = PRICES[customerType][size];
          expect(typeof price).toBe("number");
          expect(price).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it("SOCIO prices are lower than or equal to INVITADO for same basket", () => {
      for (const size of BASKET_SIZES) {
        expect(PRICES.SOCIO[size]).toBeLessThanOrEqual(PRICES.INVITADO[size]);
      }
    });

    it("matches expected known values", () => {
      expect(PRICES.SOCIO[30]).toBe(6000);
      expect(PRICES.SOCIO[60]).toBe(10000);
      expect(PRICES.SOCIO[100]).toBe(14000);
      expect(PRICES.INVITADO[30]).toBe(8000);
      expect(PRICES.INVITADO[60]).toBe(12000);
      expect(PRICES.INVITADO[100]).toBe(16000);
    });
  });
});
