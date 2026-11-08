# Learning Analytics Solution

Construisez votre agent analytics grâce à la formation, ou utilisez les outils disponibles pour explorer vos données.

## Plateforme initiale

- Accueil avec le logo Learning Analytics fourni par le dirigeant.
- Six modules d'introduction : analytics engineering, semantic layer, context layer, agents, artefacts/dashboarding, ACP et clustering.
- Exercices et corrigés, filtres du catalogue et progression locale déclarative.
- Laboratoire CSV : ACP, K-means, graphiques, profils de groupes et exports JSON.
- Assistant descriptif local : comptage, somme et moyenne ; aucun modèle génératif appelé.
- Configuration et export d'un profil d'agent ; ce profil ne déploie pas un agent génératif.

## Exécuter

Node.js 22+ ; aucune dépendance externe.

```sh
npm test
npm run build
npm run dev
```

Aperçu local : http://127.0.0.1:4173. Sortie de build : dist/.

## Déployer depuis GitHub vers Vercel

Le dépôt est learninganalytics-ia-dev/Learning-analytics-solution. Importer ce dépôt dans l'équipe Vercel Learning Analytics. Framework : Other ; racine : dépôt ; commande : npm run build ; sortie : dist. La configuration vercel.json est versionnée. Aucun secret n'est requis pour cette première version.

Les commits du dépôt peuvent déclencher Vercel une fois l'intégration GitHub reliée au projet. Le simple push GitHub ne crée pas un projet Vercel.

## Limites et suite

Cette version n'inclut ni comptes utilisateurs, ni paiement, ni progression synchronisée, ni agent génératif déployé. Les données CSV sont traitées dans le navigateur ; les profils et la progression restent sur l'appareil. Supabase n'est pas encore utilisé.

Voir [les fonctions et limites de la plateforme](docs/platform-v1.md), [le périmètre](docs/product-scope.md), [l'offre](docs/offer-model.md), [le premier kit](docs/first-kit.md) et [les règles de contribution](CONTRIBUTING.md).
