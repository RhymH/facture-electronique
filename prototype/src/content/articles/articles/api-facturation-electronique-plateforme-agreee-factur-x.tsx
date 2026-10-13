import type { Article } from "../type";
import { Callout, InternalLink } from "../../elements";

export const article: Article = {
  slug: "api-facturation-electronique-plateforme-agreee-factur-x",
  title: "API de facturation électronique : ce qu'un éditeur de caisse doit brancher (plateforme agréée, annuaire, Factur-X)",
  seoTitle: "API facturation électronique : plateforme agréée, Factur-X",
  description:
    "Plateforme agréée, annuaire, Factur-X, webhooks de statut, e-reporting : l'architecture d'une intégration de facturation électronique, vue depuis un logiciel de caisse, avec les pièges à tester.",
  lead: "Le schéma complet d'une intégration : où la caisse s'arrête, où la plateforme agréée commence, comment la facture trouve son destinataire avec un simple SIREN, ce qu'il y a vraiment dans un Factur-X, et ce qu'il faut faire des statuts qui reviennent.",
  published: "2026-10-13",
  keywords: [
    "API facturation électronique",
    "intégration plateforme agréée",
    "Factur-X API",
    "annuaire facturation électronique SIREN",
    "webhook facture électronique",
    "e-reporting intégration",
    "opérateur de dématérialisation",
  ],
  minutes: 10,
  toc: [
    { id: "architecture", title: "L'architecture en un schéma" },
    { id: "plateforme-agreee", title: "La plateforme agréée : votre seul point de dépôt" },
    { id: "annuaire-siren", title: "L'annuaire et le SIREN : comment la facture trouve son destinataire" },
    { id: "factur-x", title: "Factur-X en pratique : un PDF qui contient un XML" },
    { id: "statuts", title: "Les statuts de la facture, et quoi en faire dans la caisse" },
    { id: "e-reporting", title: "E-reporting : ce qui part en agrégé, ce qui n'y est plus" },
    { id: "sandbox", title: "Tester : sandbox, jeux d'essai, erreurs à provoquer" },
  ],
  faq: [
    {
      q: "Qu'est-ce qu'une plateforme agréée (PA) ?",
      a: "Une plateforme privée immatriculée par l'administration pour transmettre les factures électroniques entre entreprises et les données d'e-reporting vers l'administration. Les anciennes PDP (plateformes de dématérialisation partenaires) ont été renommées plateformes agréées. Chaque entreprise en choisit une pour recevoir, et une (souvent la même) pour émettre.",
    },
    {
      q: "Faut-il être soi-même plateforme agréée pour émettre des factures depuis une caisse ?",
      a: "Non. Un logiciel de caisse, ou un module comme Factick, joue le rôle d'opérateur de dématérialisation : il prépare la facture au bon format et la dépose sur la plateforme agréée choisie par le commerçant, par API. Seule la plateforme a besoin de l'agrément.",
    },
    {
      q: "Quelle est la différence entre Factur-X, UBL et CII ?",
      a: "Ce sont les trois formats acceptés par la réforme. UBL et CII sont des XML purs. Factur-X est un PDF/A-3 lisible par un humain qui embarque un XML CII : le même fichier sert à la comptabilité du client et à l'archivage. C'est le format le plus naturel pour une facture issue d'un ticket de caisse.",
    },
    {
      q: "Comment connaître la plateforme agréée du client à partir de son SIREN ?",
      a: "Par l'annuaire central, tenu par l'administration, qui relie chaque SIREN (et éventuellement chaque établissement ou service) à sa plateforme de réception. En pratique, c'est la plateforme émettrice qui interroge l'annuaire et achemine la facture : depuis la caisse, le SIREN du client suffit.",
    },
    {
      q: "Que se passe-t-il si la facture est rejetée par la plateforme ?",
      a: "La plateforme renvoie un statut de rejet avec un motif (format invalide, SIREN inconnu, mention manquante). La facture n'a pas été transmise : il faut corriger et redéposer. Côté caisse, la vente ne doit pas être marquée comme facturée B2B tant que le dépôt n'est pas accepté.",
    },
  ],
  related: ["facturation-electronique-b2b-integration-logiciel-de-caisse"],
  Body: () => (
    <>
      <p>
        Dans{" "}
        <InternalLink href="/blog/facturation-electronique-b2b-integration-logiciel-de-caisse">
          l&apos;article précédent
        </InternalLink>
        , nous avons vu pourquoi la facturation électronique B2B arrive au comptoir en septembre 2027 et pourquoi le vrai
        sujet est la saisie, pas le format. Celui-ci est pour la personne qui va effectivement brancher les tuyaux : quelles
        briques, dans quel ordre, et quoi tester.
      </p>

      <h2 id="architecture">L&apos;architecture en un schéma</h2>
      <pre>{`Caisse (votre logiciel)        Module / opérateur            Plateforme agréée        Client pro
        |                            |                              |                     |
        |-- vente (lignes, totaux) ->|                              |                     |
        |<-- jeton + URL du QR ------|                              |                     |
        |   (imprimé sur le ticket)  |<------------ scan du QR ----------------------------|
        |                            |------------- page : ticket, choix de l'entreprise ->|
        |                            |<------------ SIREN -------------------------------|
        |                            |-- Factur-X ----------------->|                     |
        |                            |                              |-- annuaire --------->|
        |<-- webhook : vente B2B ----|<-- statut : déposée ---------|  (plateforme du client)
        |   (sortie de l'e-reporting)|<-- statut : reçue -----------|                     |`}</pre>
      <p>Quatre acteurs, et une frontière claire :</p>
      <ul>
        <li>
          <strong>La caisse</strong> sait ce qui a été vendu et à quel prix. Elle ne sait rien du client professionnel, et
          c&apos;est très bien ainsi.
        </li>
        <li>
          <strong>Le module</strong> (au sens de la réforme, un opérateur de dématérialisation) transforme la vente en
          facture, obtient l&apos;identité du client, produit le Factur-X et le dépose.
        </li>
        <li>
          <strong>La plateforme agréée</strong> contrôle, transmet au destinataire via l&apos;annuaire, et renvoie les
          statuts. Elle transmet aussi les données à l&apos;administration.
        </li>
        <li>
          <strong>Le client</strong> ne voit qu&apos;une page web, et reçoit sa facture sur sa propre plateforme.
        </li>
      </ul>

      <h2 id="plateforme-agreee">La plateforme agréée : votre seul point de dépôt</h2>
      <p>
        Depuis la réforme, les factures entre entreprises françaises ne transitent plus directement d&apos;un logiciel à
        l&apos;autre. Elles passent par des <strong>plateformes agréées</strong> (PA), des opérateurs privés immatriculés
        par l&apos;administration. Le portail public, un temps envisagé comme plateforme gratuite universelle, a été recentré
        sur deux rôles : l&apos;annuaire, et le concentrateur qui reçoit les données des plateformes pour l&apos;administration.
      </p>
      <p>Pour un éditeur, cela veut dire :</p>
      <ul>
        <li>
          Vous n&apos;avez pas besoin d&apos;être agréé. Vous êtes un <em>opérateur de dématérialisation</em> : vous
          préparez et déposez, par API, sur la plateforme choisie par le commerçant.
        </li>
        <li>
          Le commerçant a besoin d&apos;un compte sur une plateforme. Beaucoup proposent une offre d&apos;entrée gratuite ou
          très peu chère. Le mandat qu&apos;il vous donne pour déposer en son nom est un point à régler avec la plateforme.
        </li>
        <li>
          Chaque plateforme a sa propre API de dépôt. Les formats de factures sont normalisés, les API de dépôt ne le sont
          pas. Isolez-les derrière une interface : <code>deposer(facture)</code>, <code>statut(id)</code>, et un point de
          réception des notifications.
        </li>
      </ul>
      <Callout who="Conseil d'architecture">
        Ne liez pas votre produit à une plateforme. Vos commerçants en changeront, ou en auront déjà une à cause de leur
        comptable. Une interface abstraite et un connecteur par plateforme coûtent peu au départ et évitent une migration
        douloureuse plus tard.
      </Callout>

      <h2 id="annuaire-siren">L&apos;annuaire et le SIREN : comment la facture trouve son destinataire</h2>
      <p>
        L&apos;annuaire central relie chaque entreprise (par son SIREN, et si elle le souhaite par établissement ou par
        service) à la plateforme sur laquelle elle reçoit ses factures. Toute entreprise devant pouvoir recevoir depuis
        septembre 2026, l&apos;annuaire est, en principe, complet pour vos clients professionnels.
      </p>
      <p>Conséquence pratique, et c&apos;est la clé du parcours au comptoir :</p>
      <ul>
        <li>
          Le client n&apos;a rien à renseigner d&apos;autre que son <strong>SIREN</strong>. Ni l&apos;adresse de sa
          plateforme, ni un e-mail de facturation.
        </li>
        <li>
          Le SIREN se retrouve à partir du nom. L&apos;API publique de recherche d&apos;entreprises (
          <code>recherche-entreprises.api.gouv.fr</code>) est gratuite, sans clé, et répond en quelques dizaines de
          millisecondes à « plomb dur » par « PLOMBERIE DURAND, 67000 Strasbourg ». Elle donne aussi l&apos;adresse du siège
          et le numéro de TVA intracommunautaire.
        </li>
        <li>
          La résolution « SIREN vers plateforme » est faite par la plateforme émettrice au moment du dépôt. Depuis la caisse
          ou le module, vous n&apos;interrogez pas l&apos;annuaire vous-même.
        </li>
      </ul>
      <p>
        Retenez l&apos;entreprise choisie sur le téléphone du client (stockage local du navigateur, pas de compte). La
        deuxième fois, le parcours tient en deux gestes : scanner, confirmer.
      </p>

      <h2 id="factur-x">Factur-X en pratique : un PDF qui contient un XML</h2>
      <p>
        Trois formats sont acceptés : UBL, CII et Factur-X. Pour une facture issue d&apos;un ticket, Factur-X est le plus
        naturel : c&apos;est un <strong>PDF/A-3</strong> lisible (ce que le client ouvre et archive) qui embarque un fichier
        XML au format CII (ce que les machines lisent). Un seul fichier, deux lecteurs.
      </p>
      <p>Les points qui font passer ou échouer un dépôt :</p>
      <ul>
        <li>
          <strong>Le profil.</strong> Visez EN 16931. Les profils plus légers (MINIMUM, BASIC WL) ne portent pas les lignes,
          ce qui finira par poser problème au client ou au contrôle.
        </li>
        <li>
          <strong>Les mentions de la réforme.</strong> SIREN du client, adresse de livraison si différente, catégorie de
          l&apos;opération (biens, services, mixte), option TVA sur les débits. Elles ont chacune leur place dans le XML ;
          une mention absente est un motif de rejet.
        </li>
        <li>
          <strong>La cohérence arithmétique.</strong> La somme des lignes doit égaler le total HT, la TVA par taux doit
          correspondre aux bases. Les plateformes vérifient. Un ticket est un objet très contraint : vérifiez ces égalités
          <em>avant</em> le dépôt, et rejetez tout de suite une vente incohérente.
        </li>
        <li>
          <strong>Le PDF/A-3.</strong> Polices embarquées, pas de transparence, métadonnées XMP qui déclarent le
          Factur-X. Les bibliothèques existent ; ne le faites pas à la main.
        </li>
        <li>
          <strong>La numérotation.</strong> Chronologique et continue par commerçant. Décidez qui l&apos;attribue (la caisse
          ou le module) et ne le faites jamais aux deux endroits.
        </li>
      </ul>

      <h2 id="statuts">Les statuts de la facture, et quoi en faire dans la caisse</h2>
      <p>
        Après le dépôt, la plateforme renvoie une suite de statuts. Les noms varient d&apos;une plateforme à l&apos;autre,
        mais la séquence est toujours la même :
      </p>
      <table>
        <thead>
          <tr>
            <th>Statut</th>
            <th>Sens</th>
            <th>Côté caisse</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Déposée</td>
            <td>Le fichier est accepté par votre plateforme</td>
            <td>Marquer la vente « facturée B2B »</td>
          </tr>
          <tr>
            <td>Rejetée</td>
            <td>Format ou contenu invalide, destinataire introuvable</td>
            <td>Ne rien marquer, corriger, redéposer</td>
          </tr>
          <tr>
            <td>Reçue</td>
            <td>La plateforme du client l&apos;a prise en charge</td>
            <td>Rien de plus, c&apos;est fini pour la caisse</td>
          </tr>
          <tr>
            <td>Refusée par le client</td>
            <td>Le client conteste (rare pour un ticket)</td>
            <td>Alerter le commerçant, prévoir un avoir</td>
          </tr>
        </tbody>
      </table>
      <p>
        Le statut qui compte pour la caisse est le premier. C&apos;est lui qui déclenche le{" "}
        <strong>webhook « vente facturée B2B »</strong>, et donc la sortie de la vente de l&apos;agrégat B2C. Un module
        qui ne renvoie pas cette information à la caisse ne règle que la moitié du problème.
      </p>
      <pre>{`POST https://votre-caisse.example/webhooks/factick
{
  "event": "sale.invoiced_b2b",
  "token": "k7f2…",             // le jeton rendu à l'encaissement
  "invoice_number": "F-2027-0412",
  "client_siren": "987654321",
  "deposited_at": "2027-03-04T11:41:08Z"
}`}</pre>

      <h2 id="e-reporting">E-reporting : ce qui part en agrégé, ce qui n&apos;y est plus</h2>
      <p>
        L&apos;e-reporting couvre, entre autres, les ventes aux particuliers. Pour un commerce, il part sous forme agrégée
        par période et par taux de TVA, à partir du ticket Z ou de son équivalent. Il transite lui aussi par la plateforme
        agréée, à une fréquence qui dépend du régime de TVA du commerçant.
      </p>
      <p>
        Le point délicat, détaillé dans{" "}
        <InternalLink href="/blog/facturation-electronique-b2b-integration-logiciel-de-caisse#double-comptage">
          l&apos;article précédent
        </InternalLink>
        , est qu&apos;une vente ayant donné lieu à une facture B2B <strong>ne doit plus figurer</strong> dans cet agrégat.
        Concrètement :
      </p>
      <ol>
        <li>Chaque vente porte un indicateur « facturée B2B », faux par défaut.</li>
        <li>Le webhook le passe à vrai, avec le numéro de facture et la date.</li>
        <li>L&apos;agrégat B2C d&apos;une période exclut les ventes à vrai.</li>
        <li>
          Si le webhook arrive après la transmission de la période (le client scanne le lendemain), il faut une rectification
          de la période, ou une fenêtre de validité du QR code plus courte que votre période de transmission. Les deux se
          défendent ; faites trancher par votre expert-comptable.
        </li>
      </ol>
      <Callout who="Le test qui révèle tout">
        Demandez à votre équipe : « Si un client scanne le QR code d&apos;un ticket d&apos;hier, qu&apos;est-ce qui se passe
        dans l&apos;e-reporting ? » Si la réponse est floue, le sujet n&apos;est pas réglé, quelle que soit la solution
        choisie.
      </Callout>

      <h2 id="sandbox">Tester : sandbox, jeux d&apos;essai, erreurs à provoquer</h2>
      <p>Avant la première facture réelle, provoquez volontairement ces cas :</p>
      <ul>
        <li>Une vente dont la somme des lignes ne fait pas le total : le dépôt doit être refusé avant d&apos;atteindre la plateforme.</li>
        <li>Un SIREN qui n&apos;existe pas, puis un SIREN valide mais absent de l&apos;annuaire : deux rejets différents, deux messages différents pour le client.</li>
        <li>Deux scans du même ticket : un seul doit aboutir, le second doit afficher la facture déjà émise.</li>
        <li>Un scan après expiration du QR code : message clair, et rien côté caisse.</li>
        <li>Une adresse de livraison différente du siège : la mention doit apparaître dans le XML.</li>
        <li>Une vente avec deux taux de TVA (5,5 % et 20 %) : les bases par taux doivent être exactes au centime.</li>
        <li>Un webhook non acquitté par la caisse : le module doit réessayer, et vous devez pouvoir le rejouer.</li>
      </ul>
      <p>
        Une plateforme agréée avec une sandbox et une API documentée est le premier choix à faire. Si vous ne voulez
        choisir ni plateforme, ni bibliothèque Factur-X, ni écran client, c&apos;est exactement le périmètre de{" "}
        <InternalLink href="/">Factick</InternalLink> : un appel à l&apos;encaissement, un webhook, un QR code sur le
        ticket. Le reste est à nous. La <InternalLink href="/#liste-attente">liste d&apos;attente</InternalLink> est ouverte
        aux éditeurs qui veulent une intégration pilote.
      </p>
    </>
  ),
};
