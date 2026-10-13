import { NextResponse } from "next/server";
import { createInvoice } from "@/lib/store";
import type { Company, OperationCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const body = (await req.json().catch(() => null)) as
    | { client: Company; deliveryAddress?: string; category?: OperationCategory }
    | null;
  if (!body?.client?.siren || !body.client.name) {
    return NextResponse.json({ error: "Entreprise incomplète." }, { status: 400 });
  }
  const sale = createInvoice(token, body.client, { deliveryAddress: body.deliveryAddress, category: body.category });
  if (!sale) return NextResponse.json({ error: "Ticket introuvable." }, { status: 404 });
  return NextResponse.json(sale);
}
