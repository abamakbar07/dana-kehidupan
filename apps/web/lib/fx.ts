export interface FxRateProvider {
  getRate(base: string, quote: string, date?: Date): Promise<number>;
}

export class MockFxRateProvider implements FxRateProvider {
  async getRate(base: string, quote: string): Promise<number> {
    if (base === quote) return 1;
    // Simple mock: IDR base, USD 1:16000, others 1:1
    if (base === "IDR" && quote === "USD") return 1 / 16000;
    if (base === "USD" && quote === "IDR") return 16000;
    return 1;
  }
}

