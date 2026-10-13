"use client";
import { useEffect, useRef, useState } from "react";
import type { InvoiceStatus, SaleEvent } from "@/lib/types";
import { fmtTime } from "@/lib/format";

export function useEvents(onNew?: (events: SaleEvent[]) => void) {
  const [events, setEvents] = useState<SaleEvent[]>([]);
  const last = useRef(0);
  const cb = useRef(onNew);
  useEffect(() => {
    cb.current = onNew;
  }, [onNew]);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const res = await fetch(`/api/events?after=${last.current}`, { cache: "no-store" });
        const fresh = (await res.json()) as SaleEvent[];
        if (!alive || fresh.length === 0) return;
        last.current = fresh[fresh.length - 1].id;
        setEvents((prev) => [...prev, ...fresh]);
        cb.current?.(fresh);
      } catch {
        /* retry next tick */
      }
    };
    tick();
    const id = setInterval(tick, 1200);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const reset = () => {
    last.current = 0;
    setEvents([]);
  };
  return { events, reset };
}

interface Step {
  done: string;
  waiting: string;
  at?: string;
}

const statusOf = (e: SaleEvent): InvoiceStatus | undefined =>
  e.status ?? (e.webhook?.split("= ")[1] as InvoiceStatus | undefined);

function summarize(evs: SaleEvent[]) {
  const find = (k: SaleEvent["kind"]) => evs.find((e) => e.kind === k);
  const status = (st: InvoiceStatus) => evs.find((e) => e.kind === "invoice.status" && statusOf(e) === st);

  const created = find("sale.created");
  const scanned = find("sale.scanned");
  const identified = evs.filter((e) => e.kind === "sale.identified").at(-1);
  const invoiced = find("invoice.created");
  const submitted = status("submitted");
  const deposited = status("deposited");
  const accepted = status("accepted");
  const client = invoiced?.client ?? identified?.client ?? identified?.title.split(" (SIREN")[0];
  const invoiceNumber = invoiced?.invoice ?? invoiced?.title.match(/F-\d{4}-\d+/)?.[0];

  const steps: Step[] = [
    { done: "Ticket imprimé avec son QR code", waiting: "Impression du ticket…", at: created?.at },
    {
      done: "Le client a scanné le QR code",
      waiting: "Si le client veut une facture, il scanne le QR code",
      at: scanned?.at,
    },
    { done: `Entreprise choisie : ${client ?? ""}`, waiting: "Le client choisit son entreprise", at: identified?.at },
    { done: "Facture créée", waiting: "Le client confirme sur son téléphone", at: invoiced?.at },
    {
      done: "Validée par la plateforme agréée",
      waiting: submitted ? "Contrôle par la plateforme agréée…" : "Envoi à la plateforme agréée…",
      at: deposited?.at,
    },
    { done: "Reçue par l'entreprise cliente", waiting: "Transmission à l'entreprise cliente…", at: accepted?.at },
  ];
  // A later step proves the earlier ones happened, even if an event was missed.
  const reached = steps.reduce((n, st, i) => (st.at ? i + 1 : n), 0);

  return {
    token: evs[0].token,
    saleNumber: evs[0].saleNumber,
    startedAt: evs[0].at,
    steps,
    reached,
    client,
    invoiceNumber,
    leftB2c: Boolean(find("sale.invoiced_b2b")),
  };
}

type Summary = ReturnType<typeof summarize>;

