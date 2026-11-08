# Construire puis utiliser son agent local

Ce starter utilise les mêmes outils que la plateforme. Il fonctionne sans modèle génératif ni clé API.

## Depuis ce dépôt

Node.js 22+ :

```sh
node examples/agent-starter/agent.mjs --question "Moyenne de valeur"
node examples/agent-starter/agent.mjs --csv donnees.csv --profile mon-agent.json --question "Crée 3 groupes"
```

Le profil est exporté depuis Mon agent dans la plateforme. Les données et le profil sont lus sur votre ordinateur, sans transfert réseau. Le résultat JSON contient les outils appelés et les calculs.

## Depuis le téléchargement de la plateforme

Le build produit un fichier autonome downloads/agent-local.mjs. Téléchargez-le et exécutez :

```sh
node agent-local.mjs --question "Lance une ACP"
```

## Exercice de construction

1. Définissez granularité, unités et contrôles de votre CSV.
2. Nommez les métriques et calculez manuellement cinq résultats attendus.
3. Exportez un profil et exécutez le starter.
4. Examinez describeDataset, statistic et exploration dans web/agent-core.mjs.
5. Ajoutez une nouvelle métrique déterministe avec ses cas de test.
6. Adaptez le même outil à un second domaine et documentez ses limites.

Le mode local ne comprend pas toutes les formulations naturelles. Les filtres et demandes hors périmètre sont refusés ; ils ne sont pas ignorés silencieusement. Une configuration JSON ne crée pas une intégration LLM.
