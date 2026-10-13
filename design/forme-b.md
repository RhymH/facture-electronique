# Forme B — Module de facture B2B pour éditeurs de caisse

Document de travail pour lancer le prototype. Issu de la discussion avec Rodin (voir [retours.md](../retours.md)) à partir de la [vision initiale](vision.md).

> Les points marqués **[À VÉRIFIER]** sont des hypothèses réglementaires ou de marché qui n'ont pas encore été confirmées par un expert-comptable ou par la documentation officielle. Ne pas les traiter comme acquis.

---

## 1. La thèse en une phrase

On ne vend pas aux commerçants. On vend aux **éditeurs de logiciels de caisse** un module prêt à intégrer, en marque blanche, qui permet à un client professionnel d'obtenir sa facture électronique en scannant un QR code sur son ticket, et qui **marque la vente comme B2B dans la caisse** pour qu'elle ne soit pas déclarée deux fois.

## 2. Pourquoi cette forme plutôt que l'app pour commerçants

| | App commerçant (forme A) | Module éditeur (forme B) |
|---|---|---|
| Client | Des milliers de commerçants réfractaires | Des dizaines, voire centaines, d'éditeurs |
| Acquisition | Porte-à-porte, coût élevé | Rendez-vous techniques, coût faible |
| Prix de référence | Quelques dizaines d'€ par an (précédent italien) | Licence ou prix par transaction, à définir |
| Double comptage | Non résolu (l'outil vit à côté de la caisse) | Résolu à la source (la caisse sait que la vente est B2B) |
| Dépendance à l'OCR | Oui | Non |

Ce qui a été écarté :
- **L'OCR** : il ne sert qu'à rattraper les caisses sans API, un segment qui rétrécit. Hors périmètre.
- **Le modèle italien** (le client montre son QR, le commerçant scanne) : il faut un standard national et un réseau. Notre flux est l'inverse : le commerçant affiche, le client scanne. Ça marche dès le premier commerçant équipé.

## 3. Cadre réglementaire à connaître

- **Calendrier** :
  - depuis le 1er septembre 2026, toutes les entreprises doivent pouvoir **recevoir** des factures électroniques ;
  - au 1er septembre 2027, les PME, TPE et micro-entreprises doivent **émettre**, et c'est aussi la date de l'**e-reporting** pour elles. **[À VÉRIFIER : absence de nouveau report]**
- **Plateformes agréées (PA)** : seules elles transmettent les factures. Notre module joue le rôle d'opérateur de dématérialisation : il prépare la facture et la remet à une PA par API.
- **Annuaire central** : il relie un SIREN à la PA du destinataire. Le client n'a donc qu'à fournir son SIREN. **[À VÉRIFIER : qui peut interroger l'annuaire, et par quelle API]**
- **Formats acceptés** : Factur-X, UBL et CII. Pour le prototype, on vise Factur-X avec le profil EN 16931.
- **Nouvelles mentions obligatoires** : SIREN du client, adresse de livraison si elle diffère, catégorie d'opération (biens, services ou mixte), option pour le paiement de la TVA d'après les débits. **[À VÉRIFIER : liste exacte et cas des factures simplifiées de moins de 150 € HT]**
- **E-reporting B2C** : les ventes aux particuliers sont transmises sous forme agrégée (par jour et par taux de TVA). Une vente qui a donné lieu à une facture B2B **ne doit pas** y figurer aussi. **[À VÉRIFIER avec un expert-comptable : c'est le point central du produit]**

## 4. Périmètre du prototype

Objectif : une **démo** à montrer pendant les appels aux éditeurs. Ce n'est pas un produit. Durée visée : 2 à 3 semaines au maximum.

### 4.1 Le parcours

```
Caisse (éditeur)           Notre module                   Client pro (téléphone)
      |                         |                                  |
      |-- POST /sales --------->|                                  |
      |<-- token + URL QR ------|                                  |
      |   (imprimé sur ticket)  |                                  |
      |                         |<-------- scan du QR -------------|
      |                         |-- page : résumé du ticket ------>|
      |                         |<-- SIREN (autocomplétion) -------|
      |                         |-- génère Factur-X                |
      |                         |-- transmet à la PA (sandbox)     |
      |<-- webhook              |                                  |
      |   sale.invoiced_b2b     |-- confirmation + PDF ----------->|
      |   (retirer de l'e-rep.) |                                  |
```

### 4.2 Les briques

1. **API côté éditeur**
   - `POST /sales` : SIREN du commerçant, lignes du ticket (désignation, quantité, prix, taux de TVA) et totaux par taux. Renvoie un jeton et l'URL du QR code.
   - Webhook `sale.invoiced_b2b` : signale à la caisse que la vente sort du périmètre B2C.
   - Webhook `invoice.status` : déposée, rejetée, acceptée.
   - Contrôles à la réception : la somme des lignes doit égaler le total, et chaque ventilation par taux doit être cohérente. On rejette tout de suite si ce n'est pas le cas.
2. **Page web mobile côté client** (sans application à installer)
   - Résumé du ticket.
   - Saisie du SIREN, avec autocomplétion par nom via l'[API Recherche d'entreprises](https://recherche-entreprises.api.gouv.fr) (publique et gratuite).
   - Champs complémentaires seulement si nécessaires (adresse de livraison, par exemple).
   - Objectif : terminé en moins de 15 secondes.
3. **Génération de la facture** : Factur-X, profil EN 16931, c'est-à-dire un PDF/A-3 qui embarque le XML CII.
4. **Connecteur PA** : une interface abstraite, avec **une seule** PA en sandbox pour le prototype. La neutralité vis-à-vis des plateformes fait partie de l'argument de vente : l'architecture doit permettre d'en ajouter d'autres.
5. **Simulateur de caisse** : une page qui joue le rôle de la caisse (création d'une vente, affichage du QR, réception des webhooks), pour faire la démo sans vrai éditeur.

### 4.3 Hors périmètre

OCR, e-reporting lui-même, application pour le commerçant, facturation et paiement de notre service, multi-PA, avoirs.

## 5. Questions de conception à trancher

- **Numérotation des factures** : elle doit être chronologique et continue chez le commerçant. Qui la porte, la caisse ou notre module ? **[À VÉRIFIER]**
- **Délai de scan** : que se passe-t-il si le client scanne après que la vente a été e-reportée ? Faut-il une rectification ou une fenêtre de validité du QR code ? **[À VÉRIFIER avec un expert-comptable]**
- **Ticket et facture** : le ticket reste-t-il valable comme justificatif à côté de la facture, ou faut-il l'annuler ou le référencer ? **[À VÉRIFIER]**
- **Accès aux PA** : les offres gratuites des plateformes donnent-elles accès à une API, et avec quel mandat du commerçant ?
- **Modèle de prix** : licence annuelle par éditeur, prix par facture, ou part sur le volume ? À tester pendant les appels, pas à décider maintenant.

## 6. Validation, à mener en parallèle du prototype

Le prototype sert les appels, il ne les remplace pas.

### 6.1 Cinq appels à de **petits** éditeurs de caisse

Les gros éditeurs ont des équipes entières sur le sujet et ne sont pas notre cible. Questions à poser :

1. « Comment comptez-vous gérer la facture B2B avant septembre 2027 ? »
2. « C'est en production, ou c'est prévu ? Pour quand ? »
3. « Comment marquez-vous une vente qui a fait l'objet d'une facture B2B, pour qu'elle ne parte pas aussi dans l'e-reporting ? » ← **la question qui révèle tout**
4. « Comment le client professionnel vous transmet-il son SIREN au comptoir ? »

Ne pas se contenter d'un « c'est réglé » : un éditeur le dira presque toujours, par fierté ou par posture commerciale. Si la réponse à la question 3 est floue, ce n'est pas réglé.

### 6.2 Une heure avec un expert-comptable

Sujets : le double comptage, le délai de scan, la numérotation, et le statut du ticket face à la facture.

### 6.3 Critères d'abandon, à fixer AVANT les appels

- Si les 5 éditeurs disent « c'est réglé » **et** répondent de façon solide à la question 3 → la forme B est abandonnée.
- Si au moins 2 éditeurs sur 5 hésitent ou montrent de l'intérêt → on continue.
- Le chiffre de continuation ou d'arrêt à un an : **à définir à deux**, en euros ou en nombre d'éditeurs signés.

> Attention : un « c'est réglé » chez les éditeurs tue la forme B, **pas** les autres formes. Il ne dit rien des caisses sans éditeur actif, qui relèvent de la forme C (photo du ticket Z, QR code et e-reporting réconcilié). Celle-ci se teste autrement : test du magicien d'Oz en boutique et avis d'un expert-comptable.

## 7. Risques principaux

1. **Les PA vont directement chez les éditeurs** avec leurs propres kits d'intégration, et nous devenons un intermédiaire inutile. Défenses : intégrer plus vite que la PA, rester neutre entre plateformes, et maîtriser la réconciliation entre e-reporting et facture B2B mieux que quiconque.
2. **Les éditeurs le développent eux-mêmes**, puisqu'ils doivent de toute façon se brancher à une PA pour l'e-reporting.
3. **La fenêtre se referme** : la valeur du produit tient à l'écart entre ce qui existe chez les grandes enseignes et ce qui arrivera chez les petits. Au-delà de septembre 2027, l'argument de l'urgence disparaît.
4. **Un report réglementaire** du calendrier supprimerait cette urgence.

## 8. Prochaines étapes

- [ ] Fixer ensemble les critères d'abandon et le chiffre à un an
- [ ] Lister 10 à 15 petits éditeurs de caisse certifiés et en contacter 5
- [ ] Prendre rendez-vous avec un expert-comptable
- [ ] Choisir une PA qui propose une sandbox et une API documentée
- [ ] Prototype : simulateur de caisse, `POST /sales`, QR code, page mobile avec SIREN, Factur-X, envoi à la PA en sandbox, webhook
