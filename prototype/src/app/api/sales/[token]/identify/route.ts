import { NextResponse } from "next/server";
import { identify } from "@/lib/store";
import type { Company } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const company = (await req.json().catch(() => null)) as Company | null;
  if (!company?.siren || !company.name) {
    return NextResponse.json({ error: "Entreprise incomplète." }, { status: 400 });
  }
  const sale = identify(token, company);
  if (!sale) return NextResponse.json({ error: "Ticket introuvable." }, { status: 404 });
  return NextResponse.json(sale);
}
