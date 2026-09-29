/////// les les dashboards


1. ADMIN
Vue globale
├── Utilisateurs
├── Rôles
├── Gares
├── Véhicules
├── Chauffeurs
├── Propriétaires
├── Fiches
├── Documents
├── Alertes
├── Audit
└── Synchronisation





2. RESPONSABLE_GARE


Ma gare
├── Activité du jour
├── Fiches
├── Passagers
├── Véhicules
├── Chauffeurs
├── Propriétaires
├── Documents
├── Alertes
├── Utilisateurs de la gare
└── Audit de la gare



3. AGENT

Opérations de ma gare
├── Créer fiche
├── Modifier fiche
├── Passagers
├── Véhicules
├── Chauffeurs
├── Documents
├── Alertes
└── Synchronisation


4. CONTROLEUR

Contrôle de ma gare
├── Fiches à contrôler
├── Passagers
├── Véhicules
├── Chauffeurs
├── Documents
├── Alertes
├── Anomalies
└── Synchronisation


5. AUTORITE_HABILITEE

Supervision territoriale
├── Gares
├── Fiches
├── Passagers
├── Véhicules
├── Chauffeurs
├── Mobilité
├── Alertes
├── Anomalies
├── Rapports
└── Audit



                    AGENT       RESPONSABLE      CONTROLEUR
                                      GARE
─────────────────────────────────────────────────────────────
Créer                  ✓              ✓               ✓
Modifier               ✓              ✓               ✓*
Finaliser              ✗              ✓               ✗
Imprimer               ✓              ✓               ✗
Remettre               ✓              ✓               ✗
Réception chauffeur    CHAUFFEUR      CHAUFFEUR       CHAUFFEUR
Chargement             ✓              ✓               ✗
Départ                 ✗              ✓               ✗
Contrôler              ✓              ✓               ✓
Clôturer               ✗              ✓               ✗


1. Les statuts officiels de fiche
BROUILLON
EN_COURS
FINALISEE
IMPRIMEE
REMISE_CHAUFFEUR
RECEPTION_CONFIRME
CHARGEMENT
EN_CIRCULATION
CLOTUREE
ANNULEE


| Statut | Signification |
|---|---|
| `BROUILLON` | Fiche créée mais pas encore commencée |
| `EN_COURS` | Fiche en préparation |
| `FINALISEE` | Responsable de gare a validé la fiche |
| `IMPRIMEE` | Au moins une impression officielle a été effectuée |
| `REMISE_CHAUFFEUR` | Document papier remis physiquement au chauffeur |
| `RECEPTION_CONFIRME` | Chauffeur a confirmé réception |
| `CHARGEMENT` | Préparation physique du véhicule/passagers |
| `EN_CIRCULATION` | Départ confirmé |
| `CLOTUREE` | Déplacement terminé et fiche clôturée |
| `ANNULEE` | Fiche annulée |