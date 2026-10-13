Je reformule pour vérifier que j'ai bien compris. Ta thèse :

Les petits commerçants qui ont des caisses anciennes vont devoir émettre des factures électroniques pour leurs clients professionnels. Ça les embête, et ça embête aussi leurs clients. Une app pourrait servir d'intermédiaire. Le commerçant photographie son ticket, l'OCR en tire les données, un QR code s'affiche. Le client le scanne, renseigne son entreprise, et une plateforme agréée lui envoie la facture. Le marché est petit, les marges faibles, la concurrence probable. Tu penses que les chiffres sont contre toi.

Ta conclusion finale n'est sans doute pas fausse. Mais tu y arrives en partie pour de mauvaises raisons, et tu passes à côté de trois problèmes plus graves que ceux que tu as listés. On reprend dans l'ordre.

1. Le constat de départ
   ✗ Faux : « ça leur crée beaucoup de papier à gérer ». La facture électronique, c'est justement moins de papier. Ce qui coûte au commerçant, c'est la saisie, au comptoir, avec une file d'attente derrière. Il doit récupérer le SIREN du client et remplir des mentions qu'il ne connaît pas. Ce n'est pas un détail de vocabulaire. Si tu crois que le problème est le papier, tu vas construire un outil de dématérialisation. Si le problème est la saisie au comptoir, tu dois construire un outil qui supprime de la frappe. Ce sont deux produits différents.

◐ Angle mort : qui ressent vraiment la douleur ? Pas le commerçant, en tout cas pas d'abord. C'est le client professionnel, par exemple l'artisan qui achète ses vis à la quincaillerie : sans facture conforme, il ne déduit pas sa TVA. Le commerçant, lui, ne souffre que s'il perd ce client. Ça change tout pour ton acquisition et pour savoir qui paie. Tu vends à quelqu'un dont le problème est en réalité celui d'un autre.

⚡ Simplification : « l'effort du client pour donner ses informations ». Depuis le 1er septembre 2026, toute entreprise doit pouvoir recevoir des factures électroniques via une plateforme agréée. Un annuaire central relie chaque SIREN à sa plateforme. Le client n'a donc plus rien à « saisir » au sens où tu l'imagines : son SIREN suffit pour acheminer la facture. Et l'API publique de recherche d'entreprises le retrouve à partir du nom en trois lettres. Ton parcours client fait dix secondes, pas deux minutes. C'est une bonne nouvelle pour ton UX. C'en est une mauvaise pour ta proposition de valeur, parce que le problème est plus petit que tu ne le crois.

2. Le segment « vieilles caisses »
   ~ Contestable : « ceux qui ont une caisse récente ont sûrement déjà la facturation électronique ». Pas forcément aujourd'hui. Mais ils l'auront avant l'échéance qui te concerne, et pour une raison que tu ne cites pas : l'e-reporting. Les ventes aux particuliers devront elles aussi être transmises à l'administration, selon le même calendrier : septembre 2027 pour les TPE et PME. Les éditeurs de caisse n'ont pas le choix, ils doivent se brancher sur une plateforme agréée. Une fois ce tuyau en place, ajouter « facture B2B avec SIREN client » leur coûte presque rien.

◐ Angle mort : ton segment rétrécit. Depuis la loi anti-fraude TVA de 2018, les logiciels de caisse doivent être certifiés, et l'étau s'est resserré depuis. Ta cible, ce sont les commerçants qui ont résisté à cette vague. Ce sont précisément les moins enclins à adopter un nouvel outil et à payer un abonnement. Geoffrey Moore appellerait ça vendre aux laggards : ils achètent en dernier, au prix le plus bas, et seulement sous la contrainte. Tu as choisi la fraction du marché qui cumule « disparaît chaque année » et « déteste la nouveauté ».

