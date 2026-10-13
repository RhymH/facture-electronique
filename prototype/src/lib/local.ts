"use client";
import type { Company } from "./types";

const KEY = "formeb.companies";
const LAST = "formeb.lastSiren";
const INVOICES = "formeb.invoices";

export interface LocalInvoice {
  number: string;
  token?: string;
  merchant: string;
  total: number;
  date: string;
  siren: string;
}

export const seedCompanies: Company[] = [
  {
    siren: "842316759",
    name: "PLOMBERIE DURAND",
    address: "14 rue des Artisans",
    postalCode: "68000",
    city: "Colmar",
    vat: "FR37842316759",
    naf: "43.22A",
    savedAt: "2026-09-18T09:12:00.000Z",
    lastUsedAt: "2026-10-02T16:41:00.000Z",
  },
];

const seedInvoices: LocalInvoice[] = [
  { number: "F-2026-0087", merchant: "Quincaillerie Martin", total: 86.4, date: "2026-10-02T16:41:00.000Z", siren: "842316759" },
  { number: "F-2026-0061", merchant: "Quincaillerie Martin", total: 212.15, date: "2026-09-18T09:12:00.000Z", siren: "842316759" },
];

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function loadCompanies(): Company[] {
  try {
    if (localStorage.getItem(KEY) === null) {
      write(KEY, seedCompanies);
      write(LAST, seedCompanies[0].siren);
      write(INVOICES, seedInvoices);
      return seedCompanies;
    }
  } catch {
    return seedCompanies;
  }
  return read<Company[]>(KEY, []);
}

export function saveCompany(c: Company): Company[] {
  const list = loadCompanies().filter((x) => x.siren !== c.siren);
  const next = [{ ...c, savedAt: c.savedAt ?? new Date().toISOString() }, ...list];
  write(KEY, next);
  return next;
}

export function removeCompany(siren: string): Company[] {
  const next = loadCompanies().filter((x) => x.siren !== siren);
  write(KEY, next);
  return next;
}

export function touchCompany(siren: string) {
  const list = loadCompanies().map((c) => (c.siren === siren ? { ...c, lastUsedAt: new Date().toISOString() } : c));
  write(KEY, list);
  write(LAST, siren);
}

export function lastSiren(): string | null {
  try {
    return localStorage.getItem(LAST);
  } catch {
    return null;
  }
}

export function loadInvoices(): LocalInvoice[] {
  loadCompanies();
  try {
    if (localStorage.getItem(INVOICES) === null) write(INVOICES, seedInvoices);
  } catch {
    return seedInvoices;
  }
  return read<LocalInvoice[]>(INVOICES, []);
}

export function saveInvoice(inv: LocalInvoice) {
  const list = loadInvoices().filter((i) => i.number !== inv.number);
  write(INVOICES, [inv, ...list].slice(0, 100));
}

export function invoicesFor(siren: string): LocalInvoice[] {
  return loadInvoices()
    .filter((i) => i.siren === siren)
    .sort((a, b) => b.date.localeCompare(a.date));
}
