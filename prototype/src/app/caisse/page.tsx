"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PosScreen } from "@/components/PosScreen";
import { Receipt } from "@/components/Receipt";
import { EventFeed, useEvents } from "@/components/EventFeed";
import { demoBasket } from "@/lib/catalog";
import type { Sale, SaleEvent, SaleLine } from "@/lib/types";

export default function CaissePage() {
  const [lines, setLines] = useState<SaleLine[]>(demoBasket);
  const [sale, setSale] = useState<Sale | null>(null);
  const [justPrinted, setJustPrinted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [origin, setOrigin] = useState("");
  const [host, setHost] = useState<{ baseUrl: string | null } | null>(null);
  const [clock, setClock] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const t = setInterval(() => setClock(new Date().toLocaleTimeString("fr-FR")), 1000);
    fetch("/api/host").then((r) => r.json()).then(setHost).catch(() => null);
    fetch("/api/sales/latest")
      .then((r) => (r.ok ? r.json() : null))
      .then((s: Sale | null) => s && setSale(s))
      .catch(() => null);
    return () => clearInterval(t);
  }, []);

  const onNew = useCallback(
    (fresh: SaleEvent[]) => {
      const mine = fresh.filter((e) => e.token === sale?.token);
      if (mine.length > 0) {
        fetch(`/api/sales/${sale!.token}`)
          .then((r) => r.json())
          .then((s: Sale) => setSale(s))
          .catch(() => null);
      }
    },
    [sale],
  );
  const { events, reset } = useEvents(onNew);

  const checkout = async (paidWith: string) => {
    setBusy(true);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lines, paidWith }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      setSale(json.sale as Sale);
      setJustPrinted(true);
      setLines([]);
    } finally {
      setBusy(false);
    }
  };

  const resetAll = async () => {
    await fetch("/api/reset", { method: "POST" });
    setSale(null);
    setLines(demoBasket);
    reset();
  };

  const qrUrl = sale ? `${host?.baseUrl ?? origin}/f/${sale.token}` : "";

  return (
    <main className="min-h-dvh bg-counter">
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[13px] font-medium text-ink-soft hover:text-ink">
            Démo
          </Link>
          <span className="text-line">/</span>
          <h1 className="text-[15px] font-semibold">Côté commerçant : la caisse et son ticket</h1>
        </div>
        <div className="flex items-center gap-2 text-[13px]">
          <Link href="/scan" className="rounded-md border border-line bg-white px-3 py-1.5 font-medium hover:border-ink-soft">
            Ouvrir le téléphone du client
          </Link>
          <button type="button" onClick={resetAll} className="rounded-md px-3 py-1.5 text-ink-soft hover:text-ink">
            Remettre à zéro
          </button>
        </div>
      </header>

      <div className="grid gap-5 px-5 pb-10 xl:grid-cols-[minmax(640px,1.6fr)_320px_minmax(300px,1fr)] xl:items-start">
        <section aria-label="Écran de caisse">
          <PosScreen lines={lines} onChange={setLines} onCheckout={checkout} busy={busy} clock={clock} />
        </section>

        <section aria-label="Ticket imprimé" className="flex flex-col items-center">
          <div className="mb-3 h-3 w-[320px] rounded-b-xl bg-counter-deep shadow-inner" aria-hidden />
          {sale ? (
            <Receipt key={sale.token} sale={sale} qrUrl={qrUrl} animate={justPrinted} />
          ) : (
            <div className="w-[300px] rounded-md border border-dashed border-counter-deep p-6 text-center text-[13px] text-muted">
              Aucun ticket imprimé. Encaissez la vente pour voir sortir le ticket avec son QR code.
            </div>
          )}

          {sale && (
            <div className="mt-8 w-[300px] text-[12.5px] leading-snug text-ink-soft">
              <p>
                Le QR code pointe vers{" "}
                <a className="break-all text-cobalt underline-offset-2 hover:underline" href={qrUrl} target="_blank" rel="noreferrer">
                  {qrUrl}
                </a>
                . N&apos;importe quelle application de scan l&apos;ouvre.
              </p>
            </div>
          )}
        </section>

        <section aria-label="Ce que reçoit l'éditeur de caisse">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[15px] font-semibold">Suivi de la facture</h2>
            <span className="text-[12px] text-muted">en direct</span>
          </div>
          <EventFeed events={events} highlightToken={sale?.token} />
        </section>
      </div>
    </main>
  );
}