◐ Angle mort, le plus grave à mon avis : le double comptage. Fais vérifier ce point par un expert-comptable avant d'écrire une ligne de code. La vente passe en caisse : elle est enregistrée et, à partir de 2027, elle part dans l'e-reporting comme vente au détail. Ensuite tu émets une facture électronique B2B pour la même opération. L'administration reçoit alors la transaction deux fois, une fois par chaque canal. Si ton outil ne gère pas ce rapprochement, tu ne simplifies pas la vie du commerçant. Tu lui fabriques une incohérence déclarative, et c'est lui qui en répondra en cas de contrôle. Un outil qui vit à côté de la caisse a structurellement ce problème. Un outil dans la caisse ne l'a pas. C'est un argument massif en faveur de tes concurrents.

3. L'OCR
   ⚡ Simplification : « l'OCR doit être impeccable ». Non. Il doit être vérifiable, ce qui est beaucoup plus facile. Un ticket est un objet très contraint : la somme des lignes doit égaler le total, et le détail par taux de TVA doit être cohérent. Tu peux donc détecter toi-même tes erreurs, sans viser 100 % de fiabilité. Tu vises « je sais quand je me suis trompé ». Dans ce cas, le commerçant corrige un chiffre, et il reste en charge de valider ce qu'il émet. Les modèles de vision actuels lisent un ticket pour une fraction de centime.

D'où un deuxième point : ✗ Faux, le coût de l'OCR n'est pas ce qui tue ta marge. Ton coût marginal par facture est presque nul. Ce qui tue ta marge, c'est le coût d'acquisition. Il faut convaincre, un par un, des commerçants réfractaires, souvent sur place, pour un abonnement à quelques euros par mois. Tu as mal identifié ton poste de coût.

