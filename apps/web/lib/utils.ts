export function formatMoney(minor: number, currency = "IDR", locale = "id-ID") {
  const major = minor / 100;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(major);
}

export function parseMoney(text: string): number {
  const n = Number(text.replace(/[^0-9.-]/g, ""));
  return Math.round((Number.isNaN(n) ? 0 : n) * 100);
}

export function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

