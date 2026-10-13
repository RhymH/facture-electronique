import type { SaleLine } from "./types";

export interface RateTotal {
  rate: number;
  ht: number;
  tva: number;
  ttc: number;
}

export interface Totals {
  ht: number;
  tva: number;
  ttc: number;
  byRate: RateTotal[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeTotals(lines: SaleLine[]): Totals {
  const map = new Map<number, RateTotal>();
  for (const l of lines) {
    const ht = round2(l.qty * l.unitPriceHT);
    const tva = round2(ht * (l.vatRate / 100));
    const cur = map.get(l.vatRate) ?? { rate: l.vatRate, ht: 0, tva: 0, ttc: 0 };
    cur.ht = round2(cur.ht + ht);
    cur.tva = round2(cur.tva + tva);
    cur.ttc = round2(cur.ht + cur.tva);
    map.set(l.vatRate, cur);
  }
  const byRate = [...map.values()].sort((a, b) => b.rate - a.rate);
  const ht = round2(byRate.reduce((s, r) => s + r.ht, 0));
  const tva = round2(byRate.reduce((s, r) => s + r.tva, 0));
  return { ht, tva, ttc: round2(ht + tva), byRate };
}

export function lineTTC(l: SaleLine) {
  return round2(l.qty * l.unitPriceHT * (1 + l.vatRate / 100));
}

export const eur = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

export const eurPlain = (n: number) =>
  new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export const pct = (n: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(n) + " %";

export function formatSiren(siren: string) {
  const s = siren.replace(/\D/g, "");
  return s.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

export function vatFromSiren(siren: string) {
  const s = siren.replace(/\D/g, "");
  if (s.length !== 9) return "";
  const key = (12 + 3 * (Number(s) % 97)) % 97;
  return `FR${String(key).padStart(2, "0")}${s}`;
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function fmtDateTime(iso: string) {
  return `${fmtDate(iso)} ${new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
}
