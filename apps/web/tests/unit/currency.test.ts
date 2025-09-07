import { describe, it, expect } from "vitest";
import { formatMoney, parseMoney } from "@web/lib/utils";

describe("currency utils", () => {
  it("formats IDR", () => {
    expect(formatMoney(123456, "IDR", "id-ID")).toContain("Rp");
  });
  it("parses human text to minor", () => {
    expect(parseMoney("1,234.56")).toBe(123456);
  });
});

