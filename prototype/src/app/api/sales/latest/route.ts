import { NextResponse } from "next/server";
import { latestSale } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const sale = latestSale();
  if (!sale) return NextResponse.json({ error: "Aucune vente enregistrée." }, { status: 404 });
  return NextResponse.json(sale);
}
