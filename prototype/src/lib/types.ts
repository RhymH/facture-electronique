export interface SaleLine {
  label: string;
  qty: number;
  unitPriceHT: number;
  vatRate: number;
}

export interface Merchant {
  name: string;
  siren: string;
  address: string;
  postalCode: string;
  city: string;
  vat: string;
  phone: string;
}

export interface Company {
  siren: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  vat: string;
  naf?: string;
  savedAt?: string;
  lastUsedAt?: string;
}

export type InvoiceStatus = "generated" | "submitted" | "deposited" | "accepted";
export type OperationCategory = "biens" | "services" | "mixte";

export interface Invoice {
  number: string;
  client: Company;
  createdAt: string;
  status: InvoiceStatus;
  deliveryAddress?: string;
  category: OperationCategory;
}

export type SaleStatus = "open" | "scanned" | "identified" | "invoiced";

export interface Sale {
  token: string;
  number: string;
  register: string;
  merchant: Merchant;
  lines: SaleLine[];
  paidWith: string;
  createdAt: string;
  status: SaleStatus;
  pendingClient?: Company;
  invoice?: Invoice;
}

export type EventKind =
  | "sale.created"
  | "sale.scanned"
  | "sale.identified"
  | "invoice.created"
  | "sale.invoiced_b2b"
  | "invoice.status";

export type EventTone = "info" | "wait" | "success" | "b2b";

export interface SaleEvent {
  id: number;
  token: string;
  saleNumber: string;
  kind: EventKind;
  tone: EventTone;
  title: string;
  detail?: string;
  webhook?: string;
  client?: string;
  invoice?: string;
  status?: InvoiceStatus;
  at: string;
}
