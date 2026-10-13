--
-- PostgreSQL database dump
--

\restrict t3yphd6TgqcmuxVb9BaIfJXfaNRrmngAW0vAydNlKJ8sYORnPfPJ6BPXL4nMCjR

-- Dumped from database version 15.19
-- Dumped by pg_dump version 15.19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: fiche_statut; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.fiche_statut AS ENUM (
    'BROUILLON',
    'EN_ATTENTE',
    'EN_COURS',
    'FINALISEE',
    'IMPRIMEE',
    'REMISE_CHAUFFEUR',
    'RECEPTION_CONFIRME',
    'CHARGEMENT',
    'EN_CIRCULATION',
    'CLOTUREE',
    'ANNULEE'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alerte_document; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alerte_document (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type_document character varying(50) NOT NULL,
    document_id uuid NOT NULL,
    proprietaire_type character varying(30) NOT NULL,
    proprietaire_id uuid NOT NULL,
    date_declenchement date NOT NULL,
    date_expiration date NOT NULL,
    type_alerte character varying(30) NOT NULL,
    statut character varying(20) NOT NULL,
    date_lecture timestamp without time zone,
    utilisateur_lecture integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_alerte_dates CHECK ((date_expiration >= date_declenchement)),
    CONSTRAINT chk_alerte_proprietaire_type CHECK (((proprietaire_type)::text = ANY ((ARRAY['CHAUFFEUR'::character varying, 'VEHICULE'::character varying])::text[])))
);


--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    utilisateur_id integer,
    action character varying(50) NOT NULL,
    entite character varying(50) NOT NULL,
    entite_id uuid NOT NULL,
    date_heure timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ancienne_valeur jsonb,
    nouvelle_valeur jsonb,
    appareil_id character varying(100)
);


