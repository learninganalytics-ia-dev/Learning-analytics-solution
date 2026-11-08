# KIT-001 — première chaîne analytics de bout en bout

Statut : proposition de réalisation dans le périmètre confirmé par le dirigeant. Public, domaine métier et publication finale restent à valider.

## Résultat visé

Permettre à un apprenant de relier données préparées, définitions métier, contexte, agent analytics et dashboard sur un même exemple. Le format CSV est un point d'entrée pédagogique ; il ne limite pas le périmètre de Learning Analytics Solution.

## Livrables proposés

1. Analytics engineering : import CSV, dictionnaire, transformations et tests de qualité.
2. Semantic layer : métriques et dimensions documentées avec calculs de référence.
3. Context layer : glossaire, sources, règles métier et limites temporelles.
4. Agent analytics : cinq questions de référence, outils de calcul et réponses sourcées.
5. Artefact : dashboard et rapport utilisant les mêmes métriques, filtres et sources.
6. Formation : tutoriel, exercice autonome, corrigé et grille d'évaluation.

## Extensions distinctes

- KIT-ACP : exploration par ACP, variance expliquée, contributions et projections.
- KIT-CLUSTER : segmentation, profils de groupes, diagnostics et stabilité.
- Projet transversal : comparer une segmentation avec et sans réduction de dimension, en explicitant les limites.

Ces extensions peuvent être utilisées indépendamment de la partie générative.

## Acceptation

- Les cinq questions ont des résultats attendus calculés indépendamment.
- Les KPI affichés dans le dashboard concordent avec les définitions et les calculs.
- Chaque réponse indique sources, filtres et limites utiles.
- Les erreurs de fichier vide, colonne absente et valeur invalide sont traitées.
- Les étapes peuvent être reproduites à partir des commandes et prérequis documentés.
- Aucun résultat ACP ou clustering n'est présenté comme une relation causale.

## Décisions ouvertes

Public, domaine, KPI, rôle du LLM, ordre détaillé, technologies, licence et budget. Voir [le périmètre global](product-scope.md).

## Deux livraisons cohérentes

Le kit doit fournir une formation permettant de construire son agent et un agent produit prêt à utiliser sur le cas d'usage annoncé. Les deux reposent sur les mêmes briques. Le domaine de démonstration est un exemple ; les éléments métier sont isolés dans une configuration afin de permettre d'autres adaptations. Le démarrage produit ne doit pas exiger de coder l'agent. Voir [le modèle d'offre](offer-model.md).
