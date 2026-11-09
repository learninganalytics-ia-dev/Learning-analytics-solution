# Driver Tree global du chiffre d’affaires

Une seule offre : un cours pour construire son agent analytics et un outil guidé pour appliquer le même arbre.

CA net HT = commandes × panier moyen ; commandes = trafic × TT ; panier = IV × PVM ; PVM = prix brut moyen × (1 − taux de démarque commerciale).

Prix brut moyen = CA brut HT / unités ; démarque commerciale = (CA brut HT − CA net HT) / CA brut HT. Moyennes pondérées, devise unique et périodes comparables. Les pertes physiques de stock ne constituent pas une remise commerciale.

Le formulaire compare deux périodes en local, affiche les neuf nœuds, vérifie les quatre identités et calcule les contributions selon la moyenne des 120 ordres de remplacement. Une valeur absente n’est jamais imputée ; un dénominateur nul rend le ratio indisponible. Les sources sont déclarées, pas vérifiées par l’outil. Les calculs ne démontrent pas une cause.

Exemple synthétique : brut 32 000 et net 30 000 sur 2 000 unités, puis brut 28 800 et net 25 200 sur 1 800 unités. Prix brut moyen 16 stable, taux de démarque 6,25 → 12,50 %. Contribution TT −2 900, part conservée −1 900 ; total −4 800.

Exports : rapport JSON et rapport HTML lisible avec les données, sources, conventions, contrôles et limites. Aucune action commerciale n’est exécutée et les périodes/rapports ne sont pas sauvegardés automatiquement sur le serveur. Le cours et l’outil sont accessibles sans compte. Les comptes et historiques existants restent accessibles séparément.

Les nombres utilisent la précision JavaScript ; les égalités sont contrôlées à une tolérance relative documentée dans driver-core.mjs (identités 1e-9, contributions 1e-8), sans arrondi intermédiaire d’affichage. Les montants d’entrée sont limités au centime, et à 1 000 milliards. Les contextes importés doivent partager les mêmes conventions.

Vérifier : npm test, puis npm run build. Ouvrir #outil et rejouer le cas synthétique, une valeur absente et un export. Les appels de modèle payants restent désactivés ; le mode publié est déterministe, non conversationnel génératif.

Des configurations extrêmes peuvent ne pas se réconcilier avec la précision flottante du navigateur ; le calcul est alors refusé explicitement au lieu de publier des contributions incohérentes. Une donnée monétaire décimale importée doit être fournie comme chaîne pour conserver sa précision lexicale.
