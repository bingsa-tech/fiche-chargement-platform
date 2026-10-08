# Fiche Électronique pour le Chargement des Passagers

> Plateforme numérique de gestion, contrôle et suivi des opérations de chargement des passagers.

## ?? Présentation

**Fiche Électronique pour le Chargement des Passagers** est une plateforme logicielle destinée à moderniser, sécuriser et centraliser la gestion des opérations de chargement des passagers.

La solution permet de gérer notamment :

- les gares ;
- les véhicules ;
- les chauffeurs ;
- les documents administratifs ;
- les passagers ;
- les destinations ;
- les itinéraires ;
- les fiches de chargement ;
- les alertes ;
- les contrôles ;
- les audits ;
- la synchronisation des données.

L'application mobile Flutter adopte une architecture **Offline First**, permettant aux utilisateurs de continuer à travailler même en cas d'absence ou d'instabilité de la connexion Internet.

---

# ??? Architecture du projet

Le projet est organisé sous forme de **monorepo** contenant trois applications principales :

```text
fiche-chargement-platform/
¦
+-- apps/
¦   +-- mobile/       # Application mobile Flutter
¦   +-- backend/      # API REST NestJS
¦   +-- admin/        # Interface d'administration VueJS
¦
+-- docs/             # Documentation technique et fonctionnelle
¦
+-- .gitignore
+-- README.md


Architecture globale

+-------------------------------+
¦       Application Mobile      ¦
¦            Flutter            ¦
¦                               ¦
¦   UI ? Riverpod ? Repository  ¦
¦            ?                  ¦
¦          SQLite               ¦
+-------------------------------+
                ¦
                ¦ Synchronisation REST
                ?
+-------------------------------+
¦          API Backend          ¦
¦            NestJS             ¦
¦                               ¦
¦ Controllers                   ¦
¦ Services                      ¦
¦ Guards / JWT / Permissions    ¦
¦ TypeORM                       ¦
+-------------------------------+
                ¦
                ?
+-------------------------------+
¦          PostgreSQL           ¦
¦      db_fiche_chargement      ¦
+-------------------------------+

+-------------------------------+
¦       Administration Web      ¦
¦            VueJS              ¦
¦                               ¦
¦ Gestion / supervision /       ¦
¦ administration                ¦
+-------------------------------+


Application Mobile — Flutter

apps/mobile/

Technologies principales
Flutter 3.47+
Dart 3.13+
Riverpod
GoRouter
Dio
SQLite / sqflite
Secure Storage
JWT
Architecture Offline First


Architecture fonctionnelle

Presentation
     ?
Providers / Riverpod
     ?
Repositories
     ?
DAOs
     ?
SQLite
     ?
Synchronisation REST
     ?
NestJS API


Modules fonctionnels

Les modules sont développés progressivement selon les sprints Agile


Authentification et gestion des rôles
Gares
Véhicules
Documents véhicules
Chauffeurs
Documents chauffeurs
Passagers
Destinations
Itinéraires
Fiches de chargement
Alertes
Audit
Synchronisation
Statistiques et tableaux de bord


Backend — NestJS

apps/backend/

Technologies principales
Node.js
NestJS
TypeScript
PostgreSQL
TypeORM
JWT
Passport
bcrypt
Swagger
class-validator
class-transformer

Base de données
PostgreSQL
Database: db_fiche_chargement

Le backend utilise TypeORM.


Modules backend
auth
roles
utilisateurs
gares
vehicules
documents
chauffeurs
destinations
itineraires
passagers
fiches
fiche-passagers
alertes
audit
sync


Administration Web — VueJS
apps/admin/


L'application web permet de gérer et superviser les données et opérations nécessitant une interface d'administration.

Technologies principales
VueJS
TypeScript
Vue Router
Axios
Vite

Les fonctionnalités d'administration seront intégrées progressivement selon les besoins des rôles et des sprints Agile


Authentification et rôles
La plateforme utilise une authentification basée sur JWT.

Les rôles fonctionnels principaux sont :

| Rôle         | Description                                  |
| ------------ | -------------------------------------------- |
| `ADMIN`      | Administration complète de la plateforme     |
| `AGENT`      | Opérations et gestion quotidienne            |
| `CONTROLEUR` | Contrôle, vérification et consultation       |
| `AUTORITE`   | Supervision et consultation des informations |
| `PUBLIC`     | Accès aux informations publiques             |



Matrice fonctionnelle générale

| Fonctionnalité              |       ADMIN      |   AGENT   |    CONTROLEUR    |   AUTORITE   |  PUBLIC |
| --------------------------- | :--------------: | :-------: | :--------------: | :----------: | :-----: |
| Authentification            |         ?        |     ?     |         ?        |       ?      |    —    |
| Gares                       |       CRUD       |    CRU    |      Lecture     |    Lecture   |    —    |
| Véhicules                   |       CRUD       |    CRUD   |      Lecture     |    Lecture   |    —    |
| Documents véhicules         |       CRUD       |    CRUD   |     Contrôle     |    Lecture   |    —    |
| Chauffeurs                  |       CRUD       |    CRUD   | Lecture/Contrôle |    Lecture   |    —    |
| Documents chauffeurs        |       CRUD       |    CRUD   |     Contrôle     |    Lecture   |    —    |
| Passagers                   |       CRUD       |    CRUD   |     Contrôle     |    Lecture   |    —    |
| Destinations                |       CRUD       |    CRUD   |      Lecture     |    Lecture   | Lecture |
| Itinéraires                 |       CRUD       |    CRUD   |     Contrôle     |    Lecture   | Lecture |
| Fiches de chargement        |       CRUD       |    CRUD   |     Contrôle     |    Lecture   |    —    |
| Alertes                     |       CRUD       |  Gestion  |   Consultation   | Consultation |    —    |
| Audit                       | Lecture complète |     —     |   Consultation   | Consultation |    —    |
| Synchronisation             |      Gestion     | Exécution |     Exécution    |       —      |    —    |
| Administration utilisateurs |       CRUD       |     —     |         —        |       —      |    —    |


Architecture Offline First

L'application mobile doit rester fonctionnelle lorsque la connexion Internet est indisponible.

Le principe est :

Utilisateur
    ?
Flutter
    ?
SQLite local
    ?
Sync Queue
    ?
Connexion disponible
    ?
API REST NestJS
    ?
PostgreSQL


Principes

Les données opérationnelles sont d'abord enregistrées localement.
SQLite constitue le stockage local de l'application mobile.
Les opérations en attente sont conservées dans sync_queue.
La synchronisation est exécutée lorsque la connexion est disponible.
PostgreSQL constitue la source centrale des données.
Les conflits de synchronisation devront être traités explicitement.



Modèle de données principal

Les principales entités du système comprennent :
Role
Utilisateur
Gare
Vehicule
DocumentVehicule
Chauffeur
DocumentChauffeur
Destination
Itineraire
Passager
Fiche
FichePassager
AlerteDocument
AuditLog
SyncQueue


Règle importante : documents séparés

Les documents ne sont pas fusionnés avec les entités principales.


Vehicule
   ¦
   +-- DocumentVehicule

Chauffeur
   ¦
   +-- DocumentChauffeur


Cette séparation permet de gérer plusieurs documents, leurs dates d'expiration et leurs états indépendamment de l'entité principale.


Gestion des documents et alertes
Documents chauffeur
Permis de conduire
CNI
Certificat médical
Bulletin n°3
Autres documents réglementaires
Documents véhicule
Carte grise
Carte bleue
Assurance
Autres documents réglementaires
Niveaux d'alerte

INFORMATION
ATTENTION
URGENT
EXPIRE

Stratégie de tests
La qualité du projet repose sur une validation progressive.

Flutter
cd apps/mobile
flutter analyze
flutter test

NestJS
cd apps/backend
npm install
npm run build

VueJS
cd apps/admin
npm install
npm run build

Installation du projet
Prérequis

Installer au minimum :

Git
Flutter
Dart
Node.js
npm
PostgreSQL
VS Code recommandé
Cloner le dépôt

git clone https://github.com/bingsa-tech/fiche-chargement-platform.git
cd fiche-chargement-platform

Installation Mobile
cd apps/mobile
flutter pub get
flutter analyze
flutter test

Lancer l'application
flutter run
Installation Backend
cd apps/backend
npm install

Lancer en développement :

npm run start:dev

Construire le backend :

npm run build

Installation Administration Web
cd apps/admin
npm install
npm run dev

Construire pour la production
npm run build

Stratégie Git

Le projet utilise une stratégie Git basée sur :

main
 ¦
 +-- sprint/0-foundations
 +-- sprint/1-gares
 +-- sprint/2-vehicules
 +-- sprint/3-chauffeurs
 +-- sprint/4-passagers
 +-- sprint/5-destinations
 +-- sprint/6-itineraires
 +-- sprint/7-fiches
 +-- sprint/8-alertes
 +-- sprint/9-audit
 +-- sprint/10-synchronisation

Principes
main doit rester stable.
Chaque fonctionnalité importante est développée dans une branche dédiée.
Les commits doivent être explicites.
Un sprint doit être validé avant son intégration.
Les tests doivent passer avant fusion.
Les migrations et changements de schéma doivent être documentés.
Convention de commits
feat: ajout du module véhicules
fix: correction du mapping du rôle autorité
test: ajout des tests du DAO chauffeur
refactor: simplification du repository
docs: mise à jour de la documentation
chore: mise à jour des dépendances

Plan Agile

Le développement est organisé en sprints afin de garantir une progression contrôlée et vérifiable.

Sprint 0 — Foundations
Objectifs
Initialiser le monorepo
Stabiliser Flutter
Stabiliser NestJS
Stabiliser VueJS
Mettre en place Git
Authentification JWT
Gestion des rôles
Routing
Dashboards par rôle
SQLite
Tests de base
Architecture Offline First
Sprint 1 — Gares
Objectifs
Entité Gare
SQLite
DAO
Repository
Provider
Écrans Flutter
API NestJS
Tests
Permissions par rôle
Sprint 2 — Véhicules
Objectifs
CRUD véhicules
SQLite
DAO
Repository
Provider
API
Tests
Intégration des documents véhicules
Sprint 3 — Chauffeurs
Objectifs
CRUD chauffeurs
SQLite
DAO
Repository
Provider
API
Tests
Intégration des documents chauffeurs
Sprint 4 — Passagers
Objectifs
Gestion des passagers
Données locales
API
Tests
Permissions
Sprint 5 — Destinations
Objectifs
CRUD destinations
SQLite
API
Tests
Sprint 6 — Itinéraires
Objectifs
Gestion des itinéraires
Association gare/destination
API
Tests
Sprint 7 — Fiches de chargement
Objectifs
Création d'une fiche
Association véhicule
Association chauffeur
Association passagers
Validation
Historique
Sprint 8 — Alertes
Objectifs
Expiration des documents
Niveaux d'alerte
Notifications
Consultation par rôle
Sprint 9 — Audit
Objectifs
Journalisation des opérations
Traçabilité
Consultation des événements
Permissions
Sprint 10 — Synchronisation
Objectifs
Sync Queue
Synchronisation Offline First
Gestion des erreurs réseau
Gestion des conflits
Synchronisation bidirectionnelle
Tests de synchronisation
?? Definition of Done

Une fonctionnalité est considérée comme terminée lorsque :

 Le modèle de données est défini.
 Le backend est implémenté.
 SQLite est implémenté si nécessaire.
 DAO et Repository sont disponibles.
 Provider Riverpod est intégré.
 L'interface Flutter est fonctionnelle.
 Les permissions sont respectées.
 Les tests sont écrits.
 flutter analyze ne présente pas d'erreur.
 flutter test passe.
 Le backend compile.
 La documentation est mise à jour.
 Le code est commité.
 Le sprint est validé avant fusion dans main.


Documentation

La documentation détaillée est centralisée dans :

docs/

structure prevue
docs/
+-- architecture/
+-- database/
+-- api/
+-- authentication/
+-- permissions/
+-- offline-first/
+-- synchronization/
+-- agile/
+-- deployment/


Vision du projet

La vision à terme est de disposer d'une plateforme fiable, sécurisée et évolutive permettant :

la digitalisation des fiches de chargement ;
la réduction des opérations papier ;
le contrôle des documents réglementaires ;
la détection des documents expirés ;
la traçabilité des opérations ;
le fonctionnement Offline First ;
la centralisation des données ;
la supervision par les autorités ;
l'administration centralisée ;
la production de statistiques et de rapports.

État actuel du projet

Phase actuelle : Sprint 0 — Foundations

Priorités immédiates
Stabiliser le monorepo.
Valider l'authentification.
Valider le mapping des rôles.
Valider les dashboards par rôle.
Valider SQLite.
Valider les tests Flutter.
Valider le backend NestJS.
Valider l'administration VueJS.
Créer le baseline Git v0.1.0.
Démarrer le Sprint 1 — Gares.

Projet

Nom : Fiche Électronique pour le Chargement des Passagers

Architecture :
Flutter + SQLite
        ?
      REST
        ?
NestJS + TypeORM
        ?
   PostgreSQL
        ?
     VueJS


Approche
Offline First
Clean Architecture
REST API
JWT Authentication
Role-Based Access Control
Agile / Scrum
Tests automatisés



actual backend structure
fiche-chargement-platform/apps/backend
B:.
|   app.controller.spec.ts
|   app.controller.ts
|   app.module.ts
|   app.service.ts
|   main.ts
|
+---alertes
|   |   alertes.controller.spec.ts
|   |   alertes.controller.ts
|   |   alertes.module.ts
|   |   alertes.service.spec.ts
|   |   alertes.service.ts
|   |
|   +---dto
|   |       create-alerte.dto.ts
|   |       update-alerte.dto.ts
|   |
|   +---entities
|   |       alerte-document.entity.ts
|   |
|   \---enums
|           alerte-proprietaire-type.enum.ts
|           alerte-statut.enum.ts
|           alerte-type.enum.ts
|
+---auth
|   |   auth-test.controller.ts
|   |   auth.controller.ts
|   |   auth.module.ts
|   |   auth.service.ts
|   |
|   +---decorators
|   |       permission.decorator.ts
|   |
|   +---dto
|   |       login.dto.ts
|   |
|   +---guards
|   |       jwt-auth.guard.ts
|   |       permissions.guard.ts
|   |
|   +---refresh
|   |   |   refresh-token.service.spec.ts
|   |   |   refresh-token.service.ts
|   |   |
|   |   \---entities
|   |           refresh-token.entity.ts
|   |
|   \---strategies
|           jwt.strategy.ts
|
+---chauffeurs
|   |   chauffeurs.controller.spec.ts
|   |   chauffeurs.controller.ts
|   |   chauffeurs.module.ts
|   |   chauffeurs.service.spec.ts
|   |   chauffeurs.service.ts
|   |
|   +---dto
|   |       create-chauffeur.dto.ts
|   |       update-chauffeur.dto.ts
|   |
|   +---entities
|   |       chauffeur.entity.ts
|   |
|   \---enums
|           chauffeur-statut.enum.ts
|
+---common
|   +---controllers
|   |       test-roles.controller.ts
|   |
|   +---decorators
|   |       roles.decorator.ts
|   |
|   \---guards
|           roles.guard.ts
|
+---config
|       permissions.config.ts
|       roles.config.ts
|
+---destinations
|   |   destinations.controller.spec.ts
|   |   destinations.controller.ts
|   |   destinations.module.ts
|   |   destinations.service.spec.ts
|   |   destinations.service.ts
|   |
|   +---dto
|   |       create-destination.dto.ts
|   |       update-destination.dto.ts
|   |
|   +---entities
|   |       destination.entity.ts
|   |
|   \---enums
|           destination-statut.enum.ts
|
+---documents
|   |   document.controller.ts
|   |   document.module.ts
|   |   document.service.ts
|   |
|   +---dto
|   |       create-document-chauffeur-initial.dto.ts
|   |       create-document-chauffeur.dto.ts
|   |       create-document-vehicule-input.dto.ts
|   |       create-document-vehicule.dto.ts
|   |       update-document-chauffeur.dto.ts
|   |       update-document-vehicule.dto.ts
|   |
|   \---entities
|           document-chauffeur.entity.ts
|           document-vehicule.entity.ts
|
+---entities
|       role.entity.ts
|       utilisateur.entity.ts
|
+---fiche-impressions
|   |   fiche-impressions.controller.spec.ts
|   |   fiche-impressions.controller.ts
|   |   fiche-impressions.module.ts
|   |   fiche-impressions.service.spec.ts
|   |   fiche-impressions.service.ts
|   |
|   +---dto
|   |       create-fiche-impression.dto.ts
|   |       update-fiche-impression.dto.ts
|   |
|   \---entities
|           fiche-impression.entity.ts
|
+---fiche-passagers
|   |   fiche-passagers.controller.spec.ts
|   |   fiche-passagers.controller.ts
|   |   fiche-passagers.module.ts
|   |   fiche-passagers.service.spec.ts
|   |   fiche-passagers.service.ts
|   |
|   +---dto
|   |       create-fiche-passager.dto.ts
|   |       update-fiche-passager.dto.ts
|   |
|   \---entities
|           fiche-passager.entity.ts
|
+---fiche-remises
|   |   fiche-remises.controller.spec.ts
|   |   fiche-remises.controller.ts
|   |   fiche-remises.module.ts
|   |   fiche-remises.service.spec.ts
|   |   fiche-remises.service.ts
|   |
|   +---dto
|   |       create-fiche-remise.dto.ts
|   |       update-fiche-remise.dto.ts
|   |
|   \---entities
|           fiche-remise.entity.ts
|
+---fiches
|   |   fiche.controller.spec.ts
|   |   fiche.controller.ts
|   |   fiche.module.ts
|   |   fiche.service.spec.ts
|   |   fiche.service.ts
|   |
|   +---dto
|   |       annuler-fiche.dto.ts
|   |       create-fiche.dto.ts
|   |       update-fiche.dto.ts
|   |
|   +---entities
|   |       fiche-impression.entity.ts
|   |       fiche-passager.entity.ts
|   |       fiche-remise.entity.ts
|   |       fiche.entity.ts
|   |
|   \---enums
|           fiche-statut.enum.ts
|
+---gares
|   |   gares.controller.spec.ts
|   |   gares.controller.ts
|   |   gares.module.ts
|   |   gares.service.spec.ts
|   |   gares.service.ts
|   |
|   +---dto
|   |       create-gare.dto.ts
|   |       update-gare.dto.ts
|   |
|   +---entities
|   |       gare.entity.ts
|   |
|   \---enums
|           gare-statut.enum.ts
|
+---itineraires
|   |   itineraires.controller.spec.ts
|   |   itineraires.controller.ts
|   |   itineraires.module.ts
|   |   itineraires.service.spec.ts
|   |   itineraires.service.ts
|   |
|   +---dto
|   |       create-itineraire.dto.ts
|   |       update-itineraire.dto.ts
|   |
|   +---entities
|   |       itineraire.entity.ts
|   |
|   \---enums
|           itineraire-statut.enum.ts
|
+---passagers
|   |   passagers.controller.spec.ts
|   |   passagers.controller.ts
|   |   passagers.module.ts
|   |   passagers.service.spec.ts
|   |   passagers.service.ts
|   |
|   +---dto
|   |       create-passager.dto.ts
|   |       update-passager.dto.ts
|   |
|   \---entities
|           passager.entity.ts
|
+---proprietaires
|   |   proprietaires.controller.spec.ts
|   |   proprietaires.controller.ts
|   |   proprietaires.module.ts
|   |   proprietaires.service.spec.ts
|   |   proprietaires.service.ts
|   |
|   +---dto
|   |       create-proprietaire.dto.ts
|   |       update-proprietaire.dto.ts
|   |
|   \---entities
|           proprietaire.entity.ts
|
+---roles
|   |   roles.controller.spec.ts
|   |   roles.controller.ts
|   |   roles.module.ts
|   |   roles.service.spec.ts
|   |   roles.service.ts
|   |
|   +---dto
|   |       create-role.dto.ts
|   |       update-role.dto.ts
|   |
|   +---entities
|   |       role.entity.ts
|   |
|   \---enums
+---test-roles
|       test-roles.controller.ts
|       test-roles.module.ts
|
+---utilisateurs
|   |   utilisateur.controller.ts
|   |   utilisateur.module.ts
|   |   utilisateur.service.ts
|   |
|   +---dto
|   |       create-utilisateur.dto.ts
|   |       update-utilisateur.dto.ts
|   |
|   \---entities
|           utilisateur.entity.ts
|
\---vehicules
    |   vehicules.controller.spec.ts
    |   vehicules.controller.ts
    |   vehicules.module.ts
    |   vehicules.service.spec.ts
    |   vehicules.service.ts
    |
    +---dto
    |       create-document-vehicule-input.dto.ts
    |       create-vehicule-complet.dto.ts
    |       create-vehicule.dto.ts
    |       update-vehicule.dto.ts
    |
    +---entities
    |       vehicule.entity.ts
    |
    \---enums
            vehicule-statut.enum.ts


actual admin structure
B:.
|   App.vue
|   main.ts
|   style.css
|
+---api
|       api-error.ts
|       auth-test.api.ts
|       auth.api.ts
|       axios.ts
|       chauffeurs.api.ts
|       documents.api.ts
|       fiche.api.ts
|       gares.api.ts
|       proprietaires.api.ts
|       roles.api.ts
|       utilisateurs.api.ts
|       vehicules.api.ts
|
+---assets
|       hero.png
|       vite.svg
|       vue.svg
|
+---auth
|       auth.service.ts
|       auth.store.ts
|       auth.types.ts
|       role.types.ts
|
+---components
|   +---documents
|   +---gares
|   +---proprietaires
|   \---vehicules
+---layouts
|       AdminLayout.vue
|
+---router
|       index.ts
|
+---types
|       chauffeur.types.ts
|       document.types.ts
|       fiche.types.ts
|       gare.types.ts
|       proprietaire.types.ts
|       role.types.ts
|       utilisateur.types.ts
|       vehicule.types.ts
|
\---views
    |   AuthTestView.vue
    |   LoginView.vue
    |   NotFoundView.vue
    |   RoleHubView.vue
    |   UnauthorizedView.vue
    |
    +---chauffeurs
    |       ChauffeurFormView.vue
    |       ChauffeurListView.vue
    |
    +---dashboards
    |       AdminDashboard.vue
    |       AgentDashboard.vue
    |       AutoriteDashboard.vue
    |       ControleurDashboard.vue
    |       ResponsableGareDashboard.vue
    |
    +---documents
    |       DocumentChauffeurListView.vue
    |       DocumentDetailsView.vue
    |       DocumentFormView.vue
    |       DocumentsListView.vue
    |       DocumentVehiculeListView.vue
    |
    +---fiches
    |       FicheCreateView.vue
    |       FicheDetailView.vue
    |       FicheEditView.vue
    |       FichesListView.vue
    |
    +---gares
    |       GareFormView.vue
    |       GaresListView.vue
    |
    +---mobilite
    |       MobiliteDashboard.vue
    |
    +---proprietaires
    |       ProprietairesFormView.vue
    |       ProprietairesListView.vue
    |
    +---rapports
    |       RapportJournalierView.vue
    |       RapportsView.vue
    |
    +---utilisateurs
    |       RegisterView.vue
    |       UtilisateurFormView.vue
    |       UtilisateurListView.vue
    |
    \---vehicules
            VehiculeFormView.vue
            VehiculesListView.vue
Licence

Projet en cours de développement.
