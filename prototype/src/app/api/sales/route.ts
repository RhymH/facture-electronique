import { NextResponse } from "next/server";
import { createSale, listSales } from "@/lib/store";
import type { SaleLine } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(listSales());
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { lines?: SaleLine[]; paidWith?: string } | null;
  const lines = body?.lines ?? [];
  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Le ticket doit contenir au moins une ligne." }, { status: 400 });
  }
  for (const l of lines) {
    if (!l.label || !(l.qty > 0) || !(l.unitPriceHT >= 0) || ![20, 10, 5.5, 2.1, 0].includes(l.vatRate)) {
      return NextResponse.json({ error: `Ligne invalide : ${l.label ?? "sans libellé"}` }, { status: 400 });
    }
  }
  const sale = createSale(lines, body?.paidWith);
  return NextResponse.json({ token: sale.token, number: sale.number, path: `/f/${sale.token}`, sale });
}
