import { NextResponse } from "next/server";
import { Resend } from "resend";
import fs from "node:fs/promises";
import path from "node:path";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

// Liste d'attente : on reçoit un téléphone ou un e-mail, on se prévient par e-mail (Resend)
// et on garde une copie dans .data/waitlist.json au cas où l'e-mail n'arrive pas.
//
// Variables d'environnement (voir .env.example) :
//   RESEND_API_KEY   clé API Resend
//   WAITLIST_TO      adresse(s) qui reçoivent l'alerte, séparées par des virgules
//   WAITLIST_FROM    expéditeur, sur un domaine vérifié chez Resend (ex. "Factick <liste@factick.fr>")

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9][0-9\s().-]{7,20}$/;

type Body = { contact?: unknown; software?: unknown; source?: unknown };

// Limite simple par adresse IP : 5 inscriptions par heure. En mémoire, suffisant pour un site vitrine.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  hits.set(ip, recent);
  if (recent.length >= 5) return true;
  recent.push(now);
  return false;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function keepCopy(entry: Record<string, string>) {
  try {
    const dir = path.join(process.cwd(), ".data");
    const file = path.join(dir, "waitlist.json");
    await fs.mkdir(dir, { recursive: true });
    const current = await fs
      .readFile(file, "utf8")
      .then((s) => JSON.parse(s) as Record<string, string>[])
      .catch((): Record<string, string>[] => []);
    current.push(entry);
    await fs.writeFile(file, JSON.stringify(current, null, 2));
  } catch (err) {
    console.error("[waitlist] copie locale impossible :", err);
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Trop de demandes. Réessayez dans une heure." }, { status: 429 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Requête illisible." }, { status: 400 });
  }

  const contact = typeof body.contact === "string" ? body.contact.trim().slice(0, 200) : "";
  const software = typeof body.software === "string" ? body.software.trim().slice(0, 200) : "";
  const source = typeof body.source === "string" ? body.source.trim().slice(0, 80) : "inconnu";

  const isEmail = EMAIL.test(contact);
  const isPhone = !isEmail && PHONE.test(contact);
  if (!isEmail && !isPhone) {
    return NextResponse.json(
      { error: "Entrez un e-mail (nom@exemple.fr) ou un numéro de téléphone (06 12 34 56 78)." },
      { status: 400 },
    );
  }

  const entry = {
    contact,
    kind: isEmail ? "email" : "téléphone",
    software,
    source,
    at: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") ?? "",
  };
  await keepCopy(entry);

  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.WAITLIST_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.WAITLIST_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`;

  if (!apiKey || to.length === 0) {
    // Sans configuration, on ne bloque pas le visiteur : l'inscription est dans .data/waitlist.json.
    console.warn("[waitlist] RESEND_API_KEY ou WAITLIST_TO manquant ; inscription conservée localement :", entry);
    return NextResponse.json({ ok: true, delivered: false });
  }

  const subject = `Liste d'attente ${SITE_NAME} : ${contact}${software ? ` (${software})` : ""}`;
  const text = [
    `Nouvelle inscription sur la liste d'attente ${SITE_NAME}.`,
    ``,
    `${entry.kind === "email" ? "E-mail" : "Téléphone"} : ${contact}`,
    `Logiciel de caisse : ${software || "non renseigné"}`,
    `Depuis : ${source}`,
    `Le : ${entry.at}`,
  ].join("\n");
  const html = `<p>Nouvelle inscription sur la liste d'attente <strong>${SITE_NAME}</strong>.</p>
<table style="border-collapse:collapse;font:15px system-ui">
<tr><td style="padding:4px 12px 4px 0;color:#666">${entry.kind === "email" ? "E-mail" : "Téléphone"}</td><td><strong>${escapeHtml(contact)}</strong></td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">Logiciel de caisse</td><td>${escapeHtml(software || "non renseigné")}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">Depuis</td><td>${escapeHtml(source)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">Le</td><td>${entry.at}</td></tr>
</table>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
      ...(isEmail ? { replyTo: contact } : {}),
    });
    if (error) {
      console.error("[waitlist] Resend :", error);
      return NextResponse.json({ error: "L'envoi a échoué de notre côté. Réessayez dans un instant." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[waitlist] Resend :", err);
    return NextResponse.json({ error: "L'envoi a échoué de notre côté. Réessayez dans un instant." }, { status: 502 });
  }
}
