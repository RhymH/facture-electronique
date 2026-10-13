import { NextResponse } from "next/server";
import { markScanned } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const sale = markScanned(token);
  if (!sale) return NextResponse.json({ error: "Ticket introuvable." }, { status: 404 });
  return NextResponse.json(sale);
}