4. Le QR code
   ✓ Juste, et c'est la meilleure idée de ton document. Tu fais saisir la donnée par celui qui la connaît (le client connaît son entreprise) et qui a intérêt à ce qu'elle soit juste (c'est lui qui déduit la TVA). Le commerçant n'a plus qu'un geste à faire. C'est de la bonne conception : tu supprimes le travail au lieu de l'automatiquer.

Il existe un précédent historique, et il est instructif. L'Italie a généralisé la facture électronique B2B dès 2019, petits commerçants compris. L'administration fiscale italienne a très vite fourni aux entreprises un QR code contenant leurs données de facturation, à présenter au commerçant au moment de l'achat : à la station-service, au comptoir. Le flux était donc inversé par rapport au tien. Le client montre, le commerçant scanne. Et c'est l'État qui l'a fourni gratuitement. Côté prix, le marché italien s'est banalisé en quelques mois : des acteurs grand public proposaient l'émission pour quelques dizaines d'euros par an. C'est ton prix de référence. Pas un abonnement mensuel.

À noter aussi : ton QR code n'a pas besoin de l'OCR. Le QR client, c'est ta vraie idée. L'OCR n'est qu'un moyen de rattraper les caisses sans API. Tu as fusionné deux paris. L'un est élégant et peu coûteux à tester. L'autre est fragile et vise un marché qui fond.

5. La concurrence
   ⚡ Simplification : tu crains « d'autres gens qui ont eu la même idée ». Ce ne sont pas eux tes vrais concurrents. Par ordre de dangerosité :

La plateforme agréée que le commerçant a déjà. Depuis septembre 2026, il doit pouvoir recevoir des factures, donc il est déjà inscrit quelque part : souvent via sa banque ou son expert-comptable. Cette plateforme lui proposera l'émission gratuitement, parce que c'est un produit d'appel. Quand tu arrives, l'outil concurrent est déjà dans sa poche.
L'éditeur de caisse, pour les raisons vues plus haut.
L'expert-comptable, qui prescrit l'outil et qui détestera un intermédiaire de plus dans la chaîne.
Le statu quo. « Je vous fais ça à la main ce soir dans l'outil gratuit de la banque. » Ou : « Désolé, pas de facture ici. » C'est illégal, mais on est chez des petits commerçants. 6. La position adverse, dans sa forme la plus forte
Puisque tu te prépares déjà à abandonner, voilà la meilleure version de l'argument pour, que tu n'as pas formulée.

Ne vends pas aux commerçants. Deviens le canal d'acquisition d'une plateforme agréée. Ces plateformes se battent en ce moment pour recruter des TPE en volume. Toi, tu apportes des commerçants déjà actifs, qui émettent des factures. Tu te fais payer à la commission ou à l'affiliation, par la plateforme, pas par le commerçant. L'app devient alors gratuite pour l'utilisateur final, ce qui règle ton problème de prix. Et ton marché n'est plus « 3 000 quincailleries récalcitrantes », mais un ou deux partenaires B2B à convaincre.

Ce n'est pas forcément la bonne réponse. Mais c'est le modèle à réfuter avant de dire que les chiffres sont contre toi. Car aujourd'hui, ce sont les chiffres d'un modèle (abonnement payé par le commerçant) qui sont contre toi, pas ceux du problème.

Ordre de grandeur pour ce modèle par abonnement, tel que tu l'as posé implicitement. Deux personnes qui veulent se verser un revenu modeste, c'est au bas mot 8 à 10 k€ de chiffre d'affaires mensuel. À 5 € par mois, il te faut environ 2 000 commerçants payants. Il faut donc trouver 2 000 propriétaires de vieilles caisses, ayant une clientèle B2B régulière, qui n'ont pas déjà adopté l'outil de leur banque, et qui acceptent de payer. Tu sens bien que le problème n'est pas le prix de l'OCR.

Dernier point, sur le calendrier
L'obligation d'émettre pour les TPE tombe en septembre 2027. Tu as donc onze mois, et pas zéro comme le laisse entendre ton « c'est un sujet majeur cette année ». Ce n'est pas un argument pour foncer. C'est un argument pour aller tester tout de suite, à un coût presque nul, ce qui peut l'être sans rien coder.

Deux questions, et je veux des réponses concrètes, pas des hypothèses :

Cite-moi un commerçant précis, avec un nom et une adresse, qui a une caisse sans API, une vraie clientèle de professionnels, et qui n'a pas encore de plateforme agréée. Si tu n'en trouves pas un, tu sais quelque chose d'important sur la taille de ton segment. Si tu en trouves dix en un après-midi, tu sais aussi quelque chose, et le double comptage devient ta prochaine question.
Si on t'enlevait l'OCR, ton projet existerait-il encore ? Si oui, pourquoi l'OCR est-il dans la vision ? Si non, pourquoi bâtir le projet sur la brique qui vise le marché qui disparaît ?
Et une remarque, sans moralisation. Tu écris « j'ai bien peur que les nombres ne soient pas de notre côté », mais tu n'en as calculé aucun. C'est une intuition déguisée en conclusion. Elle est peut-être juste, mais pour l'instant elle n'est pas démontrée.

(Deux livres en passant. The Mom Test, de Rob Fitzpatrick, environ 130 pages, pour ta première question : apprendre à interroger un commerçant sans qu'il te mente poliment. Et Crossing the Chasm, de Geoffrey Moore, environ 250 pages, pour le problème des laggards. Tu veux que je les ajoute à ta biblio ?)

ok c'est donc la piste du QR code comme l'italie qui est à creuser ? est ce qu'il y a un produit viable pour nous dans tout ca ?
7:30 PM
Rodin.

Non, ce n'est pas ce que j'ai dit. Tu viens de faire en une phrase ce que je te reprochais tout à l'heure : partir d'une intuition et l'énoncer comme une conclusion. J'ai dit que le QR code était la meilleure idée de ton document. Je n'ai pas dit qu'il fallait copier l'Italie, et encore moins qu'il y avait un produit. On reprend.

1. Ne copie pas l'Italie, c'est ton propre flux qui est le bon
   ✗ Faux : « la piste du QR code comme l'Italie ». Ce sont deux flux opposés, et la différence décide de tout.

Le modèle italien, c'est le client qui présente un QR code et le commerçant qui le scanne. Ça suppose que tous les clients professionnels aient ce QR code, et que tous les outils des commerçants sachent le lire. C'est un standard, avec un problème de réseau : l'œuf et la poule. En Italie, ça a marché pour une seule raison : l'État l'a fourni et l'a imposé. Deux personnes n'imposent pas un standard national.
Ton modèle, c'est le commerçant qui affiche un QR code et le client qui le scanne avec un téléphone quelconque. Ça ne demande aucun réseau. Le premier commerçant équipé en tire de la valeur dès le premier jour, même si personne d'autre en France n'utilise ton outil. Pour une startup, c'est une différence vitale.
Et l'État français ne fera pas ce que l'État italien a fait. Fin 2024, il a renoncé à proposer lui-même un outil gratuit de facturation et a laissé ce rôle aux plateformes privées. C'est plutôt une bonne nouvelle pour toi : un concurrent gratuit et universel de moins.

◐ Angle mort : ton flux existe déjà, chez les gros. Regarde les tickets de Leroy Merlin, d'Ikea, des stations-service : on y trouve souvent un QR code ou une URL pour « obtenir votre facture ». Le geste est donc validé : les clients professionnels savent le faire. Mais c'est aussi un signal inquiétant : ce sont des éditeurs de caisse et des intégrateurs qui l'ont construit, et ils peuvent le décliner pour les petits commerçants. Ton espace, c'est l'intervalle entre ce qui existe chez les gros et ce qui arrivera chez les petits. La vraie question est la durée de cet intervalle.

2. Y a-t-il un produit viable ?
   Réponse franche : il y a peut-être un produit, mais aucune preuve qu'il existe. Je vois trois formes possibles, et elles ne se valent pas.

Forme A : l'app vendue directement aux petits commerçants, telle que tu l'as décrite
~ Contestable, et je penche pour non. Tout ce que je t'ai dit tient toujours. Le segment se réduit, les clients sont réfractaires, le coût d'acquisition est élevé, le prix de référence est faible, et le problème du double comptage reste entier. Le QR code n'y change rien : il améliore l'expérience, pas l'économie du modèle.

Forme B : un module en marque blanche pour les éditeurs de caisse
C'est la forme que tu n'as pas envisagée, et la plus sérieuse à mon avis. Les éditeurs de logiciels de caisse certifiés se comptent en France par dizaines, probablement par centaines. Beaucoup sont petits, ont des ressources techniques limitées, et doivent livrer avant septembre 2027 trois choses :

le branchement à une plateforme agréée ;
l'e-reporting des ventes aux particuliers ;
l'émission de factures B2B.
Tu leur vends un module tout prêt : le QR code imprimé sur le ticket, le parcours client avec SIREN et recherche automatique, l'émission via la plateforme, et surtout le marquage de la vente comme B2B dans la caisse. Ce dernier point règle le double comptage à la source : c'est la caisse elle-même qui sait que la vente est sortie du périmètre B2C.

Pour : il y a une échéance légale réelle, donc une douleur datée. Tu as peu de clients, mais chacun pèse lourd. Tu vends à des développeurs qui comprennent ce que tu fais, pas à un boulanger à 6 h du matin. Et ton coût d'acquisition se compte en dizaines de rendez-vous, pas en milliers.
Contre, dans sa forme la plus forte : les plateformes agréées proposent déjà des API et des kits d'intégration, et leur intérêt est de capter directement les éditeurs de caisse. Tu risques d'être un intermédiaire entre deux acteurs qui ont toutes les raisons de se parler sans toi. Ta seule défense, c'est d'être nettement plus rapide à intégrer que la plateforme elle-même. Et d'être neutre : un éditeur qui veut proposer plusieurs plateformes à ses commerçants n'a pas envie de dépendre d'une seule.
Forme C : le pack conformité pour les caisses sans connecteur
Là, je reviens en partie sur ce que je t'ai dit à propos de l'OCR. ◐ Angle mort de ma propre analyse : je l'ai jugé pour les tickets individuels, mais il a peut-être sa place ailleurs. Les commerçants avec une vieille caisse devront aussi faire leur e-reporting en 2027. Or les ventes aux particuliers se déclarent sous forme agrégée : par jour et par taux de TVA, si j'ai bien compris le dispositif (fais-le confirmer). C'est exactement ce que contient le ticket Z, le total de clôture quotidien.

Le produit deviendrait alors : « une photo de ton Z chaque soir, un QR code pour tes clients pros, et tu es en règle. Les ventes B2B sont automatiquement retirées de ton e-reporting. » L'OCR ne lit plus qu'un document par jour, très structuré et facile à vérifier. Et le double comptage est géré par construction : c'est toi qui fais les deux déclarations, donc c'est toi qui les réconcilies.

Pour : c'est la seule forme où l'OCR et le QR code ont tous deux une raison d'exister, et où le segment « vieilles caisses » devient un atout plutôt qu'une faiblesse.
Contre : tu retombes sur le problème de la forme A, des clients réfractaires et peu enclins à payer. Et tu croises un concurrent redoutable : l'expert-comptable, qui saisit déjà les Z de ses clients et le fera dans l'outil de sa propre plateforme. Sauf si c'est lui que tu équipes. Mais c'est une quatrième forme, et je te laisse la creuser. 3. Comment le savoir sans écrire de code
Tu as onze mois avant l'échéance. Ce qui te tuerait, c'est passer six mois à construire avant de savoir. Avant de choisir entre B et C :

Le test du magicien d'Oz. Imprime un QR code qui pointe vers un simple formulaire : SIREN, e-mail, photo du ticket. Pose-le sur le comptoir de trois commerçants qui ont une vraie clientèle de professionnels (quincaillerie, matériaux, garage, restaurant le midi). Pendant trois semaines, c'est vous deux qui émettez les factures à la main, dans l'outil gratuit de leur plateforme. Tu mesureras ce qu'aucune réflexion ne te donnera : combien de clients pros scannent vraiment, et si le commerçant s'en soucie ou s'en fiche.
Cinq appels à des éditeurs de caisse. Une seule question : « Comment comptez-vous gérer la facture B2B et le marquage de la vente avant septembre 2027 ? » S'ils répondent tous « c'est réglé avec notre plateforme », la forme B est morte, et tu l'auras appris en une semaine. Si deux sur cinq hésitent, tu tiens quelque chose.
Une heure avec un expert-comptable, sur le double comptage et l'e-reporting à partir du Z. C'est le point juridique qui fait tomber ou tenir la forme C.
Fixe-toi des critères d'abandon avant de commencer. Par exemple : moins de cinq scans de clients pros par semaine et par commerçant, ou zéro éditeur intéressé. Sinon, tu sais comment ça finit : chaque résultat décevant deviendra « encourageant ».

Deux questions :

Entre B et C, laquelle tu préfères, et laquelle te paraît la plus solide ? Si ce n'est pas la même, demande-toi pourquoi. Avec une équipe de deux, on a vite fait de choisir le produit qu'on aime construire plutôt que celui qu'on peut vendre. La forme C est plus amusante à coder. La forme B se joue au téléphone et dans des rendez-vous. Lequel de vous deux aime ce travail-là ?
Tu as écrit que ça n'avait pas besoin d'être très rentable. Quel chiffre, exactement, vous fait continuer ou arrêter dans un an ? Sans ce chiffre, « pas besoin d'être très rentable » sert d'excuse pour ne jamais trancher.
