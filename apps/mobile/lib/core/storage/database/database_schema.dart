class DatabaseSchema {
  DatabaseSchema._();

  static const int version = 2;

  // ============================================================
  // GARE
  // ============================================================

  static const String createGareTable = '''
  CREATE TABLE gare (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    nom TEXT NOT NULL,
    ville TEXT NOT NULL,
    adresse TEXT,
    statut TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
''';

  // ============================================================
  // VEHICULE
  // ============================================================

  static const String createVehiculeTable = '''
    CREATE TABLE vehicule (
      id TEXT PRIMARY KEY,
      plaque_immatriculation TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      marque TEXT,
      modele TEXT,
      capacite INTEGER NOT NULL CHECK (capacite > 0),
      statut TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  ''';

  // ============================================================
  // DOCUMENT VEHICULE
  // ============================================================

  static const String createDocumentVehiculeTable = '''
    CREATE TABLE document_vehicule (
      id TEXT PRIMARY KEY,
      vehicule_id TEXT NOT NULL,
      type_document TEXT NOT NULL,
      numero_document TEXT,
      date_delivrance TEXT,
      date_expiration TEXT NOT NULL,
      statut TEXT NOT NULL,
      observations TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,

      FOREIGN KEY (vehicule_id)
        REFERENCES vehicule(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

      CHECK (
        date_delivrance IS NULL
        OR date_expiration >= date_delivrance
      )
    )
  ''';

  // ============================================================
  // CHAUFFEUR
  // ============================================================

  static const String createChauffeurTable = '''
    CREATE TABLE chauffeur (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      telephone TEXT,
      statut TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  ''';

  // ============================================================
  // DOCUMENT CHAUFFEUR
  // ============================================================

  static const String createDocumentChauffeurTable = '''
    CREATE TABLE document_chauffeur (
      id TEXT PRIMARY KEY,
      chauffeur_id TEXT NOT NULL,
      type_document TEXT NOT NULL,
      numero_document TEXT,
      date_delivrance TEXT,
      date_expiration TEXT NOT NULL,
      statut TEXT NOT NULL,
      observations TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,

      FOREIGN KEY (chauffeur_id)
        REFERENCES chauffeur(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

      CHECK (
        date_delivrance IS NULL
        OR date_expiration >= date_delivrance
      )
    )
  ''';

  // ============================================================
  // DESTINATION
  // ============================================================

  static const String createDestinationTable = '''
    CREATE TABLE destination (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      nom TEXT NOT NULL,
      ville TEXT NOT NULL,
      pays TEXT NOT NULL,
      statut TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  ''';

  // ============================================================
  // ITINERAIRE
  // ============================================================

  static const String createItineraireTable = '''
    CREATE TABLE itineraire (
      id TEXT PRIMARY KEY,
      destination_id TEXT NOT NULL,
      code TEXT NOT NULL,
      libelle TEXT NOT NULL,
      description TEXT,
      statut TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,

      FOREIGN KEY (destination_id)
        REFERENCES destination(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

      UNIQUE (destination_id, code)
    )
  ''';

  // ============================================================
  // PASSAGER
  // ============================================================

  static const String createPassagerTable = '''
    CREATE TABLE passager (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      numero_cni TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  ''';

  // ============================================================
  // FICHE
  // ============================================================

  static const String createFicheTable = '''
    CREATE TABLE fiche (
      id TEXT PRIMARY KEY,
      reference TEXT NOT NULL UNIQUE,

      gare_id TEXT NOT NULL,
      vehicule_id TEXT NOT NULL,
      chauffeur_id TEXT NOT NULL,
      destination_id TEXT NOT NULL,
      itineraire_id TEXT,

      createur_id INTEGER NOT NULL,
      finalisateur_id INTEGER,
      annulateur_id INTEGER,

      date_creation TEXT NOT NULL,
      heure_arrivee_gare TEXT,
      heure_depart TEXT,
      heure_arrivee_destination TEXT,

      date_finalisation TEXT,
      date_cloture TEXT,
      date_annulation TEXT,

      statut TEXT NOT NULL,
      motif_annulation TEXT,

      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,

      FOREIGN KEY (gare_id)
        REFERENCES gare(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

      FOREIGN KEY (vehicule_id)
        REFERENCES vehicule(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

      FOREIGN KEY (chauffeur_id)
        REFERENCES chauffeur(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

      FOREIGN KEY (destination_id)
        REFERENCES destination(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

      FOREIGN KEY (itineraire_id)
        REFERENCES itineraire(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

      CHECK (
        heure_depart IS NULL
        OR heure_arrivee_gare IS NULL
        OR heure_depart >= heure_arrivee_gare
      )
    )
  ''';

  // ============================================================
  // FICHE PASSAGER
  // ============================================================

  static const String createFichePassagerTable = '''
    CREATE TABLE fiche_passager (
      fiche_id TEXT NOT NULL,
      passager_id TEXT NOT NULL,

      numero_place INTEGER,

      created_at TEXT NOT NULL,

      PRIMARY KEY (fiche_id, passager_id),

      FOREIGN KEY (fiche_id)
        REFERENCES fiche(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

      FOREIGN KEY (passager_id)
        REFERENCES passager(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

      CHECK (
        numero_place IS NULL
        OR numero_place > 0
      )
    )
  ''';

  // ============================================================
  // AUDIT LOG
  // ============================================================

  static const String createAuditLogTable = '''
    CREATE TABLE audit_log (
      id TEXT PRIMARY KEY,

      utilisateur_id INTEGER,

      action TEXT NOT NULL,
      entite TEXT NOT NULL,
      entite_id TEXT NOT NULL,

      date_heure TEXT NOT NULL,

      ancienne_valeur TEXT,
      nouvelle_valeur TEXT,

      appareil_id TEXT
    )
  ''';

  // ============================================================
  // ALERTE DOCUMENT
  // ============================================================

  static const String createAlerteDocumentTable = '''
    CREATE TABLE alerte_document (
      id TEXT PRIMARY KEY,

      type_document TEXT NOT NULL,

      document_id TEXT NOT NULL,

      proprietaire_type TEXT NOT NULL,
      proprietaire_id TEXT NOT NULL,

      date_declenchement TEXT NOT NULL,
      date_expiration TEXT NOT NULL,

      type_alerte TEXT NOT NULL,
      statut TEXT NOT NULL,

      date_lecture TEXT,
      utilisateur_lecture INTEGER,

      created_at TEXT NOT NULL,

      CHECK (
        proprietaire_type IN ('CHAUFFEUR', 'VEHICULE')
      ),

      CHECK (
        date_expiration >= date_declenchement
      )
    )
  ''';

  // ============================================================
  // SYNC QUEUE
  // ============================================================

  static const String createSyncQueueTable = '''
    CREATE TABLE sync_queue (
      id TEXT PRIMARY KEY,

      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,

      operation TEXT NOT NULL,

      payload TEXT NOT NULL,

      status TEXT NOT NULL,

      retry_count INTEGER NOT NULL DEFAULT 0,

      created_at TEXT NOT NULL,

      last_attempt_at TEXT,

      last_error TEXT,

      CHECK (retry_count >= 0)
    )
  ''';

  // ============================================================
  // INDEX
  // ============================================================

  static const List<String> createIndexes = [
    '''
    CREATE INDEX idx_document_vehicule_vehicule
    ON document_vehicule(vehicule_id)
    ''',

    '''
    CREATE INDEX idx_document_vehicule_expiration
    ON document_vehicule(date_expiration)
    ''',

    '''
    CREATE INDEX idx_document_chauffeur_chauffeur
    ON document_chauffeur(chauffeur_id)
    ''',

    '''
    CREATE INDEX idx_document_chauffeur_expiration
    ON document_chauffeur(date_expiration)
    ''',

    '''
    CREATE INDEX idx_itineraire_destination
    ON itineraire(destination_id)
    ''',

    '''
    CREATE INDEX idx_fiche_gare
    ON fiche(gare_id)
    ''',

    '''
    CREATE INDEX idx_fiche_vehicule
    ON fiche(vehicule_id)
    ''',

    '''
    CREATE INDEX idx_fiche_chauffeur
    ON fiche(chauffeur_id)
    ''',

    '''
    CREATE INDEX idx_fiche_destination
    ON fiche(destination_id)
    ''',

    '''
    CREATE INDEX idx_fiche_statut
    ON fiche(statut)
    ''',

    '''
    CREATE INDEX idx_audit_utilisateur
    ON audit_log(utilisateur_id)
    ''',

    '''
    CREATE INDEX idx_audit_entite
    ON audit_log(entite, entite_id)
    ''',

    '''
    CREATE INDEX idx_alerte_document
    ON alerte_document(document_id)
    ''',

    '''
    CREATE INDEX idx_alerte_proprietaire
    ON alerte_document(proprietaire_type, proprietaire_id)
    ''',

    '''
    CREATE INDEX idx_alerte_statut
    ON alerte_document(statut)
    ''',

    '''
    CREATE INDEX idx_alerte_expiration
    ON alerte_document(date_expiration)
    ''',

    '''
    CREATE INDEX idx_sync_queue_status
    ON sync_queue(status)
    ''',

    '''
    CREATE INDEX idx_sync_queue_entity
    ON sync_queue(entity_type, entity_id)
    ''',
  ];

  // ============================================================
  // TABLES
  // ============================================================

  static const List<String> createTables = [
    createGareTable,
    createVehiculeTable,
    createDocumentVehiculeTable,
    createChauffeurTable,
    createDocumentChauffeurTable,
    createDestinationTable,
    createItineraireTable,
    createPassagerTable,
    createFicheTable,
    createFichePassagerTable,
    createAuditLogTable,
    createAlerteDocumentTable,
    createSyncQueueTable,
  ];
}