--
-- Name: chauffeur; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chauffeur (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    telephone character varying(30),
    statut character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: destination; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.destination (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(30) NOT NULL,
    nom character varying(150) NOT NULL,
    ville character varying(100) NOT NULL,
    pays character varying(100) NOT NULL,
    statut character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: document_chauffeur; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_chauffeur (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chauffeur_id uuid NOT NULL,
    type_document character varying(50) NOT NULL,
    numero_document character varying(100),
    date_delivrance date,
    date_expiration date NOT NULL,
    statut character varying(20) NOT NULL,
    observations text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_document_chauffeur_dates CHECK (((date_delivrance IS NULL) OR (date_expiration >= date_delivrance)))
);


--
-- Name: document_vehicule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_vehicule (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    vehicule_id uuid NOT NULL,
    type_document character varying(50) NOT NULL,
    numero_document character varying(100),
    date_delivrance date,
    date_expiration date NOT NULL,
    statut character varying(20) NOT NULL,
    observations text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_document_vehicule_dates CHECK (((date_delivrance IS NULL) OR (date_expiration >= date_delivrance)))
);


--
-- Name: fiche; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fiche (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reference character varying(50) NOT NULL,
    gare_id uuid NOT NULL,
    vehicule_id uuid NOT NULL,
    chauffeur_id uuid NOT NULL,
    destination_id uuid NOT NULL,
    itineraire_id uuid,
    createur_id integer NOT NULL,
    finalisateur_id integer,
    annulateur_id integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    heure_arrivee_gare timestamp without time zone,
    heure_depart timestamp without time zone,
    heure_arrivee_destination timestamp without time zone,
    date_finalisation timestamp without time zone,
    date_cloture timestamp without time zone,
    date_annulation timestamp without time zone,
    statut public.fiche_statut DEFAULT 'BROUILLON'::public.fiche_statut NOT NULL,
    motif_annulation text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_reception_chauffeur timestamp without time zone,
    date_chargement timestamp without time zone,
    date_vehicule_rempli timestamp without time zone,
    date_passagers_installes timestamp without time zone,
    CONSTRAINT chk_fiche_dates CHECK (((heure_depart IS NULL) OR (heure_arrivee_gare IS NULL) OR (heure_depart >= heure_arrivee_gare)))
);


--
-- Name: fiche_impression; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fiche_impression (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fiche_id uuid NOT NULL,
    imprimeur_id integer NOT NULL,
    date_impression timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    numero_exemplaire integer DEFAULT 1 NOT NULL,
    motif_reimpression text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_fiche_impression_numero CHECK ((numero_exemplaire > 0))
);


--
-- Name: fiche_passager; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fiche_passager (
    fiche_id uuid NOT NULL,
    passager_id uuid NOT NULL,
    numero_place integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tarif numeric(10,2),
    observations text,
    CONSTRAINT chk_numero_place CHECK (((numero_place IS NULL) OR (numero_place > 0)))
);


--
-- Name: fiche_remise; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fiche_remise (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fiche_id uuid NOT NULL,
    remise_par_id integer NOT NULL,
    date_remise timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    observation text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: gare; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gare (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(30) NOT NULL,
    nom character varying(150) NOT NULL,
    ville character varying(100) NOT NULL,
    adresse character varying(255),
    statut character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    latitude double precision,
    longitude double precision
);


--
-- Name: itineraire; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.itineraire (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    destination_id uuid NOT NULL,
    code character varying(30) NOT NULL,
    libelle character varying(150) NOT NULL,
    description text,
    statut character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: passager; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.passager (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    numero_cni character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    telephone character varying(30)
);


--
-- Name: proprietaire; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proprietaire (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    telephone character varying(30) NOT NULL,
    adresse character varying(255),
    numero_piece_identite character varying(100),
    type_piece_identite character varying(50),
    statut character varying(20) DEFAULT 'ACTIF'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: refresh_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_token (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token_hash character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    revoked_at timestamp without time zone,
    replaced_by_token_id integer,
    user_agent character varying(500),
    ip_address character varying(45),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: refresh_token_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refresh_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refresh_token_id_seq OWNED BY public.refresh_token.id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role (
    actif boolean DEFAULT true NOT NULL,
    code character varying(50) NOT NULL,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    description text,
    libelle character varying(100) NOT NULL,
    id integer NOT NULL
);


--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: sync_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sync_queue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id uuid NOT NULL,
    operation character varying(20) NOT NULL,
    payload text NOT NULL,
    status character varying(20) NOT NULL,
    retry_count integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_attempt_at timestamp without time zone,
    last_error text,
    CONSTRAINT chk_sync_retry_count CHECK ((retry_count >= 0))
);


--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.utilisateur (
    actif boolean DEFAULT true NOT NULL,
    bloque boolean DEFAULT false NOT NULL,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    email character varying(100) NOT NULL,
    last_login_at timestamp(6) without time zone,
    nom character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    prenom character varying(100) NOT NULL,
    telephone character varying(20),
    updated_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    username character varying(50) NOT NULL,
    id integer NOT NULL,
    gare_id uuid,
    role_id integer
);


--
-- Name: utilisateur_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.utilisateur_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: utilisateur_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.utilisateur_id_seq OWNED BY public.utilisateur.id;


--
-- Name: vehicule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicule (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    plaque_immatriculation character varying(30) NOT NULL,
    type character varying(30) NOT NULL,
    marque character varying(80),
    modele character varying(80),
    capacite integer NOT NULL,
    statut character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    proprietaire_id uuid,
    CONSTRAINT chk_vehicule_capacite CHECK ((capacite > 0))
);


--
-- Name: refresh_token id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_token ALTER COLUMN id SET DEFAULT nextval('public.refresh_token_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: utilisateur id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN id SET DEFAULT nextval('public.utilisateur_id_seq'::regclass);


--
-- Name: utilisateur PK_838f0f99fe900e49ef050030443; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "PK_838f0f99fe900e49ef050030443" PRIMARY KEY (id);


--
-- Name: role PK_b36bcfe02fc8de3c57a8b2391c2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id);


--
-- Name: alerte_document alerte_document_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerte_document
    ADD CONSTRAINT alerte_document_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: chauffeur chauffeur_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chauffeur
    ADD CONSTRAINT chauffeur_pkey PRIMARY KEY (id);


--
-- Name: destination destination_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_code_key UNIQUE (code);


--
-- Name: destination destination_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_pkey PRIMARY KEY (id);


--
-- Name: document_chauffeur document_chauffeur_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_chauffeur
    ADD CONSTRAINT document_chauffeur_pkey PRIMARY KEY (id);


--
-- Name: document_vehicule document_vehicule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_vehicule
    ADD CONSTRAINT document_vehicule_pkey PRIMARY KEY (id);


--
-- Name: fiche_impression fiche_impression_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche_impression
    ADD CONSTRAINT fiche_impression_pkey PRIMARY KEY (id);


--
-- Name: fiche_passager fiche_passager_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche_passager
    ADD CONSTRAINT fiche_passager_pkey PRIMARY KEY (fiche_id, passager_id);


--
-- Name: fiche fiche_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fiche_pkey PRIMARY KEY (id);


--
-- Name: fiche fiche_reference_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fiche_reference_key UNIQUE (reference);


--
-- Name: fiche_remise fiche_remise_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche_remise
    ADD CONSTRAINT fiche_remise_pkey PRIMARY KEY (id);


--
-- Name: gare gare_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gare
    ADD CONSTRAINT gare_code_key UNIQUE (code);


--
-- Name: gare gare_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gare
    ADD CONSTRAINT gare_pkey PRIMARY KEY (id);


--
-- Name: itineraire itineraire_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.itineraire
    ADD CONSTRAINT itineraire_pkey PRIMARY KEY (id);


--
-- Name: passager passager_numero_cni_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passager
    ADD CONSTRAINT passager_numero_cni_key UNIQUE (numero_cni);


--
-- Name: passager passager_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passager
    ADD CONSTRAINT passager_pkey PRIMARY KEY (id);


--
-- Name: proprietaire proprietaire_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proprietaire
    ADD CONSTRAINT proprietaire_pkey PRIMARY KEY (id);


--
-- Name: refresh_token refresh_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_pkey PRIMARY KEY (id);


--
-- Name: refresh_token refresh_token_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_token_hash_key UNIQUE (token_hash);


--
-- Name: sync_queue sync_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sync_queue
    ADD CONSTRAINT sync_queue_pkey PRIMARY KEY (id);


--
-- Name: role ukc36say97xydpmgigg38qv5l2p; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT ukc36say97xydpmgigg38qv5l2p UNIQUE (code);


--
-- Name: utilisateur ukkq7nt5wyq9v9lpcpgxag2f24a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT ukkq7nt5wyq9v9lpcpgxag2f24a UNIQUE (username);


--
-- Name: utilisateur ukrma38wvnqfaf66vvmi57c71lo; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT ukrma38wvnqfaf66vvmi57c71lo UNIQUE (email);


--
-- Name: itineraire uq_itineraire_destination_code; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.itineraire
    ADD CONSTRAINT uq_itineraire_destination_code UNIQUE (destination_id, code);


--
-- Name: vehicule vehicule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicule
    ADD CONSTRAINT vehicule_pkey PRIMARY KEY (id);


--
-- Name: vehicule vehicule_plaque_immatriculation_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicule
    ADD CONSTRAINT vehicule_plaque_immatriculation_key UNIQUE (plaque_immatriculation);


--
-- Name: idx_alerte_document; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alerte_document ON public.alerte_document USING btree (document_id);


--
-- Name: idx_alerte_expiration; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alerte_expiration ON public.alerte_document USING btree (date_expiration);


--
-- Name: idx_alerte_proprietaire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alerte_proprietaire ON public.alerte_document USING btree (proprietaire_type, proprietaire_id);


--
-- Name: idx_alerte_statut; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alerte_statut ON public.alerte_document USING btree (statut);


--
-- Name: idx_audit_entite; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_entite ON public.audit_log USING btree (entite, entite_id);


--
-- Name: idx_audit_utilisateur; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_utilisateur ON public.audit_log USING btree (utilisateur_id);


--
-- Name: idx_document_chauffeur_chauffeur; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_document_chauffeur_chauffeur ON public.document_chauffeur USING btree (chauffeur_id);


--
-- Name: idx_document_chauffeur_expiration; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_document_chauffeur_expiration ON public.document_chauffeur USING btree (date_expiration);


--
-- Name: idx_document_vehicule_expiration; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_document_vehicule_expiration ON public.document_vehicule USING btree (date_expiration);


--
-- Name: idx_document_vehicule_vehicule; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_document_vehicule_vehicule ON public.document_vehicule USING btree (vehicule_id);


--
-- Name: idx_fiche_chauffeur; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fiche_chauffeur ON public.fiche USING btree (chauffeur_id);


--
-- Name: idx_fiche_destination; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fiche_destination ON public.fiche USING btree (destination_id);


--
-- Name: idx_fiche_gare; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fiche_gare ON public.fiche USING btree (gare_id);


--
-- Name: idx_fiche_statut; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fiche_statut ON public.fiche USING btree (statut);


--
-- Name: idx_fiche_vehicule; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fiche_vehicule ON public.fiche USING btree (vehicule_id);


--
-- Name: idx_itineraire_destination; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_itineraire_destination ON public.itineraire USING btree (destination_id);


--
-- Name: idx_proprietaire_telephone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_proprietaire_telephone ON public.proprietaire USING btree (telephone);


--
-- Name: idx_refresh_token_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refresh_token_expires_at ON public.refresh_token USING btree (expires_at);


--
-- Name: idx_refresh_token_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refresh_token_user ON public.refresh_token USING btree (user_id);


--
-- Name: idx_sync_queue_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sync_queue_entity ON public.sync_queue USING btree (entity_type, entity_id);


--
-- Name: idx_sync_queue_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sync_queue_status ON public.sync_queue USING btree (status);


--
-- Name: idx_utilisateur_gare; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_utilisateur_gare ON public.utilisateur USING btree (gare_id);


--
-- Name: idx_utilisateur_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_utilisateur_role ON public.utilisateur USING btree (role_id);


--
-- Name: idx_vehicule_proprietaire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vehicule_proprietaire ON public.vehicule USING btree (proprietaire_id);


--
-- Name: utilisateur FK_332c39ebc87e25e15a3e80aab48; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "FK_332c39ebc87e25e15a3e80aab48" FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: alerte_document fk_alerte_utilisateur_lecture; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerte_document
    ADD CONSTRAINT fk_alerte_utilisateur_lecture FOREIGN KEY (utilisateur_lecture) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: audit_log fk_audit_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT fk_audit_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: document_chauffeur fk_document_chauffeur; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_chauffeur
    ADD CONSTRAINT fk_document_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES public.chauffeur(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: document_vehicule fk_document_vehicule; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_vehicule
    ADD CONSTRAINT fk_document_vehicule FOREIGN KEY (vehicule_id) REFERENCES public.vehicule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fiche fk_fiche_annulateur; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_annulateur FOREIGN KEY (annulateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_chauffeur; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES public.chauffeur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_createur; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_createur FOREIGN KEY (createur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_destination; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_destination FOREIGN KEY (destination_id) REFERENCES public.destination(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_finalisateur; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_finalisateur FOREIGN KEY (finalisateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_gare; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche_impression fk_fiche_impression_fiche; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche_impression
    ADD CONSTRAINT fk_fiche_impression_fiche FOREIGN KEY (fiche_id) REFERENCES public.fiche(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche_impression fk_fiche_impression_imprimeur; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche_impression
    ADD CONSTRAINT fk_fiche_impression_imprimeur FOREIGN KEY (imprimeur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_itineraire; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_itineraire FOREIGN KEY (itineraire_id) REFERENCES public.itineraire(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fiche_passager fk_fiche_passager_fiche; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche_passager
    ADD CONSTRAINT fk_fiche_passager_fiche FOREIGN KEY (fiche_id) REFERENCES public.fiche(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fiche_passager fk_fiche_passager_passager; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche_passager
    ADD CONSTRAINT fk_fiche_passager_passager FOREIGN KEY (passager_id) REFERENCES public.passager(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche_remise fk_fiche_remise_fiche; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche_remise
    ADD CONSTRAINT fk_fiche_remise_fiche FOREIGN KEY (fiche_id) REFERENCES public.fiche(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche_remise fk_fiche_remise_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche_remise
    ADD CONSTRAINT fk_fiche_remise_utilisateur FOREIGN KEY (remise_par_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_vehicule; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_vehicule FOREIGN KEY (vehicule_id) REFERENCES public.vehicule(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: itineraire fk_itineraire_destination; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.itineraire
    ADD CONSTRAINT fk_itineraire_destination FOREIGN KEY (destination_id) REFERENCES public.destination(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: refresh_token fk_refresh_token_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: utilisateur fk_utilisateur_gare; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT fk_utilisateur_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: vehicule fk_vehicule_proprietaire; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicule
    ADD CONSTRAINT fk_vehicule_proprietaire FOREIGN KEY (proprietaire_id) REFERENCES public.proprietaire(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict t3yphd6TgqcmuxVb9BaIfJXfaNRrmngAW0vAydNlKJ8sYORnPfPJ6BPXL4nMCjR

