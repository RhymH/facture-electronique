import type { Article } from "../type";
import { Callout, InternalLink } from "../../elements";

export const article: Article = {
  slug: "facturation-electronique-b2b-integration-logiciel-de-caisse",
  title: "Facturation électronique B2B : comment l'intégrer dans un logiciel de caisse avant septembre 2027",
  seoTitle: "Facturation électronique B2B : intégration en logiciel de caisse",
  description:
    "Intégrer la facturation électronique B2B dans un logiciel de caisse : calendrier 2026-2027, mentions obligatoires, SIREN au comptoir, e-reporting et trois façons de s'y prendre.",
  lead: "Vos clients commerçants vont devoir émettre des factures électroniques pour leurs clients professionnels. Ce que ça impose à une caisse, le piège du double comptage avec l'e-reporting, et les trois manières d'intégrer, de la plus lourde à la plus rapide.",
  published: "2026-10-13",
  keywords: [
    "facturation électronique B2B intégration",
    "facturation électronique logiciel de caisse",
    "intégration facturation électronique",
    "facture électronique caisse enregistreuse",
    "e-reporting caisse",
    "Factur-X caisse",
    "septembre 2027 facturation électronique",
  ],
  minutes: 9,
  toc: [
    { id: "calendrier", title: "Le calendrier : recevoir en 2026, émettre en 2027" },
    { id: "ce-qui-change-en-caisse", title: "Ce qui change concrètement pour une caisse" },
    { id: "le-probleme-du-comptoir", title: "Le problème, c'est le comptoir, pas le format" },
    { id: "double-comptage", title: "Facture B2B et e-reporting : le piège du double comptage" },
    { id: "trois-facons", title: "Trois façons d'intégrer la facturation électronique B2B" },
    { id: "parcours-cible", title: "Le parcours cible : quinze secondes, côté client" },
    { id: "checklist", title: "La liste à cocher avant de commencer" },
  ],
  faq: [
    {
      q: "Un logiciel de caisse est-il obligé de gérer la facturation électronique ?",
      a: "Non, l'obligation pèse sur l'entreprise qui vend, pas sur son logiciel. Mais à partir du 1er septembre 2027, une TPE ou PME qui vend à un professionnel doit lui remettre une facture électronique par une plateforme agréée, et transmettre ses ventes aux particuliers en e-reporting. Si la caisse ne le fait pas, le commerçant doit le faire à côté, à la main, ou changer de caisse.",
    },
    {
      q: "Une facture PDF envoyée par e-mail est-elle une facture électronique ?",
      a: "Non. Depuis la réforme, une facture électronique est un fichier structuré (Factur-X, UBL ou CII) transmis par une plateforme agréée, qui l'achemine vers la plateforme du destinataire. Un PDF simple envoyé par e-mail n'est plus conforme entre assujettis établis en France.",
    },
    {
      q: "Quelles mentions nouvelles une facture B2B doit-elle porter ?",
      a: "En plus des mentions habituelles : le numéro SIREN du client, l'adresse de livraison si elle diffère de l'adresse de facturation, la catégorie de l'opération (livraison de biens, prestation de services ou les deux) et, le cas échéant, l'option pour le paiement de la TVA d'après les débits.",
    },
    {
      q: "Le ticket de caisse reste-t-il valable quand une facture est émise ?",
      a: "Le ticket reste la preuve de l'encaissement, la facture devient la pièce comptable du client. Le point important est que la vente ne soit pas comptée deux fois dans vos transmissions : une fois dans l'agrégat B2C de l'e-reporting et une fois comme facture B2B. Faites valider le traitement exact par un expert-comptable.",
    },
    {
      q: "Combien de temps prend une intégration ?",
      a: "Tout construire soi-même (format, plateforme, annuaire, page client, réconciliation) se compte en mois. Avec un module prêt à brancher, l'intégration côté caisse se résume à un appel à l'encaissement, un webhook et l'impression d'un QR code : quelques jours de développement, puis des tests en sandbox.",
    },
  ],
  related: ["api-facturation-electronique-plateforme-agreee-factur-x"],
  Body: () => (
    <>
      <p>
        Si vous éditez un logiciel de caisse, vous avez déjà entendu parler de la réforme de la facturation électronique.
        Elle a souvent été présentée comme un sujet de comptables et de grandes entreprises. Elle arrive maintenant au
        comptoir : à partir de <strong>septembre 2027</strong>, le fleuriste, le quincaillier, le grossiste de quartier devront
        remettre une facture électronique à chaque client professionnel qui en demande une, et transmettre leurs ventes aux
        particuliers à l&apos;administration.
      </p>
      <p>
        Cet article décrit ce que cela impose concrètement à une caisse, le piège que presque tout le monde découvre trop tard
        (la même vente déclarée deux fois), et les trois manières d&apos;intégrer la facturation électronique B2B, de la plus
        lourde à la plus rapide.
      </p>

      <h2 id="calendrier">Le calendrier : recevoir en 2026, émettre en 2027</h2>
      <p>La réforme se déploie en deux temps :</p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Qui</th>
            <th>Obligation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1er septembre 2026</td>
            <td>Toutes les entreprises</td>
            <td>Être en mesure de recevoir des factures électroniques via une plateforme agréée</td>
          </tr>
          <tr>
            <td>1er septembre 2026</td>
            <td>Grandes entreprises et ETI</td>
            <td>Émettre en électronique et transmettre l&apos;e-reporting</td>
          </tr>
          <tr>
            <td>1er septembre 2027</td>
            <td>PME, TPE, micro-entreprises</td>
            <td>Émettre en électronique et transmettre l&apos;e-reporting</td>
          </tr>
        </tbody>
      </table>
      <p>
        Vos clients commerçants sont presque tous dans la dernière ligne. C&apos;est la raison pour laquelle le sujet paraît
        encore lointain : ils reçoivent déjà des factures électroniques de leurs fournisseurs, mais n&apos;en émettent pas.
        Dans moins d&apos;un an, ils devront le faire, au comptoir, avec la caisse que vous leur fournissez.
      </p>
      <Callout who="Un détail qui compte">
        La réception est obligatoire depuis septembre 2026 pour tout le monde. Chaque entreprise cliente de vos
        commerçants a donc déjà une plateforme agréée, et un annuaire central relie son SIREN à cette plateforme. C&apos;est
        ce qui rend le parcours au comptoir possible : le SIREN suffit pour acheminer la facture.
      </Callout>

      <h2 id="ce-qui-change-en-caisse">Ce qui change concrètement pour une caisse</h2>
      <p>Pour un logiciel de caisse, la réforme se résume à quatre capacités :</p>
      <ol>
        <li>
          <strong>Produire une facture structurée</strong>, au format Factur-X, UBL ou CII, avec les mentions exigées depuis
          la réforme : SIREN du client, adresse de livraison si elle diffère, catégorie de l&apos;opération (biens, services ou
          mixte), option de TVA sur les débits le cas échéant.
        </li>
        <li>
          <strong>La déposer sur une plateforme agréée</strong> (PA, anciennement PDP). Seules ces plateformes transmettent
          les factures entre entreprises. Le portail public ne joue plus que le rôle d&apos;annuaire et de concentrateur vers
          l&apos;administration.
        </li>
        <li>
          <strong>Transmettre l&apos;e-reporting</strong> des ventes aux particuliers, sous forme agrégée par période, par
          taux de TVA, à partir des données de la caisse (le ticket Z, en pratique).
        </li>
        <li>
          <strong>Suivre les statuts</strong> : déposée, rejetée, reçue, et plus tard les statuts de cycle de vie côté
          destinataire.
        </li>
      </ol>
      <p>
        Les trois dernières, vous devrez les avoir de toute façon pour l&apos;e-reporting. C&apos;est la première qui pose
        problème, parce qu&apos;elle suppose de <em>connaître le client</em> au moment de l&apos;encaissement.
      </p>

      <h2 id="le-probleme-du-comptoir">Le problème, c&apos;est le comptoir, pas le format</h2>
      <p>
        Écrire un Factur-X est un travail d&apos;ingénieur, bien documenté, borné. Le vrai problème est humain. Un client
        professionnel se présente en caisse. Pour lui faire une facture conforme, le caissier doit obtenir son SIREN,
        vérifier sa raison sociale, savoir si l&apos;adresse de livraison diffère, choisir la catégorie de l&apos;opération. Il y a
        trois personnes derrière.
      </p>
      <p>
        Qui ressent la douleur ? D&apos;abord le client. L&apos;artisan qui achète ses vis à la quincaillerie a besoin de la
        facture pour déduire sa TVA. Sans elle, il ira chez le grossiste qui la fait sans discuter. Le commerçant, lui, ne
        souffre que s&apos;il perd ce client, ce qui arrive sans bruit.
      </p>
      <Callout who="Ce qu'on entend chez les commerçants">
        « Les factures, je les fais le soir, sur le logiciel de compta, en recopiant le ticket. Quand j&apos;ai le temps. »
        Traduction : la facture est faite hors de la caisse, parfois plusieurs jours après, et la vente a déjà été comptée
        comme une vente au détail.
      </Callout>
      <p>
        La bonne nouvelle : le client n&apos;a plus grand-chose à « saisir ». Le SIREN suffit pour acheminer la facture, et
        l&apos;API publique de recherche d&apos;entreprises le retrouve à partir de trois lettres du nom. Le parcours idéal
        fait une dizaine de secondes. À condition que ce soit le client qui le fasse, sur son téléphone, et pas le caissier.
      </p>

      <h2 id="double-comptage">Facture B2B et e-reporting : le piège du double comptage</h2>
      <p>
        C&apos;est le point que presque personne ne voit avant d&apos;avoir construit. Une vente passe en caisse : elle est
        enregistrée, et à partir de 2027, elle part dans l&apos;e-reporting dans l&apos;agrégat des ventes aux particuliers.
        Si, ensuite, une facture électronique B2B est émise pour la même opération, l&apos;administration reçoit la
        transaction deux fois : une fois comme vente au détail, une fois comme facture entre entreprises.
      </p>
      <p>
        Un outil qui vit <em>à côté</em> de la caisse (le logiciel de compta, une appli de facturation, un portail de
        plateforme agréée) a structurellement ce problème : il ne sait pas dire à la caisse que la vente a changé de nature.
        Un outil <em>dans</em> la caisse ne l&apos;a pas, à condition d&apos;avoir prévu le mécanisme :
      </p>
      <ul>
        <li>la vente est créée comme une vente ordinaire, et part par défaut dans l&apos;agrégat B2C ;</li>
        <li>quand une facture B2B est émise pour cette vente, la caisse la marque comme « facturée B2B » ;</li>
        <li>l&apos;agrégat B2C transmis en e-reporting exclut les ventes ainsi marquées, ou les rectifie si la période est
          déjà transmise.</li>
      </ul>
      <p>
        Le traitement exact (fenêtre de rectification, cas d&apos;une facture émise après la clôture de la période) doit être
        validé avec un expert-comptable. Mais l&apos;architecture, elle, ne se discute pas : la caisse doit être prévenue.
        Nous détaillons le mécanisme dans{" "}
        <InternalLink href="/blog/api-facturation-electronique-plateforme-agreee-factur-x">
          l&apos;article sur l&apos;architecture d&apos;intégration
        </InternalLink>
        .
      </p>

      <h2 id="trois-facons">Trois façons d&apos;intégrer la facturation électronique B2B</h2>
      <h3>1. Tout construire</h3>
      <p>
        Générateur Factur-X, connecteur vers une ou plusieurs plateformes agréées, interrogation de l&apos;annuaire, écran de
        saisie du client, suivi des statuts, réconciliation avec l&apos;e-reporting. C&apos;est la voie des grands éditeurs,
        qui ont une équipe dédiée. Comptez plusieurs mois, et une maintenance continue : les plateformes font évoluer leurs
        API, et les spécifications aussi.
      </p>
      <h3>2. Prendre le kit d&apos;une plateforme agréée</h3>
      <p>
        Plusieurs plateformes proposent des SDK et des portails. Vous résolvez le dépôt et les statuts. Vous ne résolvez ni
        le comptoir (le client doit toujours donner son SIREN au caissier, ou créer un compte sur le portail), ni la
        neutralité (vous liez vos commerçants à une plateforme), ni la réconciliation avec l&apos;e-reporting, qui reste
        votre affaire.
      </p>
      <h3>3. Brancher un module prêt pour le comptoir</h3>
      <p>
        C&apos;est ce que nous construisons avec <InternalLink href="/">Factick</InternalLink>. La caisse envoie les lignes du
        ticket au module et reçoit l&apos;URL d&apos;un QR code à imprimer en bas du ticket. Le client scanne, choisit son
        entreprise par son nom ou son SIREN, et reçoit sa facture Factur-X par sa plateforme. La caisse reçoit un webhook
        pour marquer la vente comme facturée B2B. Côté éditeur, l&apos;intégration tient en un appel d&apos;API, un webhook
        et une ligne de plus sur le ticket.
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Tout construire</th>
            <th>Kit d&apos;une plateforme</th>
            <th>Module comptoir</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Saisie au comptoir</td>
            <td>À concevoir</td>
            <td>Reste au caissier</td>
            <td>Le client scanne</td>
          </tr>
          <tr>
            <td>Factur-X et mentions</td>
            <td>À écrire</td>
            <td>Fourni</td>
            <td>Fourni</td>
          </tr>
          <tr>
            <td>Neutralité entre plateformes</td>
            <td>Si vous la codez</td>
            <td>Non</td>
            <td>Oui</td>
          </tr>
          <tr>
            <td>Sortie de l&apos;e-reporting</td>
            <td>À concevoir</td>
            <td>À concevoir</td>
            <td>Webhook fourni</td>
          </tr>
          <tr>
            <td>Délai</td>
            <td>Mois</td>
            <td>Semaines</td>
            <td>Jours</td>
          </tr>
        </tbody>
      </table>

      <h2 id="parcours-cible">Le parcours cible : quinze secondes, côté client</h2>
      <p>Quelle que soit la voie choisie, mesurez-vous à ce parcours :</p>
      <ol>
        <li>Le ticket sort, avec un QR code et une ligne : « Besoin d&apos;une facture ? Scannez. »</li>
        <li>Le client ouvre l&apos;appareil photo de son téléphone. Aucune application, aucun compte.</li>
        <li>La page montre le ticket et demande l&apos;entreprise. Trois lettres du nom suffisent ; l&apos;entreprise choisie
          est retenue pour la prochaine fois.</li>
        <li>Un bouton : « Recevoir ma facture ». La facture part vers la plateforme du client ; il peut aussi la voir en
          PDF tout de suite.</li>
        <li>La caisse affiche la vente comme facturée B2B.</li>
      </ol>
      <p>
        Si votre parcours demande au caissier de taper quoi que ce soit, ou au client de créer un compte, il ne sera pas
        utilisé. Pas par mauvaise volonté : parce qu&apos;il y a du monde derrière.
      </p>

      <h2 id="checklist">La liste à cocher avant de commencer</h2>
      <ul>
        <li>
          <strong>Vos ventes portent-elles tout ce qu&apos;une facture exige ?</strong> Lignes avec désignation, quantité, prix
          unitaire HT, taux de TVA ; totaux par taux ; identité du commerçant (SIREN, TVA intracommunautaire, adresse).
        </li>
        <li>
          <strong>Une vente peut-elle changer d&apos;état après l&apos;encaissement ?</strong> Il faut pouvoir la marquer
          « facturée B2B » après coup, parfois le lendemain.
        </li>
        <li>
          <strong>Votre e-reporting B2C sait-il exclure ces ventes ?</strong> Et rectifier une période déjà transmise ?
        </li>
        <li>
          <strong>Qui porte la numérotation des factures ?</strong> Elle doit être chronologique et continue chez le
          commerçant. Décidez si c&apos;est la caisse ou le module qui l&apos;attribue.
        </li>
        <li>
          <strong>Votre imprimante ticket sait-elle imprimer un QR code ?</strong> Presque toutes, via ESC/POS. Vérifiez la
          taille minimale lisible par un téléphone.
        </li>
        <li>
          <strong>Avez-vous une plateforme agréée en sandbox ?</strong> Pour tester les dépôts et les rejets sans facture
          réelle.
        </li>
        <li>
          <strong>Avez-vous une heure avec un expert-comptable ?</strong> Pour le double comptage, la fenêtre de rectification
          et le statut du ticket face à la facture.
        </li>
      </ul>
      <p>
        Si vous cochez la première case et que les autres vous font soupirer, c&apos;est précisément la partie que le module
        prend en charge. Laissez un contact sur la{" "}
        <InternalLink href="/#liste-attente">liste d&apos;attente</InternalLink> : on vous montre le parcours sur votre
        ticket.
      </p>
    </>
  ),
};
