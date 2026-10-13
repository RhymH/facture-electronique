import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";
import { HeroReceipt } from "@/components/site/HeroReceipt";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import { ARTICLES, readableDate } from "@/content/articles";
import { HOME_FAQ } from "@/content/faq";
import { faqSchema, graph, organizationSchema, softwareSchema, webPageSchema, websiteSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${SITE_NAME} : ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
  keywords: [
    "facturation électronique B2B",
    "logiciel de caisse",
    "intégration facturation électronique",
    "Factur-X",
    "plateforme agréée",
    "e-reporting",
    "QR code ticket de caisse",
  ],
});

const steps = [
  {
    title: "La caisse encaisse",
    text: "Votre logiciel envoie les lignes du ticket au module et reçoit une URL. Le ticket sort avec un QR code en bas, comme aujourd'hui.",
  },
  {
    title: "Le client scanne",
    text: "Avec l'appareil photo du téléphone. Pas d'application, pas de compte. La page affiche le ticket et demande une seule chose : l'entreprise.",
  },
  {
    title: "Il tape trois lettres",
    text: "Le nom ou le SIREN suffit, l'annuaire des entreprises fait le reste. L'entreprise est retenue sur le téléphone pour la prochaine fois.",
  },
  {
    title: "La facture part, la caisse est prévenue",
    text: "Factur-X généré, déposé sur la plateforme agréée. Un webhook marque la vente comme facturée B2B : elle sort de l'e-reporting.",
  },
];

const notYours = [
  ["Le Factur-X", "PDF/A-3 et XML CII au profil EN 16931, avec les mentions obligatoires de 2026."],
  ["Le connecteur de plateforme agréée", "Dépôt, suivi des statuts, rejets. Une interface, plusieurs plateformes."],
  ["L'annuaire et la recherche d'entreprise", "Le SIREN trouvé à partir du nom, la plateforme du destinataire résolue."],
  ["La page mobile du client", "En marque blanche, pensée pour le comptoir : terminé en moins de quinze secondes."],
  ["La sortie de l'e-reporting", "La vente marquée B2B dans votre caisse, pour qu'elle ne soit pas déclarée deux fois."],
  ["Les cas tordus", "Adresse de livraison différente, catégorie de l'opération, rescan, ticket expiré."],
];

