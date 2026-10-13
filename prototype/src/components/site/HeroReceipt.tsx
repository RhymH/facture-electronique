"use client";
import { QrCode } from "@/components/QrCode";

function row(left: string, right: string, width = 30) {
  const space = Math.max(1, width - left.length - right.length);
  return left + " ".repeat(space) + right;
}

const lines: [string, string, string][] = [
  ["Vis inox 4x40 (x100)", "2 x 9,90", "19,80"],
  ["Cheville nylon 8mm", "1 x 6,50", "6,50"],
  ["Mèche béton SDS 10", "1 x 14,90", "14,90"],
];

/** Le ticket du hero : il sort de l'imprimante, le QR est réel, puis la vente est marquée B2B. */
export function HeroReceipt({ qrUrl }: { qrUrl: string }) {
  return (
    <div className="printer">
      <div className="printer-slot" aria-hidden />
      <div className="printer-paper">
        <div className="receipt px-5 pt-6 pb-8 text-[12.5px] leading-[1.45]" aria-label="Exemple de ticket de caisse avec QR code">
          <div className="text-center">
            <div className="text-[14px] font-bold uppercase tracking-wide">Quincaillerie Martin</div>
            <div>12 rue des Forges</div>
            <div>67000 Strasbourg</div>
          </div>
          <pre className="mt-3 whitespace-pre font-[inherit]">{row("Ticket 0412", "Caisse 1")}</pre>
          <div className="my-2 border-t border-dashed border-[#9aa0a6]" />
          <pre className="whitespace-pre font-[inherit]">
            {lines.map(([label, qty, total]) => row(label, total) + "\n  " + qty + "  TVA 20%").join("\n")}
          </pre>
          <div className="my-2 border-t border-dashed border-[#9aa0a6]" />
          <pre className="whitespace-pre font-[inherit]">
            {row("Total HT", "34,33")}
            {"\n"}
            {row("TVA 20%", "6,87")}
          </pre>
          <pre className="whitespace-pre font-[inherit] text-[15px] font-bold">{row("TOTAL TTC", "41,20 EUR", 25)}</pre>
          <pre className="mt-1 whitespace-pre font-[inherit]">{row("CB", "41,20")}</pre>
          <div className="my-3 border-t border-dashed border-[#9aa0a6]" />
          <div className="text-center">
            <div className="text-[13px] font-bold uppercase">Besoin d&apos;une facture ?</div>
            <div className="mt-0.5">Scannez, saisissez votre SIREN. C&apos;est tout.</div>
            <div className="mt-3 flex justify-center">
              <QrCode value={qrUrl} size={118} />
            </div>
            <div className="mt-3">
              <span className="receipt-mark text-[13px]">Vente B2B facturée</span>
            </div>
          </div>
          <div className="mt-4 text-center text-[11px]">Merci de votre visite</div>
        </div>
      </div>

      <div className="phone-pop absolute -right-3 bottom-6 z-10 w-[150px] rounded-[22px] border-[5px] border-[#111722] bg-white p-3 shadow-[0_24px_40px_-20px_rgba(0,0,0,0.6)] sm:-right-12">
        <div className="text-[11px] font-semibold text-ink-2">Ma facture</div>
        <div className="mt-1.5 rounded-lg bg-mint-soft px-2 py-2 text-[11.5px] font-semibold leading-tight text-ink">
          Facture envoyée à Plomberie Durand
        </div>
        <div className="mt-2 h-8 rounded-lg bg-indigo text-center text-[11px] font-semibold leading-8 text-white">Terminé</div>
      </div>
    </div>
  );
}
