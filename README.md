# Learning Analytics Solution — Driver Tree global

Construire son agent analytics, puis utiliser le même arbre pour produire un diagnostic du chiffre d’affaires vérifiable.

**CA = Trafic × TT × IV × Prix brut moyen × (1 − taux de démarque commerciale)**

Une seule offre : méthode, cours de construction, outil guidé et rapport global exportable. Exemple synthétique, calculs locaux sans appel modèle payant. Aucun sous-outil ou agent autonome par branche.

## Démarrer

Node.js 24 : `npm ci`, `npm test`, `npm run build`, puis `npm run dev` pour servir dist. Routes : #accueil, #methode, #cours, #outil. Les anciens liens de parcours/outils renvoient vers le périmètre global. Le site est publié par l’intégration GitHub → Vercel.

[Mode d’emploi et limites](docs/driver-tree.md). [Exemple JSON à importer](examples/driver-tree/exemple.json).

Les comptes et historiques précédemment enregistrés restent accessibles via #compte ; Driver Tree n’enregistre pas automatiquement ses rapports dans le cloud. Aucune migration de base n’est requise pour cette version. Les documents et exemples historiques du dépôt ne constituent pas un catalogue de fonctionnalités actuelles du site.
