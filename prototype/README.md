# Forme B — prototype de démonstration

Maquette fonctionnelle du parcours décrit dans [design/forme-b.md](../design/forme-b.md) : un client professionnel
obtient sa facture électronique en scannant le QR code imprimé sur son ticket de caisse, et la caisse est prévenue
que la vente sort de l'e-reporting B2C.

Ce n'est pas un produit : aucune base de données, aucune vraie plateforme agréée. Tout tourne sur la machine qui
lance le serveur.

## Lancer

```bash
npm install
npm run dev
```

Puis ouvrir <http://localhost:3000>.

## Les écrans

| Adresse | Rôle |
| --- | --- |
| `/` | Page d'accueil de la démo, avec les deux entrées ci-dessous |
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
src/app/caisse            écran commerçant
src/app/(client)/…        écrans téléphone (cadre « téléphone » sur grand écran)
src/app/facture/[token]   facture imprimable
src/app/api/…             POST /sales, scan, identify, invoice, events, entreprises, host, reset
src/lib/store.ts          magasin en mémoire + fichier
src/lib/local.ts          entreprises retenues (localStorage)
src/components            écran de caisse, ticket, journal, recherche d'entreprise, QR code
```
