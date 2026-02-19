import { describe, it, expect } from "vitest";
import { parseTransactionBody } from "./parseTransactionBody";

describe("parseTransactionBody", () => {
  it("returns null for null or non-object body", () => {
    expect(parseTransactionBody(null)).toBeNull();
    expect(parseTransactionBody(undefined)).toBeNull();
    expect(parseTransactionBody("")).toBeNull();
    expect(parseTransactionBody(123)).toBeNull();
    expect(parseTransactionBody([])).toBeNull();
  });

  it("returns null when flow, balls, or amount are missing or invalid", () => {
    expect(parseTransactionBody({})).toBeNull();
    expect(parseTransactionBody({ flow: "purchase" })).toBeNull();
    expect(parseTransactionBody({ flow: "purchase", balls: 30 })).toBeNull();
    expect(parseTransactionBody({ flow: "purchase", balls: 30, amount: "1000" })).toBeNull();
    expect(parseTransactionBody({ flow: "purchase", balls: "30", amount: 6000 })).toBeNull();
    expect(parseTransactionBody({ flow: "invalid", balls: 30, amount: 6000 })).toBeNull();
  });

  it("accepts valid flow values", () => {
    expect(parseTransactionBody({ flow: "purchase", balls: 30, amount: 6000 })).toMatchObject({
      flow: "purchase",
      balls: 30,
      amount: 6000,
    });
    expect(parseTransactionBody({ flow: "voucher", balls: 20, amount: 0 })).toMatchObject({
      flow: "voucher",
      balls: 20,
      amount: 0,
    });
    expect(parseTransactionBody({ flow: "sportclub", balls: 30, amount: 0 })).toMatchObject({
      flow: "sportclub",
      balls: 30,
      amount: 0,
    });
  });

  it("parses optional idempotencyKey when present", () => {
    const result = parseTransactionBody({
      flow: "purchase",
      balls: 30,
      amount: 6000,
      idempotencyKey: "key-123",
    });
    expect(result).not.toBeNull();
    expect(result!.idempotencyKey).toBe("key-123");
  });

  it("ignores invalid idempotencyKey (non-string)", () => {
    const result = parseTransactionBody({
      flow: "purchase",
      balls: 30,
      amount: 6000,
      idempotencyKey: 123,
    });
    expect(result).not.toBeNull();
    expect(result!.idempotencyKey).toBeUndefined();
  });

  it("parses optional customerType when valid", () => {
    expect(
      parseTransactionBody({
        flow: "purchase",
        balls: 30,
        amount: 6000,
        customerType: "SOCIO",
      })!.customerType
    ).toBe("SOCIO");
    expect(
      parseTransactionBody({
        flow: "purchase",
        balls: 30,
        amount: 6000,
        customerType: "INVITADO",
      })!.customerType
    ).toBe("INVITADO");
  });

  it("ignores invalid customerType", () => {
    const result = parseTransactionBody({
      flow: "purchase",
      balls: 30,
      amount: 6000,
      customerType: "OTHER",
    });
    expect(result).not.toBeNull();
    expect(result!.customerType).toBeUndefined();
  });

  it("parses optional paymentMethod when valid", () => {
    expect(
      parseTransactionBody({
        flow: "purchase",
        balls: 30,
        amount: 6000,
        paymentMethod: "CASH",
      })!.paymentMethod
    ).toBe("CASH");
    expect(
      parseTransactionBody({
        flow: "purchase",
        balls: 30,
        amount: 6000,
        paymentMethod: "TRANSFER",
      })!.paymentMethod
    ).toBe("TRANSFER");
  });

  it("ignores invalid paymentMethod", () => {
    const result = parseTransactionBody({
      flow: "purchase",
      balls: 30,
      amount: 6000,
      paymentMethod: "CARD",
    });
    expect(result).not.toBeNull();
    expect(result!.paymentMethod).toBeUndefined();
  });

  it("parses optional associateNumber when present", () => {
    const result = parseTransactionBody({
      flow: "purchase",
      balls: 30,
      amount: 6000,
      associateNumber: "A-42",
    });
    expect(result).not.toBeNull();
    expect(result!.associateNumber).toBe("A-42");
  });

  it("parses all optional fields together", () => {
    const result = parseTransactionBody({
      flow: "voucher",
      balls: 20,
      amount: 0,
      idempotencyKey: "idem-1",
      customerType: "INVITADO",
      paymentMethod: "TRANSFER",
      associateNumber: "123",
    });
    expect(result).toEqual({
      flow: "voucher",
      balls: 20,
      amount: 0,
      idempotencyKey: "idem-1",
      customerType: "INVITADO",
      paymentMethod: "TRANSFER",
      associateNumber: "123",
    });
  });
});
