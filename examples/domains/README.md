# Deux adaptations synthétiques du même agent

Ces fichiers sont entièrement fictifs. Ils illustrent la réutilisation du socle, pas une validation sectorielle.

- Énergie : une ligne par site ; somme de consommation_kwh attendue = 1 860, moyenne = 155.
- Formation : une ligne par activité ; somme de sessions attendue = 90, moyenne = 7,5.

Télécharger le starter, puis :
```sh
node agent-local.mjs --csv energie.csv --question "Moyenne de consommation_kwh"
node agent-local.mjs --csv formation.csv --question "Somme de sessions"
```

Renseigner dans le profil le domaine, la granularité, les unités et les limites. Les données sont volontairement simples et corrélées pour vérifier les calculs. Elles ne doivent pas servir à conclure sur de vrais sites ou apprenants.
