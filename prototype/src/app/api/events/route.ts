import { NextResponse } from "next/server";
import { listEvents } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const after = Number(new URL(req.url).searchParams.get("after") ?? 0) || 0;
  return NextResponse.json(listEvents(after));
}
