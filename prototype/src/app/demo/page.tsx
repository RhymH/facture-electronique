import type { Metadata } from "next";
import Link from "next/link";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { ...NOINDEX, title: "Démo : la facture en caisse" };

const flow = [
  ["La caisse encaisse", "Le ticket sort avec un QR code en bas. La vente part, pour l'instant, dans l'e-reporting B2C."],
  ["Le client scanne", "Avec l'appareil photo ou n'importe quel lecteur. Pas d'application à installer."],
  ["Il choisit son entreprise", "Celle retenue sur son téléphone, ou une autre trouvée par son nom ou son SIREN."],
  ["La facture part, la caisse est prévenue", "Factur-X généré, transmis à la plateforme agréée. La vente est marquée B2B : pas de double déclaration."],
];

export default function Home() {
  return (
    <main className="min-h-dvh bg-counter">
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <p className="text-[13px] font-medium text-ink-soft">Forme B · prototype de démonstration</p>
        <h1 className="mt-2 max-w-[22ch] text-[34px] font-semibold leading-[1.1] tracking-tight">
          La facture électronique, obtenue en scannant le ticket de caisse.
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          Deux écrans à ouvrir côte à côte : la caisse du commerçant, et le téléphone du client. Tout se passe sur cette machine,
          sans base de données.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link
            href="/caisse"
            className="group rounded-2xl bg-pos-bg p-6 text-pos-text shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] transition hover:-translate-y-0.5"
          >
            <div className="text-[13px] text-pos-muted">Côté commerçant</div>
            <div className="mt-1 text-[22px] font-semibold">La caisse et son ticket</div>
            <p className="mt-2 text-[14px] leading-snug text-pos-muted">
              Un écran de caisse, le ticket qui s&apos;imprime avec son QR code, et en face ce que l&apos;éditeur reçoit à chaque étape.
            </p>
            <div className="mt-5 text-[14px] font-semibold text-white group-hover:underline">Ouvrir la caisse</div>
          </Link>
          <Link
            href="/scan"
            className="group rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-ink-soft"
          >
            <div className="text-[13px] text-ink-soft">Côté client</div>
            <div className="mt-1 text-[22px] font-semibold">Le téléphone</div>
            <p className="mt-2 text-[14px] leading-snug text-ink-soft">
              Scanner le QR code, choisir son entreprise, recevoir la facture. Objectif : moins de quinze secondes.
            </p>
            <div className="mt-5 text-[14px] font-semibold text-cobalt group-hover:underline">Ouvrir le téléphone</div>
          </Link>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {flow.map(([title, text], i) => (
            <li key={title} className="border-t-2 border-ink pt-3">
              <div className="font-receipt text-[13px] text-muted">{i + 1}</div>
              <div className="mt-1 text-[15px] font-semibold">{title}</div>
              <p className="mt-1 text-[13.5px] leading-snug text-ink-soft">{text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 max-w-[70ch] rounded-xl border border-line bg-white p-5 text-[14px] leading-relaxed text-ink-soft">
          <p className="font-semibold text-ink">Pour scanner avec un vrai téléphone</p>
          <p className="mt-1">
            Ouvrez la caisse par l&apos;adresse réseau de cet ordinateur (elle est affichée sous le ticket) : le QR code pointera alors
            vers cette adresse et le téléphone, sur le même Wi-Fi, ouvrira la page avec son appareil photo. Les entreprises retenues
            restent sur le téléphone qui les a enregistrées.
          </p>
        </div>
      </div>
    </main>
  );
}