export default function HomePage() {
  const qrUrl = absoluteUrl("/?via=ticket");
  return (
    <>
      <JsonLd
        data={graph(
          organizationSchema(),
          websiteSchema(),
          softwareSchema(),
          webPageSchema({ name: `${SITE_NAME} : ${SITE_TAGLINE}`, description: SITE_DESCRIPTION, path: "/" }),
          faqSchema(HOME_FAQ),
        )}
      />

      {/* Hero */}
      <section className="overflow-hidden">
        <div className="container grid gap-12 pt-14 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-20 lg:pb-24">
          <div>
            <p className="text-[15px] font-semibold text-indigo">Pour les éditeurs de logiciels de caisse</p>
            <h1 className="h-display mt-4">La facture électronique B2B, en scannant le ticket.</h1>
            <p className="lead mt-6 max-w-[52ch]">
              Un module en marque blanche pour votre caisse. Le client professionnel scanne le QR code du ticket, tape son
              SIREN, reçoit sa facture. Votre caisse est prévenue et la vente sort de l&apos;e-reporting. Rien à taper au
              comptoir.
            </p>
            <div className="mt-8 max-w-[560px]">
              <WaitlistForm source="accueil-hero" />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[420px] pt-2 lg:pt-8">
            <HeroReceipt qrUrl={qrUrl} />
          </div>
        </div>
      </section>

      {/* Le calendrier */}
      <section className="bg-marker text-ink">
        <div className="container grid gap-8 py-12 md:grid-cols-[auto_1fr_1fr] md:items-center md:gap-14">
          <p className="max-w-[20ch] text-[17px] font-semibold leading-snug">Ce que la loi impose à vos clients commerçants</p>
          <div className="border-t-2 border-ink pt-4">
            <p className="font-headline text-[34px] font-bold leading-none tracking-tight">1er septembre 2026</p>
            <p className="mt-2 max-w-[34ch] text-[15.5px] leading-snug">
              Toutes les entreprises doivent pouvoir recevoir des factures électroniques par une plateforme agréée.
            </p>
          </div>
          <div className="border-t-2 border-ink pt-4">
            <p className="font-headline text-[34px] font-bold leading-none tracking-tight">1er septembre 2027</p>
            <p className="mt-2 max-w-[34ch] text-[15.5px] leading-snug">
              TPE, PME et micro-entreprises doivent émettre en électronique, et transmettre leurs ventes B2C en e-reporting.
            </p>
          </div>
        </div>
      </section>

      {/* Au comptoir */}
      <section className="container grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-28">
        <div>
          <h2 className="h-section">Le problème n&apos;est pas le format. C&apos;est le comptoir.</h2>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-2">
            L&apos;artisan qui achète ses vis à la quincaillerie a besoin d&apos;une facture conforme pour déduire sa TVA. Sans
            elle, il va chez le grossiste qui la fait. Le commerçant, lui, a une file d&apos;attente et un SIREN à demander.
          </p>
          <ul className="mt-8 space-y-5 text-[16px] leading-relaxed">
            <li className="flex gap-4">
              <span className="mt-2 size-2.5 shrink-0 rounded-full bg-indigo" aria-hidden />
              <span>
                <strong className="font-semibold">Le caissier n&apos;a pas le SIREN.</strong> Ni l&apos;adresse de livraison, ni la
                catégorie de l&apos;opération. Et il n&apos;a pas deux minutes pour les saisir.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="mt-2 size-2.5 shrink-0 rounded-full bg-indigo" aria-hidden />
              <span>
                <strong className="font-semibold">La vente part déjà en B2C.</strong> Si une facture B2B est émise à côté de la
                caisse, l&apos;administration la reçoit deux fois.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="mt-2 size-2.5 shrink-0 rounded-full bg-indigo" aria-hidden />
              <span>
                <strong className="font-semibold">Les grandes enseignes le font déjà.</strong> Vos clients commerçants vont le
                voir, puis vous le demander. Avant septembre 2027.
              </span>
            </li>
          </ul>
        </div>
        <div className="rounded-3xl bg-paper-2 p-6 sm:p-10">
          <p className="text-[14px] font-semibold text-ink-2">Scène ordinaire, un mardi, 11h40</p>
          <dl className="mt-6 space-y-5 text-[17px] leading-relaxed">
            <div>
              <dt className="font-semibold">Le client</dt>
              <dd className="text-ink-2">« Il me faudrait une facture, c&apos;est pour l&apos;entreprise. »</dd>
            </div>
            <div>
              <dt className="font-semibold">La caissière</dt>
              <dd className="text-ink-2">« Vous avez votre numéro de SIREN ? Et l&apos;adresse, c&apos;est la même que… »</dd>
            </div>
            <div>
              <dt className="font-semibold">La file d&apos;attente</dt>
              <dd className="text-ink-2">Soupire.</dd>
            </div>
            <div className="border-t border-line pt-5">
              <dt className="font-semibold">Avec le module</dt>
              <dd className="text-ink-2">
                « Scannez le code en bas du ticket, c&apos;est tout. » <span className="mark font-semibold text-ink">Douze secondes.</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="scroll-mt-20 bg-paper-2">
        <div className="container py-20 lg:py-28">
          <h2 className="h-section max-w-[22ch]">Quatre étapes, aucune nouvelle pour le commerçant.</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t-2 border-ink pt-4">
                <span className="font-headline text-[15px] font-bold text-indigo">Étape {i + 1}</span>
                <p className="h-small mt-2">{s.title}</p>
                <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pour les éditeurs */}
      <section id="editeurs" className="scroll-mt-20">
        <div className="container grid gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div>
            <h2 className="h-section">Deux appels d&apos;API, un webhook. Le reste est à nous.</h2>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-2">
              Votre caisse envoie les lignes du ticket et reçoit l&apos;URL du QR code. Quand la facture part, elle reçoit un
              webhook pour marquer la vente. Vous ne touchez ni au Factur-X, ni aux plateformes agréées, ni à l&apos;annuaire.
            </p>
            <div className="code-card mt-8">
              <div className="c">{"// à l'encaissement"}</div>
              <div>
                <span className="k">POST</span> /sales
              </div>
              <div>{"{"}</div>
              <div>
                {"  "}
                <span className="s">&quot;merchant_siren&quot;</span>: <span className="s">&quot;123456789&quot;</span>,
              </div>
              <div>
                {"  "}
                <span className="s">&quot;lines&quot;</span>: [{"{"} <span className="s">&quot;label&quot;</span>:{" "}
                <span className="s">&quot;Vis inox 4x40&quot;</span>, <span className="s">&quot;qty&quot;</span>: 2,{" "}
                <span className="s">&quot;unit_ht&quot;</span>: 8.25, <span className="s">&quot;vat&quot;</span>: 20 {"}"}],
              </div>
              <div>
                {"  "}
                <span className="s">&quot;totals&quot;</span>: {"{"} <span className="s">&quot;20&quot;</span>: {"{"}{" "}
                <span className="s">&quot;ht&quot;</span>: 34.33, <span className="s">&quot;tva&quot;</span>: 6.87 {"}"} {"}"}
              </div>
              <div>{"}"}</div>
              <div className="c">
                → {"{"} &quot;token&quot;: &quot;k7f2…&quot;, &quot;qr_url&quot;: &quot;https://…/f/k7f2…&quot; {"}"}
              </div>
              <div className="mt-4 c">{"// quand la facture est émise"}</div>
              <div>
                <span className="k">WEBHOOK</span> sale.invoiced_b2b
              </div>
              <div>
                {"{"} <span className="s">&quot;token&quot;</span>: <span className="s">&quot;k7f2…&quot;</span>,{" "}
                <span className="s">&quot;invoice_number&quot;</span>: <span className="s">&quot;F-2027-0412&quot;</span>,{" "}
                <span className="s">&quot;client_siren&quot;</span>: <span className="s">&quot;987654321&quot;</span> {"}"}
              </div>
            </div>
          </div>
          <div className="lg:pt-3">
            <p className="h-small">Ce que vous n&apos;avez pas à construire</p>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {notYours.map(([title, text]) => (
                <li key={title}>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-2xl bg-indigo-soft p-6">
              <p className="font-semibold">Neutre entre plateformes, en marque blanche, pensé pour les petites équipes.</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                Les grands éditeurs ont une équipe sur le sujet. Vous avez une caisse à faire tourner. Le module s&apos;intègre
                en quelques jours, et la page que voit le client porte votre nom.
              </p>
              <Link href="/#liste-attente" className="btn btn-primary mt-5">
                Rejoindre la liste d&apos;attente
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="bg-paper-2">
        <div className="container py-20 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="h-section max-w-[24ch]">Pour préparer l&apos;intégration, sans jargon.</h2>
            <Link href="/blog" className="text-[16px] font-semibold text-indigo hover:text-indigo-deep">
              Tous les articles
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {ARTICLES.map((a) => (
              <article key={a.slug} className="rounded-3xl bg-white p-7 ring-1 ring-line">
                <p className="text-[14px] text-ink-2">
                  {readableDate(a.published)}. {a.minutes} min de lecture
                </p>
                <h3 className="h-small mt-3">
                  <Link href={`/blog/${a.slug}`} className="hover:text-indigo">
                    {a.title}
                  </Link>
                </h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{a.lead}</p>
                <Link href={`/blog/${a.slug}`} className="mt-5 inline-block font-semibold text-indigo hover:text-indigo-deep">
                  Lire l&apos;article
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="questions" className="scroll-mt-20">
        <div className="container grid gap-10 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
          <div>
            <h2 className="h-section">Les questions qu&apos;on nous pose en premier.</h2>
            <p className="mt-4 max-w-[40ch] text-[16px] leading-relaxed text-ink-2">
              Il en manque une ? Écrivez-nous, la réponse finira ici.
            </p>
          </div>
          <Faq items={HOME_FAQ} />
        </div>
      </section>

      <FinalCta source="accueil-fin" />
    </>
  );
}
