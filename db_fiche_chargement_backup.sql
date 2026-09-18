--
-- PostgreSQL database dump
--

\restrict vigSSZJ2gayBpPKfW0GhEcNTzO6ESRjPu6nhEu6j5uBKHRUBqVj5rxJtndDbDo8

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
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alerte_document; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.alerte_document OWNER TO postgres;

--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.audit_log OWNER TO postgres;

--
-- Name: chauffeur; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.chauffeur OWNER TO postgres;

--
-- Name: destination; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.destination OWNER TO postgres;

--
-- Name: document_chauffeur; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.document_chauffeur OWNER TO postgres;

--
-- Name: document_vehicule; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.document_vehicule OWNER TO postgres;

--
-- Name: fiche; Type: TABLE; Schema: public; Owner: postgres
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
    statut character varying(30) NOT NULL,
    motif_annulation text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_fiche_dates CHECK (((heure_depart IS NULL) OR (heure_arrivee_gare IS NULL) OR (heure_depart >= heure_arrivee_gare)))
);


ALTER TABLE public.fiche OWNER TO postgres;

--
-- Name: fiche_passager; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fiche_passager (
    fiche_id uuid NOT NULL,
    passager_id uuid NOT NULL,
    numero_place integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_numero_place CHECK (((numero_place IS NULL) OR (numero_place > 0)))
);


ALTER TABLE public.fiche_passager OWNER TO postgres;

--
-- Name: gare; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.gare OWNER TO postgres;

--
-- Name: itineraire; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.itineraire OWNER TO postgres;

--
-- Name: passager; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.passager (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    numero_cni character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.passager OWNER TO postgres;

--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    actif boolean DEFAULT true NOT NULL,
    code character varying(50) NOT NULL,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    description text,
    libelle character varying(100) NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_id_seq OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: sync_queue; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.sync_queue OWNER TO postgres;

--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- Name: utilisateur_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateur_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilisateur_id_seq OWNER TO postgres;

--
-- Name: utilisateur_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateur_id_seq OWNED BY public.utilisateur.id;


--
-- Name: vehicule; Type: TABLE; Schema: public; Owner: postgres
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
    CONSTRAINT chk_vehicule_capacite CHECK ((capacite > 0))
);


ALTER TABLE public.vehicule OWNER TO postgres;

--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: utilisateur id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN id SET DEFAULT nextval('public.utilisateur_id_seq'::regclass);


--
-- Data for Name: alerte_document; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alerte_document (id, type_document, document_id, proprietaire_type, proprietaire_id, date_declenchement, date_expiration, type_alerte, statut, date_lecture, utilisateur_lecture, created_at) FROM stdin;
\.


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_log (id, utilisateur_id, action, entite, entite_id, date_heure, ancienne_valeur, nouvelle_valeur, appareil_id) FROM stdin;
\.


