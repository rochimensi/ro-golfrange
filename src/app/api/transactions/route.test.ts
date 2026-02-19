import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/db", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => Promise.resolve()),
    })),
  },
}));

describe("POST /api/transactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  async function postJson(body: unknown) {
    const request = new Request("http://localhost/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return POST(request);
  }

  it("returns 400 when body is invalid", async () => {
    const res = await postJson({});
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid body");
  });

  it("returns 400 when flow is invalid", async () => {
    const res = await postJson({ flow: "other", balls: 30, amount: 6000 });
    expect(res.status).toBe(400);
  });

  it("returns 200 and { ok: true } for valid body", async () => {
    const res = await postJson({ flow: "purchase", balls: 30, amount: 6000 });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });
  });

  it("returns 200 for valid body with optional fields", async () => {
    const res = await postJson({
      flow: "voucher",
      balls: 20,
      amount: 0,
      idempotencyKey: "key-1",
      customerType: "SOCIO",
      paymentMethod: "CASH",
      associateNumber: "A1",
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });
  });

  it("returns 500 when db insert throws (non-duplicate)", async () => {
    const { db } = await import("@/db");
    vi.mocked(db.insert).mockReturnValueOnce({
      values: vi.fn(() => Promise.reject(new Error("db error"))),
    } as never);

    const res = await postJson({ flow: "purchase", balls: 30, amount: 6000 });
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Failed to save transaction");
  });

  it("returns 200 when db throws unique_violation (23505)", async () => {
    const err = new Error("duplicate") as Error & { code: string };
    err.code = "23505";
    const { db } = await import("@/db");
    vi.mocked(db.insert).mockReturnValueOnce({
      values: vi.fn(() => Promise.reject(err)) as ReturnType<typeof vi.fn>,
    } as never);

    const res = await postJson({ flow: "purchase", balls: 30, amount: 6000 });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });
  });
});
