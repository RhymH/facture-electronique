/** Questions de la page d'accueil. Affichées en accordéon ET en JSON-LD FAQPage. */
export const HOME_FAQ: { q: string; a: string }[] = [
  {
    q: "Qu'est-ce que ça change pour nos clients commerçants au comptoir ?",
    a: "Rien de plus à taper. Le ticket sort avec un QR code en bas, comme aujourd'hui. Si le client est un professionnel, il scanne, saisit son SIREN, et reçoit sa facture électronique. Le caissier n'a ni SIREN à demander ni mention à remplir.",
  },
  {
    q: "Pourquoi un éditeur de caisse ne le ferait-il pas lui-même ?",
    a: "Il le peut. Il faut écrire le Factur-X, se brancher à une ou plusieurs plateformes agréées, interroger l'annuaire, faire une page mobile qui tient en quinze secondes et gérer la sortie de la vente de l'e-reporting B2C. Factick fournit tout ça derrière deux appels d'API et un webhook, pour que votre équipe garde son temps pour la caisse.",
  },
  {
    q: "Comment la vente évite-t-elle d'être déclarée deux fois ?",
    a: "Quand la facture B2B est émise, le module envoie un webhook à la caisse pour marquer la vente comme facturée B2B. Elle est alors retirée de l'agrégat B2C destiné à l'e-reporting. Le rapprochement se fait à la source, dans la caisse, pas dans un outil à côté.",
  },
  {
    q: "Avec quelles plateformes agréées est-ce compatible ?",
    a: "Le module est neutre : il prépare la facture et la dépose sur la plateforme choisie par le commerçant, puis l'annuaire achemine vers celle du client. Nous démarrons avec une plateforme en sandbox et ajoutons les autres à la demande des éditeurs.",
  },
  {
    q: "Le client doit-il installer une application ?",
    a: "Non. Le QR code ouvre une page web mobile. L'appareil photo du téléphone suffit. L'entreprise choisie est retenue sur le téléphone pour la prochaine fois.",
  },
  {
    q: "C'est en marque blanche ?",
    a: "Oui. La page que le client ouvre porte votre nom et vos couleurs, ou ceux du commerçant. Vos clients ne voient jamais Factick.",
  },
  {
    q: "Quel est le modèle de prix ?",
    a: "Il n'est pas figé. Nous discutons avec les premiers éditeurs d'une licence annuelle ou d'un prix par facture émise. Les intégrations pilotes sont gratuites.",
  },
];
