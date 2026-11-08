# Espace apprenant et premier agent — version 0.2

## Réalisé

- Connexion et inscription Supabase avec confirmation email, plus vérification manuelle d'un code/lien si la redirection n'est pas disponible.
- Progression synchronisée pour les comptes connectés ; mode local conservé pour les visiteurs.
- Projets d'agents personnels : création, reprise, modification et configuration exportable.
- Historique des analyses choisies par l'utilisateur. L'interface n'enregistre pas le fichier CSV brut ; les utilisateurs gardent le contrôle des textes et contextes qu'ils enregistrent.
- Agent local à outils : comptage, somme, moyenne, minimum, maximum, ACP et K-means avec trace.
- Starter autonome téléchargeable, utilisable avec Node.js sans clé API.
- Six modules enrichis et projet final ; deux adaptations synthétiques du même socle (énergie et formation).
- Route serveur générative préparée avec AI SDK 7, authentification réelle, allowlist, consentement, quota de 10 requêtes/jour UTC, quatre étapes maximum, 1 000 tokens de sortie par étape et zéro retry applicatif.

## Génération : désactivée par défaut

Le mode local est fonctionnel. Aucun appel au modèle n'a été effectué ni facturé pendant cette livraison.

Avant activation du pilote : choisir un modèle à partir du catalogue actuel AI Gateway, approuver un budget monétaire et le faire appliquer dans AI Gateway, configurer AI_GATEWAY_MODEL, AI_ALLOWED_USER_IDS et AI_GENERATIVE_ENABLED=true dans Vercel. Les UUID autorisés viennent de l'espace apprenant. Vercel utilise l'OIDC ; en local seulement, une clé AI_GATEWAY_API_KEY est nécessaire.

Le quota applicatif limite les requêtes, pas les euros. Un plafond financier doit être configuré séparément avant l'ouverture du mode génératif. Aucun token ni secret de modèle ne doit être versionné.

Le modèle reçoit uniquement le schéma des variables sélectionnées, le profil et les résultats des outils. Les lignes individuelles restent hors du contexte du modèle. Le serveur reçoit néanmoins le dataset pour calculer les outils. Le consentement utilisateur est exigé avant cet envoi. Les centres de groupes de moins de trois observations sont masqués dans les résumés distants.

## Supabase

Migration initialisée par CLI, appliquée puis enregistrée dans l'historique distant : supabase/migrations/20261108151443_learner_workspace.sql.

Tables : la_progress, la_projects, la_runs et la_ai_requests. RLS activée, accès réservé à authenticated et filtré sur auth.uid(). Aucun service_role utilisé. La RPC de quota est SECURITY INVOKER, sans droit de réécrire ou supprimer les réservations.

Les tests SQL supabase/tests/learner_isolation.sql utilisent deux utilisateurs synthétiques dans une transaction annulée. Ils vérifient lecture/écriture croisées, réattribution d'un projet, FK composite, refus anonyme et limite de quota.

RLS protège l'isolation entre comptes. Le JSON des analyses n'est pas un mécanisme général d'anonymisation : un utilisateur peut écrire ses propres données via REST dans son espace. La minimisation décrite concerne le chemin normal de l'interface.

## Emails de confirmation

L'authentification email est activée et la confirmation est requise dans le projet. Configurer Site URL et Redirect URLs sur https://lasolution-chi.vercel.app/ dans Supabase Auth. Le service d'envoi SMTP et la réception par un vrai apprenant restent à vérifier ; aucun email de test n'a été envoyé pendant cette livraison. Le SMTP par défaut de Supabase est destiné aux tests avec les membres du projet, pas à une inscription publique générale.

Références : https://supabase.com/docs/guides/auth/passwords ; https://supabase.com/docs/guides/auth/auth-smtp ; https://vercel.com/docs/ai-gateway/authentication-and-byok

## Vérification et limites

Tests automatisés du moteur et des garde-fous API ; tests RLS exécutés en base ; revue indépendante et correctifs intégrés ; build et starter exécutés. La connexion navigateur avec des identifiants fictifs reçoit l'erreur Supabase attendue. La création réelle d'un compte et la synchronisation sur deux appareils nécessitent encore un test avec une adresse réelle.

Paiement, catalogue administrable, connecteurs externes, suivi avancé des évaluations et service cloud permanent IA Comex restent des évolutions distinctes.
