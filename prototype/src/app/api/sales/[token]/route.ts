import { NextResponse } from "next/server";
import { getSale } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const sale = getSale(token);
  if (!sale) return NextResponse.json({ error: "Ticket introuvable." }, { status: 404 });
  return NextResponse.json(sale);
}
