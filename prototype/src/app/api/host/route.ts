import { NextResponse } from "next/server";
import os from "node:os";

export const dynamic = "force-dynamic";

// Adresse publique utilisée dans le QR code du ticket.
// En déploiement : PUBLIC_BASE_URL (ex. https://facture.exemple.fr).
// En local : l'adresse de l'ordinateur sur le réseau, pour qu'un téléphone sur le même Wi-Fi puisse l'ouvrir.
export async function GET(req: Request) {
  const port = new URL(req.url).port || "3000";
  const ips: string[] = [];
  for (const [name, list] of Object.entries(os.networkInterfaces())) {
    // Adaptateurs virtuels (WSL, Hyper-V, Docker, VM) : injoignables depuis le téléphone
    if (/vEthernet|WSL|Hyper-V|Docker|VirtualBox|VMware|Loopback/i.test(name)) continue;
    for (const i of list ?? []) {
      if (i.family === "IPv4" && !i.internal && !i.address.startsWith("169.254.")) ips.push(i.address);
    }
  }
  ips.sort((a, b) => (a.startsWith("192.168.") ? -1 : 0) - (b.startsWith("192.168.") ? -1 : 0));

  const configured = process.env.PUBLIC_BASE_URL?.trim().replace(/\/+$/, "");
  const baseUrl = configured || (ips[0] ? `http://${ips[0]}:${port}` : null);
  return NextResponse.json({ baseUrl, ips, port });
}
