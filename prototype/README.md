# Factick — site vitrine et prototype de démonstration

Deux choses cohabitent dans cette application :

- **Le site vitrine** (`/`, `/blog`, `/blog/<article>`), destiné aux éditeurs de logiciels de caisse, avec une liste
  d'attente (téléphone ou e-mail) qui nous prévient par e-mail via Resend.
- **La démo** du parcours décrit dans [design/forme-b.md](../design/forme-b.md), cachée derrière `/demo` et exclue de
  l'indexation : un client professionnel obtient sa facture électronique en scannant le QR code imprimé sur son ticket
  de caisse, et la caisse est prévenue que la vente sort de l'e-reporting B2C.

Le nom « Factick » est provisoire : il est défini une seule fois dans `src/lib/site.ts`, tout le reste suit.

Ce n'est pas un produit : aucune base de données, aucune vraie plateforme agréée. Tout tourne sur la machine qui
lance le serveur.

## Lancer

```bash
npm install
npm run dev
```

Puis ouvrir <http://localhost:3000> (site vitrine) ou <http://localhost:3000/demo> (démo).

## Le site vitrine

| Adresse | Rôle |
| --- | --- |
| `/` | Accueil : promesse, calendrier 2026-2027, scène au comptoir, quatre étapes, API, FAQ, liste d'attente |
| `/blog` | Index des articles |
| `/blog/<slug>` | Articles SEO : sommaire, FAQ en JSON-LD, appel à la liste d'attente. Un fichier par article dans `src/content/articles/articles/`, enregistré dans `index.ts` ; sitemap, pied de page et « À lire ensuite » suivent |
| `/api/waitlist` | Reçoit le formulaire, envoie l'alerte par Resend, garde une copie dans `.data/waitlist.json` |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | Générés par `src/app/sitemap.ts`, `robots.ts` et `opengraph-image.tsx` |

### Configuration

Copier `.env.example` en `.env.local` :

```
NEXT_PUBLIC_SITE_URL=https://factick.fr   # adresse publique (métadonnées, sitemap, QR du hero)
RESEND_API_KEY=re_…                        # https://resend.com
WAITLIST_TO=vous@exemple.fr                # qui reçoit l'alerte (virgules pour plusieurs adresses)
WAITLIST_FROM=Factick <liste@factick.fr>   # domaine vérifié chez Resend (onboarding@resend.dev pour tester)
```

Sans `RESEND_API_KEY` ou `WAITLIST_TO`, le formulaire fonctionne quand même : l'inscription est conservée dans
`.data/waitlist.json` et un avertissement est écrit dans la console du serveur. Limite : 5 inscriptions par heure et
par adresse IP.

## Les écrans de la démo

| Adresse | Rôle |
| --- | --- |
| `/demo` | Page d'accueil de la démo, avec les deux entrées ci-dessous (non indexée, comme tout ce qui suit) |
| `/caisse` | Côté commerçant : écran de caisse, ticket imprimé avec QR code, journal de ce que l'éditeur reçoit (webhooks) |
| `/scan` | Côté client : scan du QR code avec la caméra du navigateur, ou raccourci de démo vers le dernier ticket |
| `/f/<jeton>` | Page ouverte par le QR code : résumé du ticket, choix de l'entreprise, envoi de la facture |
| `/entreprises` | Entreprises retenues sur le téléphone : ajout par nom ou SIREN, dernière facture reçue, retrait avec confirmation |
| `/facture/<jeton>` | La facture, imprimable ou enregistrable en PDF |

## Scénario de démo conseillé

1. Ouvrir `/caisse` sur un grand écran. Un panier est déjà préparé : cliquer **Encaisser CB**. Le ticket sort avec son QR code,
   le journal affiche « Ticket imprimé ».
2. Sur un téléphone (ou dans un second onglet via **Ouvrir le téléphone du client**), scanner le QR code.
   Le journal affiche « QR code scanné ».
3. Sur le téléphone, l'entreprise déjà retenue (PLOMBERIE DURAND) est présélectionnée. Pour montrer l'ajout, toucher
   **Une autre entreprise** et taper un nom ou un SIREN : la recherche interroge l'API publique
   [recherche-entreprises.api.gouv.fr](https://recherche-entreprises.api.gouv.fr) (liste locale de secours si hors ligne).
4. Toucher **Recevoir ma facture**. Côté caisse : facture créée, vente **marquée B2B** (tampon sur le ticket),
   puis transmission, dépôt et réception par la plateforme du client, étalés sur une dizaine de secondes.
5. **Voir la facture (PDF)** ouvre la facture ; **Mes entreprises** montre l'entreprise retenue pour la prochaine fois.

**Remettre à zéro** (en haut de la caisse) efface les ventes et le journal.

## Scanner avec un vrai téléphone

Le QR code contient l'adresse réseau de l'ordinateur (par exemple `http://192.168.1.20:3000/f/<jeton>`), même quand
la caisse est ouverte en `localhost`. `npm run dev` écoute déjà sur toutes les interfaces (`-H 0.0.0.0`) ; le
téléphone, sur le même Wi-Fi, scanne le QR code avec l'appareil photo ou n'importe quel lecteur et la page
`/f/<jeton>` s'ouvre directement. L'adresse réelle est affichée sous le ticket.

Une fois déployé, fixer l'adresse publique avec la variable d'environnement `PUBLIC_BASE_URL`
(par exemple `PUBLIC_BASE_URL=https://facture.exemple.fr`) : elle remplace l'adresse détectée dans le QR code.

La caméra *dans le navigateur* (page `/scan`) n'est disponible qu'en HTTPS ou sur `localhost` ; sur un téléphone en
`http://192.168…`, utiliser l'appareil photo du téléphone, c'est le cas réel de toute façon.

## Où sont les données

- Ventes, factures et journal : en mémoire côté serveur, recopiés dans `.data/store.json` pour survivre à un redémarrage.
- Entreprises retenues et historique des factures reçues : `localStorage` du navigateur qui les a enregistrées (donc du téléphone du client).
- La progression des statuts de facture (transmise, déposée, reçue) est simulée par des minuteries côté serveur.

## Structure

```
src/app/(site)            site vitrine : accueil, blog, mise en page (navigation, pied de page), site.css
src/content               articles du blog, FAQ de l'accueil
src/components/site       navigation, pied de page, formulaire de liste d'attente, ticket du hero, FAQ
src/components/seo        JSON-LD, fil d'Ariane
src/lib/site.ts           identité du site (nom, adresse, contact)
src/lib/seo.ts, jsonld.ts métadonnées des pages, schémas schema.org
src/app/api/waitlist      liste d'attente (Resend)
src/app/demo              accueil de la démo
src/app/caisse            écran commerçant
src/app/(client)/…        écrans téléphone (cadre « téléphone » sur grand écran)
src/app/facture/[token]   facture imprimable
src/app/api/…             POST /sales, scan, identify, invoice, events, entreprises, host, reset
src/lib/store.ts          magasin en mémoire + fichier
src/lib/local.ts          entreprises retenues (localStorage)
src/components            écran de caisse, ticket, journal, recherche d'entreprise, QR code
```
