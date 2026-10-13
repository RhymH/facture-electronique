import type { Merchant, SaleLine } from "./types";

export const merchant: Merchant = {
  name: "Quincaillerie Martin",
  siren: "352489641",
  address: "3 place de la Cathédrale",
  postalCode: "68000",
  city: "Colmar",
  vat: "FR12352489641",
  phone: "03 89 41 00 00",
};

export interface Product {
  id: string;
  label: string;
  unitPriceHT: number;
  vatRate: number;
  group: "Outillage" | "Fixation" | "Plomberie" | "Jardin" | "Services";
}

export const products: Product[] = [
  { id: "p1", label: "Perceuse-visseuse 18 V", unitPriceHT: 139.0, vatRate: 20, group: "Outillage" },
  { id: "p2", label: "Clé à molette 250 mm", unitPriceHT: 14.5, vatRate: 20, group: "Outillage" },
  { id: "p3", label: "Mètre ruban 5 m", unitPriceHT: 8.2, vatRate: 20, group: "Outillage" },
  { id: "p4", label: "Gants de travail T9", unitPriceHT: 9.9, vatRate: 20, group: "Outillage" },
  { id: "p5", label: "Vis bois 4×40 (boîte de 200)", unitPriceHT: 6.9, vatRate: 20, group: "Fixation" },
  { id: "p6", label: "Chevilles nylon 8 mm (×50)", unitPriceHT: 4.3, vatRate: 20, group: "Fixation" },
  { id: "p7", label: "Ruban adhésif 50 mm", unitPriceHT: 3.6, vatRate: 20, group: "Fixation" },
  { id: "p8", label: "Raccord cuivre 14 mm", unitPriceHT: 2.4, vatRate: 20, group: "Plomberie" },
  { id: "p9", label: "Silicone sanitaire blanc", unitPriceHT: 7.5, vatRate: 20, group: "Plomberie" },
  { id: "p10", label: "Flexible douche 1,5 m", unitPriceHT: 11.9, vatRate: 20, group: "Plomberie" },
  { id: "p11", label: "Terreau universel 40 L", unitPriceHT: 6.3, vatRate: 10, group: "Jardin" },
  { id: "p12", label: "Plants de tomates (×6)", unitPriceHT: 5.45, vatRate: 10, group: "Jardin" },
  { id: "p13", label: "Location nettoyeur HP (jour)", unitPriceHT: 35.0, vatRate: 20, group: "Services" },
  { id: "p14", label: "Découpe de verre sur mesure", unitPriceHT: 12.0, vatRate: 20, group: "Services" },
];

export const demoBasket: SaleLine[] = [
  { label: "Perceuse-visseuse 18 V", qty: 1, unitPriceHT: 139.0, vatRate: 20 },
  { label: "Vis bois 4×40 (boîte de 200)", qty: 3, unitPriceHT: 6.9, vatRate: 20 },
  { label: "Raccord cuivre 14 mm", qty: 12, unitPriceHT: 2.4, vatRate: 20 },
  { label: "Terreau universel 40 L", qty: 2, unitPriceHT: 6.3, vatRate: 10 },
];
