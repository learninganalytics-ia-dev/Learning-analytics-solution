/**
 * Public course for the single global revenue Driver Tree.
 * Static content only: no account, remote request or language model.
 */
export function renderDriverCourse({ main }) {
  if (!main || typeof main.innerHTML !== 'string') {
    throw new TypeError('Un conteneur main est nécessaire pour afficher le cours.');
  }
  main.innerHTML = `
    <section class="page-head" aria-labelledby="driver-course-title">
      <div class="eyebrow">FORMATION · AGENT ANALYTICS DRIVER TREE</div>
      <h1 class="page-title" id="driver-course-title">Construire votre agent pour comprendre le chiffre d’affaires.</h1>
      <p class="page-intro">Un seul arbre global relie les données, les indicateurs et le diagnostic. Apprenez à reconstruire ce même agent guidé : contrôler les données, calculer chaque nœud, expliquer les écarts et préparer une décision à vérifier.</p>
      <div class="notice">Exécution locale déterministe · 0 € d’appel à un modèle · aucun compte ni service cloud requis pour ce parcours. L’exemple est synthétique ; les calculs ne démontrent pas des causes métier.</div>
      <div class="actions"><a class="button black" href="#outil">Utiliser le même arbre dans l’outil ↗</a></div>
    </section>

    <article class="lesson" aria-label="Les cinq étapes de construction de l’agent">
      <section class="section panel" aria-labelledby="driver-step-1">
        <p class="eyebrow">ÉTAPE 01 · LA QUESTION ET L’ARBRE</p>
        <h2 id="driver-step-1">Définir ce que votre agent doit expliquer.</h2>
        <p>Question de départ : « Comment le CA net HT a-t-il évolué entre deux périodes comparables, et quels facteurs devons-nous investiguer ? » Indiquez le canal, le périmètre, la devise et les dates. Le résultat attendu est un seul rapport global ; chaque branche reste une partie de ce même diagnostic.</p>
        <p>Reconstruisez les neuf nœuds et leurs quatre identités. Le nombre d’unités et le CA brut sont des données sources permettant de calculer les ratios ; ils ne changent pas la structure de l’arbre.</p>
        <div class="table-wrap">
          <table>
            <caption>Les neuf indicateurs du Driver Tree global</caption>
            <thead><tr><th scope="col">Nœud</th><th scope="col">Définition ou relation</th></tr></thead>
            <tbody>
              <tr><th scope="row">CA net HT</th><td>Commandes × panier moyen net</td></tr>
              <tr><th scope="row">Commandes</th><td>Trafic × taux de transformation</td></tr>
              <tr><th scope="row">Panier moyen net</th><td>Indice de vente × prix de vente moyen net</td></tr>
              <tr><th scope="row">Trafic</th><td>Visites ou sessions du périmètre, sans mélange de définitions</td></tr>
              <tr><th scope="row">Taux de transformation (TT)</th><td>Commandes ÷ trafic</td></tr>
              <tr><th scope="row">Indice de vente (IV)</th><td>Unités vendues ÷ commandes</td></tr>
              <tr><th scope="row">Prix de vente moyen net (PVM)</th><td>Prix moyen brut HT × (1 − taux de démarque commerciale)</td></tr>
              <tr><th scope="row">Prix moyen brut HT</th><td>CA brut HT ÷ unités vendues</td></tr>
              <tr><th scope="row">Taux de démarque commerciale</th><td>(CA brut HT − CA net HT) ÷ CA brut HT</td></tr>
            </tbody>
          </table>
        </div>
        <div class="notice"><strong>Équation complète :</strong> CA net HT = trafic × TT × IV × prix moyen brut HT × (1 − taux de démarque commerciale). La dernière branche applique la part conservée, et non le taux de démarque lui-même.</div>
        <p><strong>Votre livrable :</strong> l’arbre dessiné et une phrase de définition pour chaque nœud. Vérifiez que l’on peut relier chaque chiffre à son unité et à sa source, sans deviner le sens d’une colonne.</p>
      </section>

      <section class="section panel" aria-labelledby="driver-step-2">
        <p class="eyebrow">ÉTAPE 02 · LES DONNÉES ET LE CONTEXTE</p>
        <h2 id="driver-step-2">Écrire un contrat qui rend les chiffres comparables.</h2>
        <p>Pour chaque période, fournissez dates, périmètre, canal, devise, convention HT, définition du trafic, trafic, commandes, unités, CA brut et CA net. Ajoutez la source, la date d’extraction et les règles d’inclusion : annulations, retours, dédoublonnage et remises. Utilisez le même périmètre de ventes pour les montants et les quantités.</p>
        <p>Le prix brut global est une <strong>moyenne pondérée par les quantités vendues</strong> : somme des montants bruts retenus divisée par somme des unités. Ce n’est pas la moyenne simple des prix catalogue. Le taux global de démarque utilise les montants agrégés : (brut − net) ÷ brut ; ne faites pas une moyenne simple des pourcentages de remise.</p>
        <p>La démarque est ici commerciale. Les pertes physiques de stock n’entrent pas dans ce taux. Une remise incluse dans le net ne doit jamais être déduite une seconde fois. Un prix moyen brut stable ne prouve pas que chaque prix produit est resté inchangé : plusieurs changements peuvent se compenser dans le mix.</p>
        <ol>
          <li>Contrôlez présence, type, finitude, unités et provenance des données. Une absence ne devient pas zéro.</li>
          <li>Comparez mêmes populations, définitions, devises et calendrier ; documentez toute normalisation au lieu de la supposer.</li>
          <li>Dans le cas standard positif, vérifiez brut ≥ net ≥ 0. Les ventes négatives ou avoirs demandent un contrat adapté.</li>
          <li>Trafic, commandes, unités ou brut nuls peuvent rendre certains ratios non calculables : conservez les constats possibles et indiquez les branches indisponibles.</li>
        </ol>
        <p>Si le trafic désigne des sessions et le TT une probabilité de commande, précisez la règle sur les commandes multiples par session. Un ratio « commandes par visite » ne doit pas être présenté silencieusement comme une probabilité.</p>
        <p><strong>Votre livrable :</strong> deux périodes documentées et une liste de contrôles. Testez un cas valide, une donnée absente, une devise différente et un dénominateur nul. Les données ne doivent pas être envoyées ailleurs pour réaliser l’exercice.</p>
      </section>

      <section class="section panel" aria-labelledby="driver-step-3">
        <p class="eyebrow">ÉTAPE 03 · LES OUTILS DE CALCUL</p>
        <h2 id="driver-step-3">Reconstruire les résultats avant de les commenter.</h2>
        <p>Assemblez une chaîne de fonctions de calcul dans un seul agent guidé : valider les entrées, dériver les neuf indicateurs, vérifier les quatre identités, comparer les périodes, calculer les contributions admissibles et produire le rapport. Le texte d’analyse ne doit pas recalculer approximativement ce que les fonctions ont déjà établi.</p>
        <div class="table-wrap">
          <table>
            <caption>Jeu pédagogique de référence — une même devise et un même périmètre HT</caption>
            <thead><tr><th scope="col">Donnée ou résultat</th><th scope="col">Référence</th><th scope="col">Comparaison</th></tr></thead>
            <tbody>
              <tr><th scope="row">Trafic</th><td>10 000</td><td>10 000</td></tr>
              <tr><th scope="row">Commandes</th><td>1 000</td><td>900</td></tr>
              <tr><th scope="row">Unités</th><td>2 000</td><td>1 800</td></tr>
              <tr><th scope="row">CA brut HT</th><td>32 000 €</td><td>28 800 €</td></tr>
              <tr><th scope="row">CA net HT</th><td>30 000 €</td><td>25 200 €</td></tr>
              <tr><th scope="row">TT</th><td>10 %</td><td>9 %</td></tr>
              <tr><th scope="row">IV</th><td>2</td><td>2</td></tr>
              <tr><th scope="row">Prix moyen brut HT</th><td>16 €</td><td>16 €</td></tr>
              <tr><th scope="row">Taux de démarque commerciale</th><td>6,25 %</td><td>12,50 %</td></tr>
              <tr><th scope="row">PVM net</th><td>15 €</td><td>14 €</td></tr>
              <tr><th scope="row">Panier moyen net</th><td>30 €</td><td>28 €</td></tr>
            </tbody>
          </table>
        </div>
        <p>Le CA net diminue de <strong>4 800 € (−16 %)</strong>. Le TT perd 1 point de pourcentage ; la démarque augmente de 6,25 points. Ces écarts en points ne sont pas des variations relatives de même valeur. N’arrondissez pas les calculs intermédiaires ; annoncez la tolérance utilisée pour vérifier les identités.</p>
        <p>Pour répartir l’écart global, annoncez une convention : la moyenne des ordres de remplacement des cinq facteurs terminaux, avec <strong>part conservée = 1 − taux de démarque</strong>. Dans cet exemple, seuls TT et part conservée changent. En posant A = trafic × IV × prix brut = 320 000, on obtient :</p>
        <ul>
          <li>Contribution TT : A × (0,09 − 0,10) × (0,9375 + 0,875) ÷ 2 = <strong>−2 900 €</strong>.</li>
          <li>Contribution de la part conservée : A × (0,875 − 0,9375) × (0,10 + 0,09) ÷ 2 = <strong>−1 900 €</strong>.</li>
          <li>Réconciliation : −2 900 − 1 900 = <strong>−4 800 €</strong> ; les autres facteurs inchangés contribuent ici zéro.</li>
        </ul>
        <p>La baisse du CA brut est de 3 200 € et les montants de démarque passent de 2 000 à 3 600 €. Ces différences observées ne sont pas les contributions symétriques. N’additionnez pas les allocations de plusieurs niveaux de l’arbre : parents et enfants décrivent le même écart.</p>
        <p><strong>Votre livrable :</strong> les fonctions de calcul et leurs résultats de référence. Vérifiez aussi un cas sans changement, un cas avec facteur invalide et un cas partiellement non calculable. Une contribution exacte reste une allocation mathématique, pas un effet causal mesuré.</p>
      </section>

      <section class="section panel" aria-labelledby="driver-step-4">
        <p class="eyebrow">ÉTAPE 04 · LES INSTRUCTIONS DE L’AGENT</p>
        <h2 id="driver-step-4">Rendre le raisonnement lisible et contrôlable.</h2>
        <p>L’agent guidé suit un protocole explicite. Ses fonctions calculent ; ses règles organisent les résultats et les limites. Le texte suivant décrit ce comportement : il ne branche pas un modèle et ne crée aucun accès à une source de données.</p>
        <pre style="white-space:pre-wrap;overflow-wrap:anywhere"><code>MISSION
Comparer deux périodes par le seul arbre global du CA net HT.

ENTRÉES
Question, périmètre, deux périodes, totaux autorisés et contexte de qualité.

PROTOCOLE
1. Vérifier le contrat et conserver la trace des contrôles.
2. Calculer les neuf indicateurs et vérifier les quatre identités.
3. Restituer valeurs, écarts absolus et variations relatives définies.
4. Annoncer la convention de contribution et réconcilier l’écart.
5. Séparer constats, contributions, hypothèses et causes démontrées.
6. Pour une hypothèse, indiquer la preuve manquante ou le test proposé.
7. Chiffrer un scénario avec ses facteurs constants et ses limites.
8. Produire un seul rapport global avec sources et décision attendue.

LIMITES
Ne pas inventer une donnée manquante.
Ne pas remplacer un ratio non calculable par zéro.
Ne pas attribuer une cause à partir des seules identités.
Ne déclencher aucune dépense ni action externe automatiquement.</code></pre>
        <p>Préparez quatre questions de référence : « Comment retrouve-t-on le net ? », « Quels nœuds ont changé ? », « Les contributions retrouvent-elles l’écart ? » et « Que faut-il vérifier avant de décider ? ». Définissez les réponses attendues avant de rejouer l’agent.</p>
        <p><strong>Votre livrable :</strong> ces instructions adaptées à votre vocabulaire, les quatre questions et les résultats attendus. Une autre personne doit pouvoir comprendre quelle donnée manque et quelle partie du diagnostic reste utilisable.</p>
      </section>

      <section class="section panel" aria-labelledby="driver-step-5">
        <p class="eyebrow">ÉTAPE 05 · LE RAPPORT ET LA DÉCISION</p>
        <h2 id="driver-step-5">Passer du calcul à une prochaine vérification.</h2>
        <p>Votre rapport global rassemble question et périmètre, arbre complet, valeurs et variations, contrôles, contributions, hypothèses et preuves manquantes. « Le TT baisse » est un constat ; « une difficulté de paiement le provoque » est une hypothèse tant qu’une preuve adaptée ne l’établit pas.</p>
        <p>Testez un scénario transparent : conserver le brut actuel à 28 800 € et ramener le taux de démarque à 10 % donnerait <strong>25 920 € de CA net, soit +720 €</strong>. Cela suppose le volume, le prix brut et les autres facteurs constants. Ce montant n’est ni un gain garanti, ni une mesure d’effet causal, ni un gain de marge : les coûts et les réactions des ventes ne sont pas fournis.</p>
        <p>Une proposition recevable précise le levier, le responsable proposé, la comparaison, la période à convenir et les garde-fous. Demandez les données nécessaires sur volume, retours et marge avant un engagement. Le décideur valide le test ; l’agent ne lance pas automatiquement une promotion ou une dépense.</p>
        <p><strong>Votre livrable :</strong> un rapport reproductible en Markdown et JSON, avec les mêmes valeurs et les mêmes limites. Utilisez <a href="#outil">l’outil global Driver Tree</a> pour confronter votre reconstruction à l’exemple.</p>
      </section>
    </article>

    <section class="section panel lesson" aria-labelledby="driver-exercise">
      <p class="eyebrow">EXERCICE AUTONOME</p>
      <h2 id="driver-exercise">Reconstruire l’agent, puis défendre son diagnostic.</h2>
      <p>À partir des deux périodes du tableau, sans recopier les résultats calculés :</p>
      <ol>
        <li>Dérivez TT, IV, prix brut pondéré, taux de démarque, PVM et panier. Vérifiez les quatre identités et l’équation complète.</li>
        <li>Produisez les écarts de chaque nœud et les contributions TT / part conservée avec leur convention ; vérifiez leur somme.</li>
        <li>Modifiez une entrée pour rendre un ratio non calculable. Le rapport doit garder les constats disponibles et expliquer la branche bloquée.</li>
        <li>Calculez le scénario de démarque à 10 %, puis préparez une réunion simulée : un fait, une hypothèse, une preuve manquante et une décision à valider. Aucun engagement réel n’est demandé.</li>
      </ol>
      <details>
        <summary>Ouvrir le corrigé et comparer vos résultats</summary>
        <p>Référence : TT 10 %, IV 2, prix brut 16 €, taux de démarque 6,25 %, PVM 15 €, panier 30 € et CA net 30 000 €. Comparaison : TT 9 %, IV 2, prix brut 16 €, taux de démarque 12,5 %, PVM 14 €, panier 28 € et CA net 25 200 €.</p>
        <p>Les identités donnent 1 000 puis 900 commandes, 30 puis 28 € de panier, et un écart net de −4 800 € (−16 %). Selon la convention annoncée, contribution TT −2 900 € et part conservée −1 900 € ; total −4 800 €. Le prix brut moyen est stable, sans que cela démontre la stabilité de tous les prix produits.</p>
        <p>Avec trafic nul, le TT n’est pas calculable. Avec zéro unité et des commandes positives, IV vaut zéro, mais les prix moyens ne sont pas calculables. Avec zéro commande, IV et panier moyen ne sont pas calculables. Le rapport doit signaler ces cas et conserver les totaux valides, sans fabriquer une décomposition complète. Une donnée absente reste absente ; 100 % de démarque avec brut positif peut au contraire correspondre à un net nul valide.</p>
        <p>Scénario : 28 800 × (1 − 10 %) = 25 920 €, soit 720 € de plus que 25 200 €. La décision reste conditionnelle : la réduction de démarque peut modifier le volume ou le mix ; l’arbre seul ne fournit ni cet effet ni la marge. Une réunion honnête consigne la preuve manquante et le protocole à valider.</p>
      </details>
    </section>

    <section class="section panel lesson" aria-labelledby="driver-rubric">
      <h2 id="driver-rubric">Grille de validation de votre reconstruction.</h2>
      <ol>
        <li><strong>Contrat et contexte :</strong> périmètres comparables, sources, unités et règles explicités ; données absentes et ratios non calculables traités sans correction silencieuse.</li>
        <li><strong>Arbre et calculs :</strong> neuf nœuds, quatre identités, prix brut pondéré et taux global correctement définis ; résultats de référence retrouvés.</li>
        <li><strong>Contributions et traçabilité :</strong> convention annoncée, réconciliation exacte à la tolérance documentée, aucun double comptage entre niveaux ; mêmes chiffres dans les deux formats du rapport.</li>
        <li><strong>Diagnostic et décision :</strong> hypothèse distincte de la cause, scénario conditionnel, preuves manquantes et garde-fous visibles ; aucune promesse de marge ou d’action automatique.</li>
      </ol>
      <div class="notice">Validation finale : faites rejouer les quatre questions de référence par une autre personne avec le même fichier. Elle doit retrouver les résultats et les limites sans explication orale supplémentaire. La grille est une vérification du projet, pas une certification.</div>
      <div class="actions"><a class="button black" href="#outil">Passer à l’outil Driver Tree ↗</a></div>
    </section>
  `;
}
