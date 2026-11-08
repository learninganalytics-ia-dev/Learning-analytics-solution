# Périmètre de Learning Analytics Solution

Orientation du dirigeant confirmée le 8 novembre 2026 : couvrir les couches d'un système d'agents analytics et des outils fondés sur les méthodes de machine learning, notamment ACP et clustering.

## Architecture pédagogique et fonctionnelle

| Domaine | Fonction | Outils et exemples à construire | Résultat pédagogique |
|---|---|---|---|
| Analytics engineering | Préparer des données fiables | Import, transformations, modèles, tests de qualité et traçabilité | Construire une chaîne de données reproductible |
| Semantic layer | Donner une définition commune aux chiffres | Catalogue des métriques, dimensions, relations, unités, périodes et règles d'agrégation | Produire des KPI cohérents entre analyses |
| Context layer | Fournir le contexte utile à une tâche | Glossaire métier, documentation, provenance, contexte temporel et sélection des sources autorisées | Donner à l'agent des informations pertinentes et traçables |
| Agents analytics | Relier une question aux outils d'analyse | Planification, requêtes, calculs, vérification et réponse sourcée | Construire un agent dont on peut mesurer la fiabilité |
| Artefacts IA et dashboarding | Restituer et explorer les résultats | Tableaux de bord, rapports, graphiques et applications interactives | Transformer une analyse en livrable utile et vérifiable |
| Machine learning appliqué | Explorer les structures des données | Outils ACP et clustering, diagnostics et interprétation | Choisir et évaluer une méthode sans surinterpréter ses résultats |

Ces domaines constituent une chaîne interopérable. Le machine learning est une capacité d'analyse transversale ; il n'est pas obligatoire pour chaque question ni pour chaque agent.

## Contrats entre couches

1. Données préparées : schéma, granularité, clés, périodes, contrôles et provenance.
2. Sémantique : identifiants de métriques, formules, dimensions compatibles, unités et règles de calcul.
3. Contexte : sources sélectionnées, date de validité, périmètre métier et restrictions d'accès.
4. Exécution agent : question, sources utilisées, outils appelés, résultats calculés, incertitudes et limites.
5. Artefact : résultats, filtres, définitions, sources, actualisation et conditions de reproduction.

Les autorisations doivent être appliquées aux outils et aux données par le système d'exécution. Une consigne ou une sélection de contexte ne remplace pas un contrôle d'accès.

## ACP — analyse en composantes principales

Outil attendu : sélectionner les variables numériques, contrôler les valeurs manquantes, proposer un prétraitement explicite, produire composantes, variance expliquée, contributions et projections, puis guider l'interprétation.

Points de contrôle : documenter le centrage et la mise à l'échelle, conserver les paramètres de transformation, distinguer observations et variables, et ne pas interpréter les axes comme des causes. Le choix du nombre de composantes doit être expliqué. Une projection 2D ne résume pas nécessairement toute l'information utile.

Livrables : module réutilisable, exemple synthétique, visualisation, tutoriel, exercice, corrigé et contrôles de cohérence.

## Clustering

Outil attendu : préparer les variables, comparer des segmentations adaptées au problème, explorer les groupes et leur stabilité, documenter les paramètres et produire des profils de groupes.

Points de contrôle : justifier les variables, la mise à l'échelle et la mesure de proximité ; expliquer le choix du nombre de groupes lorsque la méthode l'exige ; examiner stabilité, groupes très petits et observations atypiques. Les indices internes ne prouvent pas à eux seuls une pertinence métier. Un cluster n'est ni une vérité terrain ni une catégorie causale.

L'ACP peut précéder un clustering lorsque cela est justifié, mais les deux méthodes doivent aussi être proposées séparément. Mesurer les conséquences de la réduction de dimension sur la segmentation.

## Format commun d'un module

Chaque domaine associe un outil réutilisable, un exemple reproductible, des supports de formation, un exercice corrigé et une évaluation. Décrire les prérequis, entrées, sorties, versions, commandes, résultats attendus et limites.

## Ordre de construction proposé

1. Un même jeu de données synthétiques et une chaîne minimale traversant préparation, sémantique, contexte, agent et dashboard.
2. Un module ACP indépendant réutilisant les données préparées.
3. Un module clustering indépendant, puis une comparaison avec et sans ACP.
4. Des parcours de formation par couche et un projet final qui relie les modules.

Le périmètre global est demandé par le dirigeant. Cet ordre de réalisation est une proposition ; les outils et cours ne sont pas encore implémentés.
