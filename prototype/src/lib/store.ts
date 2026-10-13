import "server-only";
import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { Company, EventKind, EventTone, Invoice, OperationCategory, Sale, SaleEvent, SaleLine } from "./types";
import { merchant } from "./catalog";
import { formatSiren } from "./format";

interface Data {
  sales: Sale[];
  events: SaleEvent[];
  eventSeq: number;
  saleSeq: number;
  invoiceSeq: number;
}

const FILE = path.join(process.cwd(), ".data", "store.json");

declare global {
  var __fbStore: Data | undefined;
}

const fresh = (): Data => ({ sales: [], events: [], eventSeq: 0, saleSeq: 1041, invoiceSeq: 0 });

function load(): Data {
  if (globalThis.__fbStore) return globalThis.__fbStore;
  let data = fresh();
  try {
    if (fs.existsSync(FILE)) data = JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    /* start from an empty store */
  }
  globalThis.__fbStore = data;
  return data;
}

function save(data: Data) {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch {
    /* keep it in memory only */
  }
}

const year = () => new Date().getFullYear();

function emit(
  data: Data,
  sale: Sale,
  kind: EventKind,
  tone: EventTone,
  title: string,
  detail?: string,
  webhook?: string,
  extra: Pick<SaleEvent, "client" | "invoice" | "status"> = {},
): SaleEvent {
  const ev: SaleEvent = {
    id: ++data.eventSeq,
    token: sale.token,
    saleNumber: sale.number,
    kind,
    tone,
    title,
    detail,
    webhook,
    ...extra,
    at: new Date().toISOString(),
  };
  data.events.push(ev);
  if (data.events.length > 300) data.events.splice(0, data.events.length - 300);
  return ev;
}

export function createSale(lines: SaleLine[], paidWith = "Carte bancaire"): Sale {
  const data = load();
  const sale: Sale = {
    token: randomBytes(5).toString("base64url"),
    number: `${year()}-${++data.saleSeq}`,
    register: "Caisse 1",
    merchant,
    lines,
    paidWith,
    createdAt: new Date().toISOString(),
    status: "open",
  };
  data.sales.push(sale);
  if (data.sales.length > 100) data.sales.splice(0, data.sales.length - 100);
  emit(
    data,
    sale,
    "sale.created",
    "info",
    `Ticket ${sale.number} imprimé avec son QR code`,
    "La vente reste dans l'e-reporting B2C tant qu'aucune facture n'est demandée.",
    "POST /sales → jeton + URL du QR",
  );
  save(data);
  return sale;
}

export function getSale(token: string) {
  return load().sales.find((s) => s.token === token);
}

export function latestSale() {
  const s = load().sales;
  return s[s.length - 1];
}

export function listSales() {
  return [...load().sales].reverse();
}

export function listEvents(after = 0) {
  return load().events.filter((e) => e.id > after);
}

export function markScanned(token: string) {
  const data = load();
  const sale = data.sales.find((s) => s.token === token);
  if (!sale) return undefined;
  if (sale.status === "open") {
    sale.status = "scanned";
    emit(
      data,
      sale,
      "sale.scanned",
      "info",
      `QR code du ticket ${sale.number} scanné`,
      "Le client consulte le résumé de son achat sur son téléphone.",
    );
    save(data);
  }
  return sale;
}

export function identify(token: string, client: Company) {
  const data = load();
  const sale = data.sales.find((s) => s.token === token);
  if (!sale || sale.status === "invoiced") return sale;
  const changed = sale.pendingClient?.siren !== client.siren;
  sale.pendingClient = client;
  if (sale.status !== "identified" || changed) {
    sale.status = "identified";
    emit(
      data,
      sale,
      "sale.identified",
      "wait",
      `${client.name} (SIREN ${formatSiren(client.siren)}) sélectionnée`,
      "En attente de confirmation par le client sur son téléphone.",
      undefined,
      { client: client.name },
    );
    save(data);
  }
  return sale;
}

export function createInvoice(
  token: string,
  client: Company,
  opts: { deliveryAddress?: string; category?: OperationCategory } = {},
) {
  const data = load();
  const sale = data.sales.find((s) => s.token === token);
  if (!sale) return undefined;
  if (sale.invoice) return sale;

  const invoice: Invoice = {
    number: `F-${year()}-${String(++data.invoiceSeq).padStart(4, "0")}`,
    client,
    createdAt: new Date().toISOString(),
    status: "generated",
    deliveryAddress: opts.deliveryAddress || undefined,
    category: opts.category ?? "biens",
  };
  sale.invoice = invoice;
  sale.status = "invoiced";
  sale.pendingClient = undefined;

  emit(
    data,
    sale,
    "invoice.created",
    "success",
    `Facture ${invoice.number} créée pour ${client.name}`,
    "PDF/A-3 Factur-X, profil EN 16931, XML CII embarqué.",
    undefined,
    { client: client.name, invoice: invoice.number },
  );
  emit(
    data,
    sale,
    "sale.invoiced_b2b",
    "b2b",
    `Vente ${sale.number} marquée B2B dans la caisse`,
    "Elle sort de l'e-reporting B2C : pas de double déclaration.",
    "webhook sale.invoiced_b2b",
  );
  save(data);

  const step = (status: Invoice["status"], delay: number, title: string, detail: string) =>
    setTimeout(() => {
      const d = load();
      const s = d.sales.find((x) => x.token === token);
      if (!s?.invoice) return;
      s.invoice.status = status;
      emit(
        d,
        s,
        "invoice.status",
        status === "accepted" ? "success" : "info",
        title,
        detail,
        `webhook invoice.status = ${status}`,
        { invoice: s.invoice.number, status },
      );
      save(d);
    }, delay);

  step(
    "submitted",
    1500,
    `Facture ${invoice.number} transmise à la plateforme agréée`,
    "Environnement de test (sandbox) de la plateforme du commerçant.",
  );
  step(
    "deposited",
    5000,
    `Facture ${invoice.number} déposée`,
    "Contrôles de format passés, dépôt horodaté par la plateforme.",
  );
  step(
    "accepted",
    10000,
    `Facture ${invoice.number} reçue par la plateforme du client`,
    `Destinataire trouvé dans l'annuaire grâce au SIREN ${formatSiren(client.siren)}.`,
  );

  return sale;
}

export function resetStore() {
  const data = fresh();
  globalThis.__fbStore = data;
  save(data);
}
