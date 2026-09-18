Rôles et Role Hub — Admin Web
1. Objectif

L'application Admin adapte son interface et sa navigation au rôle de l'utilisateur authentifié.

Les rôles sont fournis par le backend NestJS.

2. Rôles actuellement supportés
Code backend	Espace
ADMIN	Administration
AGENT	Agent
CONTROLEUR	Contrôleur
AUTORITE_HABILITEE	Autorité habilitée

Le code du rôle doit être utilisé comme identifiant technique.

Le libellé est destiné à l'affichage.

3. Role Hub

Le Role Hub est le point central d'orientation après authentification.

                 Authenticated
                       │
                       ▼
                   Role Hub
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
     ADMIN           AGENT         CONTROLEUR
       │               │                │
       ▼               ▼                ▼
AdminDashboard   AgentDashboard   ControleurDashboard
                       │
                       ▼
             AUTORITE_HABILITEE
                       │
                       ▼
              AutoriteDashboard

Le Role Hub ne contient pas la logique métier des modules.

Son rôle est de déterminer l'espace initial accessible à l'utilisateur.

4. Principe de sécurité

Le rôle affiché dans Vue ne constitue pas une autorisation suffisante.

Exemple :

Vue
 ↓
ADMIN → affiche Gestion utilisateurs
 ↓
NestJS
 ↓
Role Guard
 ↓
autorisation réelle

NestJS doit vérifier les permissions sur les endpoints protégés.

5. Exemple de comportement

Un utilisateur avec :

role.code = ADMIN

est orienté vers :

/admin/dashboard

Un utilisateur avec :

role.code = AGENT

est orienté vers :

/agent/dashboard

Un utilisateur avec :

role.code = CONTROLEUR

est orienté vers :

/controleur/dashboard

Un utilisateur avec :

role.code = AUTORITE_HABILITEE

est orienté vers :

/autorite/dashboard
6. Route non autorisée

Si un utilisateur authentifié tente d'accéder à une route qui n'est pas autorisée pour son rôle :

→ /unauthorized

Il ne doit pas simplement être considéré comme ADMIN.

7. Évolution des rôles

Tout nouveau rôle doit être ajouté de manière cohérente dans :

backend NestJS ;
types TypeScript ;
Role Hub ;
router ;
permissions UI ;
documentation.

Ne pas créer un rôle uniquement dans Vue.