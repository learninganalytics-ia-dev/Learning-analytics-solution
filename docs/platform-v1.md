# Plateforme initiale — 8 novembre 2026

## Fonctions livrées

- Identité Learning Analytics issue des six SVG fournis par le dirigeant dans LA-logo.zip. Originaux conservés sous assets/brand/.
- Accueil, catalogue filtrable et six modules pédagogiques d'introduction avec exercices et corrigés.
- Progression et profil d'agent sauvegardés localement ; aucune authentification ni synchronisation multi-appareil.
- Import CSV local : virgule/point-virgule, guillemets, 2 Mo et 1 000 lignes maximum, 2 à 12 variables numériques sélectionnées pour ACP/clustering.
- ACP centrée, standardisation optionnelle, variance expliquée, projections et contributions.
- K-means avec trois initialisations déterministes, centres, effectifs, inertie et export.
- Assistant descriptif à règles explicites pour comptage, somme et moyenne ; aucun LLM appelé.
- Configurateur et export du profil de l'agent. Il ne déploie pas un agent génératif.

## Exécution

Node.js 22+ ; aucune dépendance externe. npm test ; npm run build ; npm run dev. Le serveur local écoute sur 127.0.0.1:4173. dist/ est généré et exclu de Git. Les sources et vercel.json sont versionnés.

## Hébergement Vercel

Importer le dépôt learninganalytics-ia-dev/Learning-analytics-solution. Racine : dépôt. Framework : Other. Build : npm run build. Sortie : dist. Aucun secret ni variable d'environnement requis pour cette version. Conserver les protections d'accès existantes lors de la mise en place.

Configuration : https://vercel.com/docs/project-configuration/vercel-json

## Méthodes et limites

Implémentations JavaScript pédagogiques indépendantes de scikit-learn. Vérification par matrices de référence, invariants de projection et séparation de groupes connus. Elles ne remplacent pas une validation numérique approfondie pour un usage scientifique ou décisionnel exigeant.

Références : https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html et https://scikit-learn.org/stable/modules/clustering.html#k-means

## Suite

Comptes et progression côté serveur, catalogue administrable, exercices exécutables, outils complets par couche, agent génératif et connecteurs autorisés, diagnostics ML approfondis. Supabase n'est pas encore utilisé et aucun achat ni appel API payant n'est nécessaire.

## Vérification et chemin de livraison

Cinq tests numériques passent et le build termine sans dépendance externe. Interface vérifiée dans le navigateur : accueil mobile, filtres du catalogue, ouverture de cours et corrigé, ACP, K-means, réponse descriptive et aperçu dynamique du profil. Une règle CSS a été corrigée pour respecter les contrôles masqués. Le rendu desktop large n'a pas pu être vérifié dans le panneau de prévisualisation disponible.

Livraison demandée via GitHub puis intégration Vercel. La connexion Vercel permet la lecture de l'équipe learning-analytics-solution ; une création directe de projet a été refusée avec 403. Le déploiement n'est pas considéré comme réalisé sans retour de succès et URL vérifiée.