const invoiceHref = (token: string) => `/facture/${token}?from=caisse`;

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InvoiceCard({ s }: { s: Summary }) {
  return (
    <div className="event-in mb-1 mt-1.5 rounded-xl border-2 border-green bg-green-soft p-3.5">
      <div className="flex items-start gap-3">
        <svg viewBox="0 0 24 24" className="mt-0.5 size-8 shrink-0 text-green" aria-hidden>
          <path d="M5.5 2.5h8.5l4.5 4.5v14.5h-13z" fill="white" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M14 2.5V7h4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <text x="12" y="17" textAnchor="middle" fontSize="5" fontWeight="700" fill="currentColor">
            PDF
          </text>
        </svg>
        <div className="min-w-0">
          <div className="text-[15px] font-bold leading-tight">Facture {s.invoiceNumber}</div>
          <div className="truncate text-[13px] text-ink-soft">pour {s.client}</div>
        </div>
      </div>
      <a
        href={invoiceHref(s.token)}
        target="_blank"
        rel="noreferrer"
        className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-cobalt px-3 py-2.5 text-[14px] font-semibold text-white transition hover:bg-cobalt-deep"
      >
        Ouvrir la facture PDF
        <span aria-hidden>↗</span>
      </a>
      {s.leftB2c && (
        <p className="mt-2 text-[12px] leading-snug text-ink-soft">
          La vente passe en B2B : elle ne sera pas déclarée deux fois.
        </p>
      )}
    </div>
  );
}

function CurrentSale({ s }: { s: Summary }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[14px] font-semibold">Ticket {s.saleNumber}</span>
        <time className="text-[12px] tabular-nums text-muted">{fmtTime(s.startedAt)}</time>
      </div>
      <ol>
        {s.steps.map((st, i) => {
          const state = i < s.reached ? "done" : i === s.reached ? "active" : "todo";
          return (
            <li key={i}>
              <div className="flex items-center gap-2.5 py-1.5">
                {state === "done" ? (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-green text-white">
                    <Check />
                  </span>
                ) : state === "active" ? (
                  <span className="relative flex size-5 shrink-0 items-center justify-center" aria-hidden>
                    <span className="absolute inset-0 animate-ping rounded-full bg-amber/30" />
                    <span className="size-2.5 rounded-full bg-amber" />
                  </span>
                ) : (
                  <span className="flex size-5 shrink-0 items-center justify-center" aria-hidden>
                    <span className="size-2 rounded-full bg-line" />
                  </span>
                )}
                <span
                  className={`min-w-0 flex-1 text-[13.5px] leading-snug ${
                    state === "done" ? "text-ink" : state === "active" ? "font-medium text-amber" : "text-muted"
                  }`}
                >
                  {state === "done" ? st.done : st.waiting}
                </span>
                {state === "done" && st.at && (
                  <time className="shrink-0 text-[11px] tabular-nums text-muted">{fmtTime(st.at)}</time>
                )}
              </div>
              {i === 3 && state === "done" && <InvoiceCard s={s} />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function PastSale({ s }: { s: Summary }) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-line bg-white/70 px-3 py-2 text-[13px]">
      <div className="min-w-0 flex-1">
        <div className="font-medium">Ticket {s.saleNumber}</div>
        <div className="truncate text-[12px] text-muted">
          {s.invoiceNumber ? `Facture ${s.invoiceNumber} · ${s.client}` : "Pas de facture demandée"}
        </div>
      </div>
      {s.invoiceNumber && (
        <a
          href={invoiceHref(s.token)}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-md border border-line bg-white px-2.5 py-1 text-[12px] font-semibold text-cobalt hover:border-cobalt"
        >
          PDF ↗
        </a>
      )}
    </li>
  );
}

export function EventFeed({ events, highlightToken }: { events: SaleEvent[]; highlightToken?: string }) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line p-5 text-sm text-muted">
        Rien pour l&apos;instant. Encaissez une vente pour suivre ici chaque étape, jusqu&apos;à la facture.
      </div>
    );
  }

  const byToken = new Map<string, SaleEvent[]>();
  for (const e of events) byToken.set(e.token, [...(byToken.get(e.token) ?? []), e]);
  const sales = [...byToken.values()].map(summarize).reverse();
  const current = sales.find((s) => s.token === highlightToken) ?? sales[0];
  const past = sales.filter((s) => s !== current);

  return (
    <div className="space-y-4">
      <CurrentSale key={current.token} s={current} />
      {past.length > 0 && (
        <div>
          <h3 className="mb-2 text-[12px] font-semibold text-muted">Ventes précédentes</h3>
          <ul className="space-y-1.5">
            {past.map((s) => (
              <PastSale key={s.token} s={s} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
