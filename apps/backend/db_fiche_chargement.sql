-- FICHE CHARGEMENT PLATFORM
-- PostgreSQL / Supabase - Schema global
-- Version avec proprietaire du vehicule

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS gare (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) NOT NULL UNIQUE,
    nom VARCHAR(150) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    adresse VARCHAR(255),
    statut VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- UTILISATEUR existe deja : id INTEGER, role_id INTEGER, gare_id UUID

CREATE TABLE IF NOT EXISTS proprietaire (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    adresse VARCHAR(255),
    numero_piece_identite VARCHAR(100),
    type_piece_identite VARCHAR(50),
    statut VARCHAR(20) NOT NULL DEFAULT 'ACTIF',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proprietaire_id UUID NOT NULL,
    plaque_immatriculation VARCHAR(30) NOT NULL UNIQUE,
    type VARCHAR(30) NOT NULL,
    marque VARCHAR(80),
    modele VARCHAR(80),
    capacite INTEGER NOT NULL,
    statut VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehicule_proprietaire FOREIGN KEY (proprietaire_id)
        REFERENCES proprietaire(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_vehicule_capacite CHECK (capacite > 0)
);

CREATE TABLE IF NOT EXISTS document_vehicule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicule_id UUID NOT NULL,
    type_document VARCHAR(50) NOT NULL,
    numero_document VARCHAR(100),
    date_delivrance DATE,
    date_expiration DATE NOT NULL,
    statut VARCHAR(20) NOT NULL,
    observations TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_document_vehicule FOREIGN KEY (vehicule_id)
        REFERENCES vehicule(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chk_document_vehicule_dates CHECK (
        date_delivrance IS NULL OR date_expiration >= date_delivrance
    )
);

CREATE TABLE IF NOT EXISTS chauffeur (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(30),
    statut VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_chauffeur (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chauffeur_id UUID NOT NULL,
    type_document VARCHAR(50) NOT NULL,
    numero_document VARCHAR(100),
    date_delivrance DATE,
    date_expiration DATE NOT NULL,
    statut VARCHAR(20) NOT NULL,
    observations TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_document_chauffeur FOREIGN KEY (chauffeur_id)
        REFERENCES chauffeur(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chk_document_chauffeur_dates CHECK (
        date_delivrance IS NULL OR date_expiration >= date_delivrance
    )
);

CREATE TABLE IF NOT EXISTS destination (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) NOT NULL UNIQUE,
    nom VARCHAR(150) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    pays VARCHAR(100) NOT NULL,
    statut VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS itineraire (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID NOT NULL,
    code VARCHAR(30) NOT NULL,
    libelle VARCHAR(150) NOT NULL,
    description TEXT,
    statut VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_itineraire_destination FOREIGN KEY (destination_id)
        REFERENCES destination(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT uq_itineraire_destination_code UNIQUE (destination_id, code)
);

CREATE TABLE IF NOT EXISTS passager (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    numero_cni VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fiche (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(50) NOT NULL UNIQUE,
    gare_id UUID NOT NULL,
    vehicule_id UUID NOT NULL,
    chauffeur_id UUID NOT NULL,
    destination_id UUID NOT NULL,
    itineraire_id UUID,
    createur_id INTEGER NOT NULL,
    finalisateur_id INTEGER,
    annulateur_id INTEGER,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    heure_arrivee_gare TIMESTAMP,
    heure_depart TIMESTAMP,
    heure_arrivee_destination TIMESTAMP,
    date_finalisation TIMESTAMP,
    date_cloture TIMESTAMP,
    date_annulation TIMESTAMP,
    statut VARCHAR(30) NOT NULL,
    motif_annulation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fiche_gare FOREIGN KEY (gare_id) REFERENCES gare(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_fiche_vehicule FOREIGN KEY (vehicule_id) REFERENCES vehicule(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_fiche_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES chauffeur(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_fiche_destination FOREIGN KEY (destination_id) REFERENCES destination(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_fiche_itineraire FOREIGN KEY (itineraire_id) REFERENCES itineraire(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_fiche_createur FOREIGN KEY (createur_id) REFERENCES utilisateur(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_fiche_finalisateur FOREIGN KEY (finalisateur_id) REFERENCES utilisateur(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_fiche_annulateur FOREIGN KEY (annulateur_id) REFERENCES utilisateur(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_fiche_dates CHECK (
        heure_depart IS NULL OR heure_arrivee_gare IS NULL
        OR heure_depart >= heure_arrivee_gare
    )
);

CREATE TABLE IF NOT EXISTS fiche_passager (
    fiche_id UUID NOT NULL,
    passager_id UUID NOT NULL,
    numero_place INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fiche_id, passager_id),
    CONSTRAINT fk_fiche_passager_fiche FOREIGN KEY (fiche_id) REFERENCES fiche(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_fiche_passager_passager FOREIGN KEY (passager_id) REFERENCES passager(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_numero_place CHECK (numero_place IS NULL OR numero_place > 0)
);

CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id INTEGER,
    action VARCHAR(50) NOT NULL,
    entite VARCHAR(50) NOT NULL,
    entite_id UUID NOT NULL,
    date_heure TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ancienne_valeur JSONB,
    nouvelle_valeur JSONB,
    appareil_id VARCHAR(100),
    CONSTRAINT fk_audit_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS alerte_document (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_document VARCHAR(50) NOT NULL,
    document_id UUID NOT NULL,
    proprietaire_type VARCHAR(30) NOT NULL,
    proprietaire_id UUID NOT NULL,
    date_declenchement DATE NOT NULL,
    date_expiration DATE NOT NULL,
    type_alerte VARCHAR(30) NOT NULL,
    statut VARCHAR(20) NOT NULL,
    date_lecture TIMESTAMP,
    utilisateur_lecture INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alerte_utilisateur_lecture FOREIGN KEY (utilisateur_lecture)
        REFERENCES utilisateur(id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT chk_alerte_proprietaire_type CHECK (
        proprietaire_type IN ('CHAUFFEUR', 'VEHICULE')
    ),
    CONSTRAINT chk_alerte_dates CHECK (date_expiration >= date_declenchement)
);

CREATE TABLE IF NOT EXISTS sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    operation VARCHAR(20) NOT NULL,
    payload TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_attempt_at TIMESTAMP,
    last_error TEXT,
    CONSTRAINT chk_sync_retry_count CHECK (retry_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_utilisateur_gare ON utilisateur(gare_id);
CREATE INDEX IF NOT EXISTS idx_utilisateur_role ON utilisateur(role_id);
CREATE INDEX IF NOT EXISTS idx_proprietaire_telephone ON proprietaire(telephone);
CREATE INDEX IF NOT EXISTS idx_vehicule_proprietaire ON vehicule(proprietaire_id);
CREATE INDEX IF NOT EXISTS idx_document_vehicule_vehicule ON document_vehicule(vehicule_id);
CREATE INDEX IF NOT EXISTS idx_document_vehicule_expiration ON document_vehicule(date_expiration);
CREATE INDEX IF NOT EXISTS idx_document_chauffeur_chauffeur ON document_chauffeur(chauffeur_id);
CREATE INDEX IF NOT EXISTS idx_document_chauffeur_expiration ON document_chauffeur(date_expiration);
CREATE INDEX IF NOT EXISTS idx_itineraire_destination ON itineraire(destination_id);
CREATE INDEX IF NOT EXISTS idx_fiche_gare ON fiche(gare_id);
CREATE INDEX IF NOT EXISTS idx_fiche_vehicule ON fiche(vehicule_id);
CREATE INDEX IF NOT EXISTS idx_fiche_chauffeur ON fiche(chauffeur_id);
CREATE INDEX IF NOT EXISTS idx_fiche_destination ON fiche(destination_id);
CREATE INDEX IF NOT EXISTS idx_fiche_statut ON fiche(statut);
CREATE INDEX IF NOT EXISTS idx_audit_utilisateur ON audit_log(utilisateur_id);
CREATE INDEX IF NOT EXISTS idx_audit_entite ON audit_log(entite, entite_id);
CREATE INDEX IF NOT EXISTS idx_alerte_document ON alerte_document(document_id);
CREATE INDEX IF NOT EXISTS idx_alerte_proprietaire ON alerte_document(proprietaire_type, proprietaire_id);
CREATE INDEX IF NOT EXISTS idx_alerte_statut ON alerte_document(statut);
CREATE INDEX IF NOT EXISTS idx_alerte_expiration ON alerte_document(date_expiration);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_entity ON sync_queue(entity_type, entity_id);

COMMIT;