--
-- Data for Name: chauffeur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chauffeur (id, nom, prenom, telephone, statut, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: destination; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.destination (id, code, nom, ville, pays, statut, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: document_chauffeur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_chauffeur (id, chauffeur_id, type_document, numero_document, date_delivrance, date_expiration, statut, observations, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: document_vehicule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_vehicule (id, vehicule_id, type_document, numero_document, date_delivrance, date_expiration, statut, observations, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: fiche; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fiche (id, reference, gare_id, vehicule_id, chauffeur_id, destination_id, itineraire_id, createur_id, finalisateur_id, annulateur_id, date_creation, heure_arrivee_gare, heure_depart, heure_arrivee_destination, date_finalisation, date_cloture, date_annulation, statut, motif_annulation, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: fiche_passager; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fiche_passager (fiche_id, passager_id, numero_place, created_at) FROM stdin;
\.


--
-- Data for Name: gare; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gare (id, code, nom, ville, adresse, statut, created_at, updated_at, latitude, longitude) FROM stdin;
d3b94ae9-279e-43c1-81d7-67d6960734a9	GARE-Eseka	Gare routiere	Eseka	carrefour marche	ACTIVE	2026-09-11 14:04:45.459057	2026-09-11 14:04:45.459057	\N	\N
b85b7387-decd-4626-abac-80e70d08bbda	GARE001	Gare Centrale	Mboumyebel	Carrefour	ACTIF	2026-09-14 05:07:17.067087	2026-09-14 05:16:34.694691	3.848	11.502
550e8400-e29b-41d4-a716-446655440000	GARE01	Gare Centrale	Sherbrooke	123 Rue Principale	ACTIF	2026-09-15 15:40:15.5013	2026-09-15 15:40:15.5013	45.4	-71.9
235765af-4ae3-4688-8f98-e94e58354347	GARE-SYNC-002	Gare Sync Test 2	Sherbrooke	123 Test	ACTIF	2026-09-16 05:50:44.29799	2026-09-16 05:50:44.29799	\N	\N
415e0c29-47fc-4b18-b52e-32615a6c8a32	GARE-SYNC-003	Gare Sync Test 3	Eseka	123 Test 3	INACTIF	2026-09-16 06:03:08.959454	2026-09-16 06:03:08.959454	\N	\N
\.


--
-- Data for Name: itineraire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.itineraire (id, destination_id, code, libelle, description, statut, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: passager; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.passager (id, nom, prenom, numero_cni, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (actif, code, created_at, description, libelle, id) FROM stdin;
t	ADMIN	2026-08-24 12:44:03.674447	AccŠs total	Administrateur	1
t	CONTROLEUR	2026-08-26 19:04:47.106601	Gestionnaire des fiches de chargement sur mobile	Contr“leur de Gare	2
t	AGENT	2026-08-27 15:04:35.042205	Agent charg‚ des op‚rations courantes	Agent	6
t	RESPONSABLE_GARE	2026-08-27 15:05:20.300591	Responsable de la gestion d'une gare	Responsable de gare	7
t	AUTORITE_HABILITEE	2026-08-27 15:06:01.03505	Autorit‚ disposant de droits de contr“le	Autorit‚ habilit‚e	8
\.


--
-- Data for Name: sync_queue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sync_queue (id, entity_type, entity_id, operation, payload, status, retry_count, created_at, last_attempt_at, last_error) FROM stdin;
\.


--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateur (actif, bloque, created_at, email, last_login_at, nom, password_hash, prenom, telephone, updated_at, username, id, gare_id, role_id) FROM stdin;
t	f	2026-08-24 12:44:16.116101	admin@gare.com	\N	Super	$2b$10$xHe0wx4r9HxuiAYEEd/haeN8uzDSo3VXEkXJjScClPPeXsTv9KJXG	Admin	+243000000000	2026-09-02 11:18:28.807072	admin	1	\N	1
t	f	2026-09-11 15:11:44.183937	admin2@gare.com	2026-09-16 05:48:42.981	Administrateur	$2b$10$LaDjxk.z2/VLNzIHSaGfOuE4vzYzyD1KPYsnWVEH6bVVks9TTgp3G	Test	\N	2026-09-16 05:48:43.023373	admin2	3	\N	1
t	f	2026-08-26 19:06:48.180316	jean.kameni@gare.com	2026-09-13 03:48:37.645	Kameni	$2b$10$nMaPWZEtxu0aR66bj4Bcw.mG8og5dIhpa3QE9yhaxVkx6EBIvtLNC	Jean	+243810000001	2026-09-13 03:48:37.649002	controleur1	2	d3b94ae9-279e-43c1-81d7-67d6960734a9	2
t	f	2026-09-11 15:30:38.609346	agent1@gare.com	2026-09-13 04:13:42.966	Agent	$2b$10$/pPQB0s4mQRfVnYuXRQ9cuyWMbgh72UotnLYd.bEKcEuZnKqFzRsa	Test	\N	2026-09-13 04:13:42.969879	agent1	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	6
t	f	2026-09-11 15:45:33.834643	autorite1@gare.com	2026-09-13 11:02:17.095	AUTORITE_HABILITE	$2b$10$7EYBJFxWfszGGFGi6gHL/.QLXPtyBIsg5hLD0gu5AB9hfCRGk3Wjm	Test	\N	2026-09-13 11:02:17.103142	autorite1	5	d3b94ae9-279e-43c1-81d7-67d6960734a9	8
\.


--
-- Data for Name: vehicule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicule (id, plaque_immatriculation, type, marque, modele, capacite, statut, created_at, updated_at) FROM stdin;
\.


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 8, true);


--
-- Name: utilisateur_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateur_id_seq', 10, true);


--
-- Name: utilisateur PK_838f0f99fe900e49ef050030443; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "PK_838f0f99fe900e49ef050030443" PRIMARY KEY (id);


--
-- Name: role PK_b36bcfe02fc8de3c57a8b2391c2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id);


--
-- Name: alerte_document alerte_document_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerte_document
    ADD CONSTRAINT alerte_document_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: chauffeur chauffeur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chauffeur
    ADD CONSTRAINT chauffeur_pkey PRIMARY KEY (id);


--
-- Name: destination destination_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_code_key UNIQUE (code);


--
-- Name: destination destination_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_pkey PRIMARY KEY (id);


--
-- Name: document_chauffeur document_chauffeur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_chauffeur
    ADD CONSTRAINT document_chauffeur_pkey PRIMARY KEY (id);


--
-- Name: document_vehicule document_vehicule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_vehicule
    ADD CONSTRAINT document_vehicule_pkey PRIMARY KEY (id);


--
-- Name: fiche_passager fiche_passager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_passager
    ADD CONSTRAINT fiche_passager_pkey PRIMARY KEY (fiche_id, passager_id);


--
-- Name: fiche fiche_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fiche_pkey PRIMARY KEY (id);


--
-- Name: fiche fiche_reference_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fiche_reference_key UNIQUE (reference);


--
-- Name: gare gare_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gare
    ADD CONSTRAINT gare_code_key UNIQUE (code);


--
-- Name: gare gare_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gare
    ADD CONSTRAINT gare_pkey PRIMARY KEY (id);


--
-- Name: itineraire itineraire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itineraire
    ADD CONSTRAINT itineraire_pkey PRIMARY KEY (id);


--
-- Name: passager passager_numero_cni_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passager
    ADD CONSTRAINT passager_numero_cni_key UNIQUE (numero_cni);


--
-- Name: passager passager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passager
    ADD CONSTRAINT passager_pkey PRIMARY KEY (id);


--
-- Name: sync_queue sync_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync_queue
    ADD CONSTRAINT sync_queue_pkey PRIMARY KEY (id);


--
-- Name: role ukc36say97xydpmgigg38qv5l2p; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT ukc36say97xydpmgigg38qv5l2p UNIQUE (code);


--
-- Name: utilisateur ukkq7nt5wyq9v9lpcpgxag2f24a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT ukkq7nt5wyq9v9lpcpgxag2f24a UNIQUE (username);


--
-- Name: utilisateur ukrma38wvnqfaf66vvmi57c71lo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT ukrma38wvnqfaf66vvmi57c71lo UNIQUE (email);


--
-- Name: itineraire uq_itineraire_destination_code; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itineraire
    ADD CONSTRAINT uq_itineraire_destination_code UNIQUE (destination_id, code);


--
-- Name: vehicule vehicule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicule
    ADD CONSTRAINT vehicule_pkey PRIMARY KEY (id);


--
-- Name: vehicule vehicule_plaque_immatriculation_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicule
    ADD CONSTRAINT vehicule_plaque_immatriculation_key UNIQUE (plaque_immatriculation);


--
-- Name: idx_alerte_document; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerte_document ON public.alerte_document USING btree (document_id);


--
-- Name: idx_alerte_expiration; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerte_expiration ON public.alerte_document USING btree (date_expiration);


--
-- Name: idx_alerte_proprietaire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerte_proprietaire ON public.alerte_document USING btree (proprietaire_type, proprietaire_id);


--
-- Name: idx_alerte_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerte_statut ON public.alerte_document USING btree (statut);


--
-- Name: idx_audit_entite; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_entite ON public.audit_log USING btree (entite, entite_id);


--
-- Name: idx_audit_utilisateur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_utilisateur ON public.audit_log USING btree (utilisateur_id);


--
-- Name: idx_document_chauffeur_chauffeur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_chauffeur_chauffeur ON public.document_chauffeur USING btree (chauffeur_id);


--
-- Name: idx_document_chauffeur_expiration; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_chauffeur_expiration ON public.document_chauffeur USING btree (date_expiration);


--
-- Name: idx_document_vehicule_expiration; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_vehicule_expiration ON public.document_vehicule USING btree (date_expiration);


--
-- Name: idx_document_vehicule_vehicule; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_vehicule_vehicule ON public.document_vehicule USING btree (vehicule_id);


--
-- Name: idx_fiche_chauffeur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_chauffeur ON public.fiche USING btree (chauffeur_id);


--
-- Name: idx_fiche_destination; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_destination ON public.fiche USING btree (destination_id);


--
-- Name: idx_fiche_gare; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_gare ON public.fiche USING btree (gare_id);


--
-- Name: idx_fiche_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_statut ON public.fiche USING btree (statut);


--
-- Name: idx_fiche_vehicule; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_vehicule ON public.fiche USING btree (vehicule_id);


--
-- Name: idx_itineraire_destination; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_itineraire_destination ON public.itineraire USING btree (destination_id);


--
-- Name: idx_sync_queue_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sync_queue_entity ON public.sync_queue USING btree (entity_type, entity_id);


--
-- Name: idx_sync_queue_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sync_queue_status ON public.sync_queue USING btree (status);


--
-- Name: idx_utilisateur_gare; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utilisateur_gare ON public.utilisateur USING btree (gare_id);


--
-- Name: idx_utilisateur_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utilisateur_role ON public.utilisateur USING btree (role_id);


--
-- Name: utilisateur FK_332c39ebc87e25e15a3e80aab48; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "FK_332c39ebc87e25e15a3e80aab48" FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: alerte_document fk_alerte_utilisateur_lecture; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerte_document
    ADD CONSTRAINT fk_alerte_utilisateur_lecture FOREIGN KEY (utilisateur_lecture) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: audit_log fk_audit_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT fk_audit_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: document_chauffeur fk_document_chauffeur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_chauffeur
    ADD CONSTRAINT fk_document_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES public.chauffeur(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: document_vehicule fk_document_vehicule; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_vehicule
    ADD CONSTRAINT fk_document_vehicule FOREIGN KEY (vehicule_id) REFERENCES public.vehicule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fiche fk_fiche_annulateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_annulateur FOREIGN KEY (annulateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_chauffeur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES public.chauffeur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_createur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_createur FOREIGN KEY (createur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_destination; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_destination FOREIGN KEY (destination_id) REFERENCES public.destination(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_finalisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_finalisateur FOREIGN KEY (finalisateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_gare; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_itineraire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_itineraire FOREIGN KEY (itineraire_id) REFERENCES public.itineraire(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fiche_passager fk_fiche_passager_fiche; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_passager
    ADD CONSTRAINT fk_fiche_passager_fiche FOREIGN KEY (fiche_id) REFERENCES public.fiche(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fiche_passager fk_fiche_passager_passager; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_passager
    ADD CONSTRAINT fk_fiche_passager_passager FOREIGN KEY (passager_id) REFERENCES public.passager(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fiche fk_fiche_vehicule; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_vehicule FOREIGN KEY (vehicule_id) REFERENCES public.vehicule(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: itineraire fk_itineraire_destination; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itineraire
    ADD CONSTRAINT fk_itineraire_destination FOREIGN KEY (destination_id) REFERENCES public.destination(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: utilisateur fk_utilisateur_gare; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT fk_utilisateur_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict vigSSZJ2gayBpPKfW0GhEcNTzO6ESRjPu6nhEu6j5uBKHRUBqVj5rxJtndDbDo8

