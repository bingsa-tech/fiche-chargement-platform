--
-- PostgreSQL database dump
--

\restrict iMfo1l2TOZIHarabUyx1eWfN3EBv4YPabyPNarh4hESlFjPoBIU6nbS3ZqhoKFG

-- Dumped from database version 15.19
-- Dumped by pg_dump version 15.19

-- Started on 2026-11-07 08:32:46

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
-- TOC entry 2 (class 3079 OID 16458)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 3670 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 3 (class 3079 OID 16806)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3671 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 959 (class 1247 OID 16857)
-- Name: fiche_statut; Type: TYPE; Schema: public; Owner: postgres
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


ALTER TYPE public.fiche_statut OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 16781)
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
-- TOC entry 231 (class 1259 OID 16767)
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
-- TOC entry 238 (class 1259 OID 25012)
-- Name: bordereau_route_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bordereau_route_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bordereau_route_seq OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16534)
-- Name: chauffeur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chauffeur (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    telephone character varying(30),
    statut character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    gare_id uuid NOT NULL
);


ALTER TABLE public.chauffeur OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16558)
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
-- TOC entry 224 (class 1259 OID 16542)
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
-- TOC entry 222 (class 1259 OID 16518)
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
-- TOC entry 229 (class 1259 OID 16696)
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
    statut public.fiche_statut DEFAULT 'BROUILLON'::public.fiche_statut NOT NULL,
    motif_annulation text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_reception_chauffeur timestamp without time zone,
    date_chargement timestamp without time zone,
    date_vehicule_rempli timestamp without time zone,
    date_passagers_installes timestamp without time zone,
    numero_bordereau character varying(6) DEFAULT lpad((nextval('public.bordereau_route_seq'::regclass))::text, 6, '0'::text) NOT NULL,
    CONSTRAINT chk_fiche_dates CHECK (((heure_depart IS NULL) OR (heure_arrivee_gare IS NULL) OR (heure_depart >= heure_arrivee_gare)))
);


ALTER TABLE public.fiche OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16891)
-- Name: fiche_impression; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.fiche_impression OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16750)
-- Name: fiche_passager; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.fiche_passager OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16913)
-- Name: fiche_remise; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fiche_remise (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fiche_id uuid NOT NULL,
    remise_par_id integer NOT NULL,
    date_remise timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    observation text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.fiche_remise OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16495)
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
-- TOC entry 226 (class 1259 OID 16568)
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
-- TOC entry 227 (class 1259 OID 16585)
-- Name: passager; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.passager OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16838)
-- Name: proprietaire; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.proprietaire OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16818)
-- Name: refresh_token; Type: TABLE; Schema: public; Owner: postgres
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
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    session_id uuid
);


ALTER TABLE public.refresh_token OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16817)
-- Name: refresh_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.refresh_token_id_seq OWNER TO postgres;

--
-- TOC entry 3672 (class 0 OID 0)
-- Dependencies: 233
-- Name: refresh_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_token_id_seq OWNED BY public.refresh_token.id;


--
-- TOC entry 216 (class 1259 OID 16400)
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
-- TOC entry 218 (class 1259 OID 16426)
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
-- TOC entry 3673 (class 0 OID 0)
-- Dependencies: 218
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- TOC entry 239 (class 1259 OID 41674)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    utilisateur_id integer NOT NULL,
    gare_id uuid,
    device_type character varying(10) NOT NULL,
    device_name character varying(255),
    last_seen_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    connected_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT chk_sessions_dates CHECK ((expires_at > connected_at)),
    CONSTRAINT chk_sessions_revoked CHECK (((revoked_at IS NULL) OR (revoked_at >= connected_at))),
    CONSTRAINT sessions_device_type_check CHECK (((device_type)::text = ANY ((ARRAY['WEB'::character varying, 'MOBILE'::character varying])::text[])))
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16659)
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
-- TOC entry 217 (class 1259 OID 16408)
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
-- TOC entry 219 (class 1259 OID 16438)
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
-- TOC entry 3674 (class 0 OID 0)
-- Dependencies: 219
-- Name: utilisateur_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateur_id_seq OWNED BY public.utilisateur.id;


--
-- TOC entry 221 (class 1259 OID 16507)
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
    proprietaire_id uuid,
    gare_id uuid NOT NULL,
    CONSTRAINT chk_vehicule_capacite CHECK ((capacite > 0))
);


ALTER TABLE public.vehicule OWNER TO postgres;

--
-- TOC entry 3349 (class 2604 OID 16821)
-- Name: refresh_token id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token ALTER COLUMN id SET DEFAULT nextval('public.refresh_token_id_seq'::regclass);


--
-- TOC entry 3305 (class 2604 OID 16427)
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- TOC entry 3310 (class 2604 OID 16439)
-- Name: utilisateur id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN id SET DEFAULT nextval('public.utilisateur_id_seq'::regclass);


--
-- TOC entry 3657 (class 0 OID 16781)
-- Dependencies: 232
-- Data for Name: alerte_document; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alerte_document (id, type_document, document_id, proprietaire_type, proprietaire_id, date_declenchement, date_expiration, type_alerte, statut, date_lecture, utilisateur_lecture, created_at) FROM stdin;
a38bafc5-4ddb-4bba-9697-35b141984ba2	ASSURANCE	10eb52eb-27a3-4912-b9bf-31b49c166fc3	VEHICULE	30cac1dc-f6ca-4f56-b811-50a78685b5cc	2026-10-23	2026-10-31	ATTENTION	LUE	2026-10-25 21:43:30.256	4	2026-10-23 12:20:04.274375
d5a67d90-c7f5-4381-8f2d-47a9d63bec01	ASSURANCE	b80c1cc0-1b63-4ea4-a9df-48115b6ae524	VEHICULE	c473cf16-d002-451c-a53c-aa870211fa2f	2026-11-01	2026-11-13	ATTENTION	LUE	2026-11-03 18:04:32.085	\N	2026-11-01 21:16:29.123004
acc3c0b2-1820-41f8-ad6b-a98a5ee2c6f2	CARTE BLEU	6149fe48-2629-47e0-8151-38a2ea3a9242	VEHICULE	c473cf16-d002-451c-a53c-aa870211fa2f	2026-11-01	2026-11-20	ATTENTION	LUE	2026-11-03 18:04:33.619	\N	2026-11-01 21:16:29.129593
\.


--
-- TOC entry 3656 (class 0 OID 16767)
-- Dependencies: 231
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_log (id, utilisateur_id, action, entite, entite_id, date_heure, ancienne_valeur, nouvelle_valeur, appareil_id) FROM stdin;
79d607b4-8332-4056-ac20-8d5d41ad6f8c	\N	CREATE	VEHICULE	505c1322-b981-4717-a11a-405a30051b95	2026-10-31 21:17:21.719311	\N	{"type": "AUTOBUS", "gareId": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "marque": "Ford", "modele": "Edge", "statut": "ACTIF", "capacite": 22, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "nombreDocuments": 1, "plaqueImmatriculation": "CE-12310-AA"}	\N
f0b0ee06-20ca-4357-844e-e4c5b4332249	3	CREATE	VEHICULE	88af5bd2-a644-4b2f-9970-f7839a4ba914	2026-10-31 22:17:54.859273	\N	{"type": "AUTOBUS", "gareId": "f4b143b4-fa68-41ea-9d6e-7022d3a1b6f6", "marque": "Subaru", "modele": "Edge", "statut": "ACTIF", "capacite": 22, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "nombreDocuments": 1, "plaqueImmatriculation": "KO-4585-AA"}	\N
0c191b69-5134-4799-8876-6eec21435581	3	UPDATE	VEHICULE	88af5bd2-a644-4b2f-9970-f7839a4ba914	2026-10-31 22:55:23.316165	{"type": "AUTOBUS", "marque": "Subaru", "modele": "Edge", "statut": "ACTIF", "capacite": 22, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "plaqueImmatriculation": "KO-4585-AA"}	{"type": "AUTOBUS", "marque": "Subaru", "modele": "Edge", "statut": "ACTIF", "capacite": 22, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "plaqueImmatriculation": "KO-4585-AA"}	\N
31da5d93-170a-4b96-8dda-7f49d1bdb267	3	DELETE	VEHICULE	88af5bd2-a644-4b2f-9970-f7839a4ba914	2026-10-31 22:55:46.722446	{"type": "AUTOBUS", "marque": "Subaru", "modele": "Edge", "statut": "ACTIF", "capacite": 22, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "nombreDocuments": 1, "plaqueImmatriculation": "KO-4585-AA"}	\N	\N
a899b29a-a24f-445c-8ddf-17747f8a1219	3	UPDATE	VEHICULE	18273fbf-b423-4dc0-a151-a1e4ca2e96fb	2026-11-01 19:40:02.011562	{"type": "MINI CAR", "gareId": "b85b7387-decd-4626-abac-80e70d08bbda", "marque": "Toyota", "modele": "Sprinter", "statut": "MAINTENANCE", "capacite": 12, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "plaqueImmatriculation": "LT-12548"}	{"type": "MINI CAR", "gareId": "b85b7387-decd-4626-abac-80e70d08bbda", "marque": "Toyota", "modele": "Sprinter", "statut": "ACTIF", "capacite": 12, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "plaqueImmatriculation": "LT-12548"}	\N
9cb3365e-12ab-4132-90c2-a461340489a0	3	CREATE	VEHICULE	c473cf16-d002-451c-a53c-aa870211fa2f	2026-11-01 21:06:17.756032	\N	{"type": "BERLINE", "gareId": "b85b7387-decd-4626-abac-80e70d08bbda", "marque": "SUBARU", "modele": "OUTBACK", "statut": "ACTIF", "capacite": 6, "proprietaireId": "77ccafa1-b405-4ced-9094-7a276a45ae43", "nombreDocuments": 2, "plaqueImmatriculation": "LT-12548-DF"}	\N
\.


--
-- TOC entry 3648 (class 0 OID 16534)
-- Dependencies: 223
-- Data for Name: chauffeur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chauffeur (id, nom, prenom, telephone, statut, created_at, updated_at, gare_id) FROM stdin;
0707368e-98a8-4144-83d5-97a60e8a1fa9	TEST	Chauffeur	600000000	ACTIF	2026-10-08 22:54:50.875803	2026-10-08 22:54:50.875803	b85b7387-decd-4626-abac-80e70d08bbda
cc37c6ce-189f-44bd-a3b6-e27acf43c119	Mballa	Jean	5145550123	ACTIF	2026-10-21 05:23:42.896858	2026-10-21 05:23:42.896858	415e0c29-47fc-4b18-b52e-32615a6c8a32
b7268580-2df6-4e42-a1ac-92d82c042d1e	ngue	paul	5145550123	ACTIF	2026-10-21 05:28:58.137951	2026-10-21 05:28:58.137951	d3b94ae9-279e-43c1-81d7-67d6960734a9
3df2a68a-2a27-480a-b5b1-b7c30459b107	Test	Agent	5145550199	ACTIF	2026-10-23 11:11:18.532089	2026-10-23 11:11:18.532089	d3b94ae9-279e-43c1-81d7-67d6960734a9
\.


--
-- TOC entry 3650 (class 0 OID 16558)
-- Dependencies: 225
-- Data for Name: destination; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.destination (id, code, nom, ville, pays, statut, created_at, updated_at) FROM stdin;
d3ed83fe-1a92-4e9a-b99d-a1bb77b9a6ef	DEST-TEST-001	Destination de test	Yaound‚	Cameroun	ACTIF	2026-10-08 22:49:41.285282	2026-10-08 22:49:41.285282
\.


--
-- TOC entry 3649 (class 0 OID 16542)
-- Dependencies: 224
-- Data for Name: document_chauffeur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_chauffeur (id, chauffeur_id, type_document, numero_document, date_delivrance, date_expiration, statut, observations, created_at, updated_at) FROM stdin;
7820006e-4bc5-45d2-bee7-08371155b320	cc37c6ce-189f-44bd-a3b6-e27acf43c119	PERMIS_CONDUIRE	PERMIS-TEST-001	2024-01-14	2028-01-14	VALIDE	Document de test	2026-10-21 05:23:42.896858	2026-10-21 05:23:42.896858
11aa88b5-a648-4dfa-b737-5405bd8a5a3a	b7268580-2df6-4e42-a1ac-92d82c042d1e	PERMIS_CONDUIRE	PERMIS-TEST-021	2024-01-14	2028-01-14	VALIDE	Document de test01	2026-10-21 05:28:58.137951	2026-10-21 05:28:58.137951
e595ef30-6ce9-486f-ad6f-2aa84537bdc4	3df2a68a-2a27-480a-b5b1-b7c30459b107	PERMIS_CONDUIRE	PERMIS-AGENT-TEST-002	2024-01-14	2028-01-14	VALIDE	Test de création par un agent	2026-10-23 11:11:18.532089	2026-10-23 11:11:18.532089
\.


--
-- TOC entry 3647 (class 0 OID 16518)
-- Dependencies: 222
-- Data for Name: document_vehicule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_vehicule (id, vehicule_id, type_document, numero_document, date_delivrance, date_expiration, statut, observations, created_at, updated_at) FROM stdin;
729c86ee-d7d9-4b6a-9030-5b29fbf751e5	30cac1dc-f6ca-4f56-b811-50a78685b5cc	ASSURANCE	ASS-2026-001	2026-01-14	2027-01-14	VALIDE	Document vérifié	2026-09-29 05:26:40.026015	2026-09-29 05:26:40.026015
32ba6690-854b-403f-b2ed-986f4d5f2ee5	5530fb55-d0d4-4c74-8772-d7867c458de3	ASSURANCE	ASS-DD-12	2026-10-12	2027-10-12	VALIDE	\N	2026-09-30 09:07:50.364996	2026-09-30 09:07:50.364996
65641ebf-a966-40d4-ab5a-72768d84af49	1916db58-bdf4-4988-83d3-eb5e187b3ea8	CARTE BLEU	CB-14856	2025-09-14	2030-09-13	VALIDE	\N	2026-09-30 09:10:16.38828	2026-09-30 09:10:16.38828
10eb52eb-27a3-4912-b9bf-31b49c166fc3	30cac1dc-f6ca-4f56-b811-50a78685b5cc	ASSURANCE	TEST-ALERTE-2026	2026-01-01	2026-10-31	VALIDE	Document temporaire pour test du module Alertes	2026-10-23 12:18:55.441483	2026-10-23 12:18:55.441483
ac3101f2-1071-4a6b-80ed-f51fe480a013	505c1322-b981-4717-a11a-405a30051b95	ASSURANCE	ASS-2026-001	2026-01-01	2027-01-01	VALIDE	Document de test	2026-10-31 21:17:21.719311	2026-10-31 21:17:21.719311
b80c1cc0-1b63-4ea4-a9df-48115b6ae524	c473cf16-d002-451c-a53c-aa870211fa2f	ASSURANCE	ASS-2027-581	2025-10-14	2026-11-13	VALIDE	\N	2026-11-01 21:06:17.756032	2026-11-01 21:06:17.756032
6149fe48-2629-47e0-8151-38a2ea3a9242	c473cf16-d002-451c-a53c-aa870211fa2f	CARTE BLEU	CB-258881	2025-10-25	2026-11-20	VALIDE	\N	2026-11-01 21:06:17.756032	2026-11-01 21:06:17.756032
\.


--
-- TOC entry 3654 (class 0 OID 16696)
-- Dependencies: 229
-- Data for Name: fiche; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fiche (id, reference, gare_id, vehicule_id, chauffeur_id, destination_id, itineraire_id, createur_id, finalisateur_id, annulateur_id, date_creation, heure_arrivee_gare, heure_depart, heure_arrivee_destination, date_finalisation, date_cloture, date_annulation, statut, motif_annulation, created_at, updated_at, date_reception_chauffeur, date_chargement, date_vehicule_rempli, date_passagers_installes, numero_bordereau) FROM stdin;
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	FCH-0002555	f4b143b4-fa68-41ea-9d6e-7022d3a1b6f6	5530fb55-d0d4-4c74-8772-d7867c458de3	b7268580-2df6-4e42-a1ac-92d82c042d1e	d3ed83fe-1a92-4e9a-b99d-a1bb77b9a6ef	\N	3	\N	\N	2026-11-01 13:42:55.880654	\N	\N	\N	\N	\N	\N	EN_ATTENTE	\N	2026-11-01 13:42:55.880654	2026-11-01 13:42:55.880654	\N	\N	\N	\N	000007
\.


--
-- TOC entry 3661 (class 0 OID 16891)
-- Dependencies: 236
-- Data for Name: fiche_impression; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fiche_impression (id, fiche_id, imprimeur_id, date_impression, numero_exemplaire, motif_reimpression, created_at) FROM stdin;
\.


--
-- TOC entry 3655 (class 0 OID 16750)
-- Dependencies: 230
-- Data for Name: fiche_passager; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fiche_passager (fiche_id, passager_id, numero_place, created_at, tarif, observations) FROM stdin;
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	3dd3c58e-0560-4e1b-bb7e-f44395aaf857	3	2026-11-01 13:48:05.243992	500.00	bien portant
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	686fb640-ae19-4490-8cdd-d851191db268	8	2026-11-01 14:09:36.182788	700.00	BCP DE BAGAGES
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	3edc3a77-adf0-4ed7-bdf1-4ab5cfd8b14a	8	2026-11-01 15:17:23.69953	5000.00	ras
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	d56b3f4f-9d3a-44a2-a5eb-5d7e7681aca7	3	2026-11-01 18:34:17.558635	500.00	bien portant
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	48a75795-7c2b-4e2f-b2f0-9598ef108dfd	7	2026-11-01 18:38:42.24023	1000.00	bien portant
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	c634f8d9-205a-4c3b-9326-b5b33ca044d1	6	2026-11-01 18:40:43.266025	1000.00	bien portante
\.


--
-- TOC entry 3662 (class 0 OID 16913)
-- Dependencies: 237
-- Data for Name: fiche_remise; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fiche_remise (id, fiche_id, remise_par_id, date_remise, observation, created_at) FROM stdin;
\.


--
-- TOC entry 3645 (class 0 OID 16495)
-- Dependencies: 220
-- Data for Name: gare; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gare (id, code, nom, ville, adresse, statut, created_at, updated_at, latitude, longitude) FROM stdin;
d3b94ae9-279e-43c1-81d7-67d6960734a9	GARE-Eseka	Gare routiere	Eseka	carrefour marche	ACTIVE	2026-09-11 14:04:45.459057	2026-09-11 14:04:45.459057	\N	\N
b85b7387-decd-4626-abac-80e70d08bbda	GARE001	Gare Centrale	Mboumyebel	Carrefour	ACTIF	2026-09-14 05:07:17.067087	2026-09-14 05:16:34.694691	3.848	11.502
f4b143b4-fa68-41ea-9d6e-7022d3a1b6f6	GARE0001	Tetem	Eseka	face cimetiere	ACTIF	2026-09-29 07:39:33.673416	2026-09-29 07:39:33.673416	7	15
415e0c29-47fc-4b18-b52e-32615a6c8a32	GARE-SYNC-003	Gare Sync Test 3	Eseka	123 Test 3	ACTIF	2026-09-16 06:03:08.959454	2026-11-01 14:33:39.850027	\N	\N
\.


--
-- TOC entry 3651 (class 0 OID 16568)
-- Dependencies: 226
-- Data for Name: itineraire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.itineraire (id, destination_id, code, libelle, description, statut, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3652 (class 0 OID 16585)
-- Dependencies: 227
-- Data for Name: passager; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.passager (id, nom, prenom, numero_cni, created_at, updated_at, telephone) FROM stdin;
3dd3c58e-0560-4e1b-bb7e-f44395aaf857	biloloo ngue	samuel	CNI00012555	2026-11-01 13:48:05.197202	2026-11-01 13:48:05.197202	14389248545
686fb640-ae19-4490-8cdd-d851191db268	BILOLOO	ALPHEE	CNI0025698888	2026-11-01 14:09:36.160887	2026-11-01 14:09:36.160887	4389256355
3edc3a77-adf0-4ed7-bdf1-4ab5cfd8b14a	Madea	ndumba	CNI2258444	2026-11-01 15:17:23.660594	2026-11-01 15:17:23.660594	9874441255
d56b3f4f-9d3a-44a2-a5eb-5d7e7681aca7	BILOLOO	LYAM	CNI-2558888	2026-11-01 18:34:17.527331	2026-11-01 18:34:17.527331	438965721
48a75795-7c2b-4e2f-b2f0-9598ef108dfd	BILOLOO	OWEN	CNI0001255888	2026-11-01 18:38:42.21505	2026-11-01 18:38:42.21505	43893562858
c634f8d9-205a-4c3b-9326-b5b33ca044d1	BILOLOO	ASRAELLE	CNI0248888	2026-11-01 18:40:43.238178	2026-11-01 18:40:43.238178	4968752294
\.


--
-- TOC entry 3660 (class 0 OID 16838)
-- Dependencies: 235
-- Data for Name: proprietaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proprietaire (id, nom, prenom, telephone, adresse, numero_piece_identite, type_piece_identite, statut, created_at, updated_at) FROM stdin;
bfb47b50-6000-42c8-8220-8985ae27f12f	Kameni	Jean	699123456	Yaoundé, Cameroun	123456789	CNI	ACTIF	2026-09-25 05:02:55.115515	2026-09-25 05:02:55.115515
77ccafa1-b405-4ced-9094-7a276a45ae43	BILOLOO	ALPHEE	4389243698	rue Oliva-Noel, 1318	CNI0001255555	CNI	ACTIF	2026-11-01 19:40:59.299396	2026-11-01 19:40:59.299396
\.


--
-- TOC entry 3659 (class 0 OID 16818)
-- Dependencies: 234
-- Data for Name: refresh_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_token (id, user_id, token_hash, expires_at, revoked_at, replaced_by_token_id, user_agent, ip_address, created_at, session_id) FROM stdin;
266	3	2cf0fe94d1b9814ca0b05f79e8dff6f438f4e05865308e0045ca0de5692f5cc6	2026-10-25 12:27:26.271	2026-10-21 05:16:29.605	267	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-18 12:27:26.274085	\N
267	3	9eca9e9ebdbe70e4c35a2b12bb9fa0d78f40f58af40016ad7b8979efffd11475	2026-10-28 05:16:29.58	2026-10-21 05:16:32.527	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 05:16:29.582681	\N
268	3	c3724c48347459a36cd3eb4185c2f4efe49ef69ac1f70e73afab6fe1007cb5c8	2026-10-28 05:16:34.226	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 05:16:34.224776	\N
269	3	166c7643845d0b3622be2fb8cb0ae0cec01fe9ca0d629230c1479ff38e75bbe0	2026-10-28 05:18:02.398	2026-10-21 05:27:40.232	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 05:18:02.39995	\N
270	4	c3a09e2b0283215e8ec38731ebb9dc706b173ee9989f23726efb007284173002	2026-10-28 05:28:06.47	2026-10-21 17:58:43.385	271	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 05:28:06.470974	\N
271	4	d261c0779bb19c0cf27c7fdc4543b96d41c7a88c034963cfb070cd592c614913	2026-10-28 17:58:43.175	2026-10-22 05:29:09.888	272	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 17:58:43.210572	\N
273	4	7f13055d4d40cd673dd9f993e7bf98f2ca6fa896e3e011f96c72762accdd5572	2026-10-29 12:14:35.637	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-22 12:14:35.639766	\N
272	4	1dc5c0370415b94d696d98b0f593ea9a974e8d72faa802930a77cd56ebc23bcb	2026-10-29 05:29:09.868	2026-10-22 12:14:35.668	273	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-22 05:29:09.871001	\N
274	3	e3f604ce48ccc964434a36b4c2370a3b7a667cb8ca4a7fb4c7fa1dd09cf9716b	2026-10-30 08:29:09.504	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 08:29:09.508506	\N
275	3	c9b7ce6002b8bf5744c3a8cc482d1547dfb580fea046e1c2295a0fd51fac532c	2026-10-30 08:39:31.65	2026-10-23 08:42:32.088	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 08:39:31.651047	\N
276	4	b5d23e0d6b9477619f35df3b79d14e25cef3ebbaeb1f5e7d1175a77ae148589d	2026-10-30 08:43:15.419	2026-10-23 11:00:38.367	277	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 08:43:15.421809	\N
277	4	1bdeb7f586ff7ed402ebd3ec752c58806980bc74c4ac52043b0958c53eb49c95	2026-10-30 11:00:38.353	2026-10-23 11:01:13.87	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:00:38.356975	\N
278	4	e72d44c5ad14e012fef7475cef08e5ca2528452e2d4b0bb856cc9fcee8841ca2	2026-10-30 11:01:23.22	2026-10-23 11:05:06.266	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:01:23.221104	\N
279	4	26c916db51f108c13fca006786ab5b677a6dde37bb9542421bbcbef0960f03f7	2026-10-30 11:05:09.908	2026-10-23 11:05:18.67	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:05:09.908725	\N
280	3	9def29620b6714075477aec761ce31a0c63f3637c0399ac89126e12424df2d82	2026-10-30 11:05:22.044	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:05:22.044825	\N
281	4	39a35e61fd3ec6b496c209b71f82520310d1e8c0c9283fe6769bb69a1b113baa	2026-10-30 11:06:35.04	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:06:35.041989	\N
282	4	5a2bba134982e3eddd535fb5ccea943f1ab2debfa2a7770821c95694969e7545	2026-10-30 11:08:31.768	2026-10-23 11:09:17.811	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:08:31.77295	\N
283	4	e701426b92271d17100a452ecfb2311259a3d984251b0ab04156cd763c08e597	2026-10-30 11:09:30.789	2026-10-23 11:31:35.855	284	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:09:30.789949	\N
284	4	f2b84453b234855f7c34391225d0ae2b2540b94359966e2aecc1ee6816e36d4f	2026-10-30 11:31:35.85	2026-10-23 12:19:23.038	285	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:31:35.851352	\N
285	4	2de6ed2ac2d17fd3bfa4a601a21efa2854ac39832a6d5e7e5b112f4d7d2df9ab	2026-10-30 12:19:23.014	2026-10-23 12:21:22.749	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 12:19:23.017766	\N
286	4	5f502d7b715389d2641ed49d22b4d8946ad517a2b66c8ca179bed90a91031953	2026-10-30 12:21:24.734	2026-10-23 12:21:44.155	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 12:21:24.735844	\N
287	3	85af8bb62b855cb635ab089e5d245c2b240cc7e7b933ea97cf520f0bd655cb72	2026-10-30 12:21:48.15	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 12:21:48.151916	\N
288	4	f3a1e1a2522c89892a829b6b96390371472bd4ee918c8d74140f465594cd3cf0	2026-11-01 21:28:57.629	2026-10-25 21:35:59.637	289	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-25 21:28:57.632926	\N
289	4	105d8ba2a067e0eab581289d4e3d5b67bbd6b50ef5e3d2d58ccecaad2f58a435	2026-11-01 21:35:59.631	2026-10-25 21:36:26.196	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-25 21:35:59.632541	\N
290	4	59b6ae41f458d340cc2c3e08bf0465bf7f17e97f19d9bf1b1eae4a11830e6967	2026-11-01 21:36:37.39	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-25 21:36:37.391182	\N
292	3	5760f37e2b6ff36ac57853220206163b372cc3ce96b183d02c4cf0251ba678e4	2026-11-07 20:41:57.232	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 20:41:57.235562	\N
293	3	2c6c911fba5bdc9e8d2604576566a14468ae7d0610b414dfc2706ee53ff72ef3	2026-11-07 20:48:47.415	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 20:48:47.418033	\N
291	3	4eb746144215c6db1daec9a6c2fa816de4de73d7846118cd0027b5656eef9b2f	2026-11-07 19:03:11.82	2026-11-01 05:58:29.759	299	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-10-31 19:03:11.824071	\N
294	3	d2298606682c042ae6176e9f9a7ce7cbc81abd0d73875aee464064d54dbcc896	2026-11-07 20:54:38.513	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 20:54:38.514815	\N
295	3	2600b62e85a983419eead15615768849d71b5307ba7dcd7e4171b86e716a2259	2026-11-07 21:12:47.708	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 21:12:47.711072	\N
296	3	da8f1ea690c20d0cc22a5f63c8458820513e00b96d6e6b4631eb40a2540162a4	2026-11-07 22:02:59.59	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 22:02:59.594057	\N
297	3	f45ca47c2d3fd17ebebd91989dcef31f7c5a7ffada26c2b9be276967330c7aff	2026-11-07 22:16:03.373	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 22:16:03.377355	\N
299	3	6d5ebf93a528714b341fd76f8170c3fa74761de0e2bb228532e153e5091c08f1	2026-11-08 05:58:29.735	2026-11-01 05:58:40.498	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-01 05:58:29.740548	\N
300	4	8ba7dcb7ff0887b21c8aa7e5ad28303135caa61a180a7f5877df89e31020b08f	2026-11-08 05:58:58.658	2026-11-01 05:59:41.851	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-01 05:58:58.660055	\N
298	3	786caae33a22701cb6b2c347b5f1242fdb29de8c38065b5a19c5a5008bf9803c	2026-11-07 22:54:05.548	2026-11-01 06:35:31.267	302	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 22:54:05.551936	\N
302	3	14aab1f15456eb2bbd68764ca9224605c6f26380d0ba92553c0d3235c3ee1532	2026-11-08 06:35:31.262	2026-11-01 06:35:38.18	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 06:35:31.265219	\N
303	3	ff85623b1030fe1265c8f668e51c5ae16e134fa7a5591474a506394386ca704d	2026-11-08 06:35:50.788	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 06:35:50.791159	\N
304	3	3d62d88366e08108926249a387b913612d320b63e19f41b4fc0b0607db3003af	2026-11-08 06:51:19.397	2026-11-01 08:19:19.919	305	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 06:51:19.401222	\N
305	3	4e69a154a31aa8e2161c0fb05a3a7b37f610a0edb735978286243eda2dbc2bcd	2026-11-08 08:19:19.9	2026-11-01 08:41:15.12	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 08:19:19.9021	\N
306	3	ab71bda13d6ec9b668419822a84d694618c18439390784b280dd956541f87486	2026-11-08 08:43:09.707	2026-11-01 10:24:43.923	307	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 08:43:09.708958	\N
307	3	c1f65e292ba4aeec2105d6dbfdbe17ed717f19f319d2f35dc4b958f4129f3ba7	2026-11-08 10:24:43.905	2026-11-01 10:26:49.904	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 10:24:43.90722	\N
308	3	5560c26b66625956359d0468586d732d6f49e558a064d1bf664e792c7d50286b	2026-11-08 10:26:51.422	2026-11-01 10:31:01.006	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 10:26:51.423454	\N
309	3	d778bceacfd1edb54e8891ecd96d52b62ff467402805b5bff4d19e58de2bf5fb	2026-11-08 10:31:02.609	2026-11-01 10:39:23.51	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 10:31:02.610628	\N
310	3	23092f47a917191b5255fb2ccb23592c693f6a0408f4c72dfb175561728d7481	2026-11-08 10:39:24.909	2026-11-01 11:00:25.785	311	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 10:39:24.910271	\N
311	3	3defcba7f8dda92799a22ff4da45c62ecc6d04f37f6dfb233d3fccac5c56841c	2026-11-08 11:00:25.746	2026-11-01 11:05:36.248	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 11:00:25.751241	\N
312	3	e8f78800eaa9a0ae2ba6831f034fa57be37897af41a4f8adca755dd8127dbd74	2026-11-08 11:05:37.832	2026-11-01 11:22:13.966	313	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 11:05:37.837	\N
313	3	b5279c185950311fd14791bb525fdc7657f3e7354949eca8f0769396d6a6c629	2026-11-08 11:22:13.951	2026-11-01 12:15:32.283	314	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 11:22:13.955897	\N
314	3	15deaa5e56449555b81f9f8f7879f7e09a6058727b3979397c458c17c6602c4e	2026-11-08 12:15:32.264	2026-11-01 13:06:16.028	315	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 12:15:32.267117	\N
315	3	2ad11c74b02bbfe8bce13851fb9ea7065bedbda50dc4701052c82c6cd3900026	2026-11-08 13:06:16.02	2026-11-01 13:18:57.471	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 13:06:16.023076	\N
316	3	1498de6a8f815a0ef8262c87435a61cb9e953ea01eceaf8808e8912b8ca8121b	2026-11-08 13:18:58.655	2026-11-01 13:42:29.301	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 13:18:58.656208	\N
317	3	1a6d4d73e159ee3353097372b461d1b2fe900357858b2139b149fea596ec136a	2026-11-08 13:42:30.564	2026-11-01 14:09:36.139	318	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 13:42:30.566281	\N
318	3	0db353cab9957a554257d2f5873e5f8db7e8d61dbc19358b6e8a5aa2f0bcecfd	2026-11-08 14:09:36.124	2026-11-01 14:12:56.343	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:09:36.125587	\N
319	4	32c69b50a63410416d5ae6f7a68f3020b1a065f34987d092e1a88a26b323b4a2	2026-11-08 14:13:01.686	2026-11-01 14:32:53.361	320	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:13:01.687009	\N
320	4	b95c7ba14ac6957d7eff66e46abdc3a748e7726019f6da8b27a88b7448e90e8e	2026-11-08 14:32:53.121	2026-11-01 14:32:58.491	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:32:53.153088	\N
321	4	c3ae8957cf7af5c28b40c7611634a85775807e9b05dda84ceeb1b9b87fee52d0	2026-11-08 14:33:00.384	2026-11-01 14:33:18.629	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:33:00.385361	\N
322	3	6179a3cc0e88e6bb08716cdb344478158d50a81bec4dc15bb8b32644ca1952d9	2026-11-08 14:33:22.265	2026-11-01 14:33:45.113	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:33:22.266245	\N
301	3	83fcedac286c2293af188df8012cc15e8aeb2b98220cfd78429a03d381b7475b	2026-11-08 06:33:28.751	2026-11-01 16:10:58.274	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-01 06:33:28.753044	\N
323	4	4e926a385229b62863057980427601baf4be69c0a47bccd1976a31ea6ef27fd3	2026-11-08 14:33:50.243	2026-11-01 14:35:17.486	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:33:50.244313	\N
324	3	31e3da0291bd67a9654cb454d2e91e631d68104a704a8cd78ba19e10df6ace71	2026-11-08 14:35:21.558	2026-11-01 14:50:43.708	325	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:35:21.559052	\N
325	3	53f1f7308b7a8508ab5d0bb7c607adbc8c3281acb60753f8e54e1743650ca234	2026-11-08 14:50:43.693	2026-11-01 15:08:21.891	326	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:50:43.695341	\N
326	3	df41552fb68cfb0a191294d13495065e7d0de0bc7e4898e0e2c2b714f7bfe0c6	2026-11-08 15:08:21.865	2026-11-01 15:30:10.835	327	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 15:08:21.869704	\N
327	3	0cc400eea115c20296236de100bd4ba6c2e67d31f0c8674ccfa1dfd146fd43b7	2026-11-08 15:30:10.825	2026-11-01 15:49:27.628	328	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 15:30:10.82887	\N
329	3	ac4d3f238a959729f947e9a28a4baa264bcb043ac0b0f4a0f8487807ed0cc7a4	2026-11-08 16:11:17.396	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-01 16:11:17.399187	\N
328	3	dc8a4826160e82ce3bc377c5cb1f11539c51d751d8ac08ef411ff59c7ab224b9	2026-11-08 15:49:27.61	2026-11-01 16:12:13.324	330	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 15:49:27.611961	\N
330	3	1695f494cc4d37d91b19793a190a7af908994da504e6590adc1dcb47e3d40358	2026-11-08 16:12:13.299	2026-11-01 16:27:25.46	331	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 16:12:13.30836	\N
331	3	e989ee73c9ffc6fcd0f24777469415a95730985f4cb2507f2a46a3cffc464409	2026-11-08 16:27:25.455	2026-11-01 16:42:29.871	332	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 16:27:25.456879	\N
332	3	78e4b0d51e4e11751c4765f48bb2078f254c421778e6661a03e25b672a0b9790	2026-11-08 16:42:29.865	2026-11-01 16:59:44.177	333	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 16:42:29.867259	\N
333	3	7f803fe358526e6e0eb954525a6175dfbd390bdd9ebc2283e68683a0544a2a66	2026-11-08 16:59:44.171	2026-11-01 17:12:23.046	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 16:59:44.172944	\N
334	3	c9449acb01411b6e7c401c341ceb1d4f6f067c305be925e05ec9f27a6f09a55c	2026-11-08 17:12:24.566	2026-11-01 17:35:02.442	335	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 17:12:24.568758	\N
335	3	921385be393f92d83f6235de2419a1700cbf4338cfd17a6c5dfabbe9392461af	2026-11-08 17:35:02.435	2026-11-01 17:49:36.156	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 17:35:02.436072	\N
336	3	ecd8383371a5dc4f6e4b694ba04812f8776e58a4f7336480ecdb00175a7d4562	2026-11-08 17:49:37.573	2026-11-01 18:05:17.71	337	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 17:49:37.575223	\N
337	3	7c8c0b07db1d4a3d1a89f5d9c5f7e40b6715d7571c77b6655c82688b50d6f1c5	2026-11-08 18:05:17.703	2026-11-01 18:33:04.204	338	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 18:05:17.705207	\N
338	3	08f65a22c673a006f237ee30428b1fab3fe9ee0a6288bbc4a9c92f012ee0eee1	2026-11-08 18:33:04.188	2026-11-01 18:35:38.686	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 18:33:04.191156	\N
339	2	3e02d5699734c4d6884f33ba07a1503f03e51865870f7475da549071bbadfa75	2026-11-08 18:35:46.087	2026-11-01 18:37:08.686	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 18:35:46.088976	\N
340	4	5fc6d7c493d0c443db14843b339d8ac51ab10293769ff9c71ebaa231c8009b43	2026-11-08 18:37:23.617	2026-11-01 18:37:43.88	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 18:37:23.619118	\N
341	3	74a2fa3f710bba8701da639a3fadc8f37e109064d21c9c70907a3c6a32812698	2026-11-08 18:37:47.581	2026-11-01 19:00:21.396	342	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 18:37:47.583806	\N
342	3	e98638fd032251778af8b4b4e5ba69fcb31ad21a1d0b42aa20284b99e0d95e05	2026-11-08 19:00:21.374	2026-11-01 19:22:03.023	343	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 19:00:21.378313	\N
343	3	7a0339dac28a0dc738ac7aebff01ffdce5ce461733f1e8cc61646364315b8d10	2026-11-08 19:22:03.013	2026-11-01 19:39:16.99	344	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 19:22:03.014792	\N
344	3	8905696d17f117f566242b4c71eab9687c42bd4f71ba6b787952b14b943f8dd1	2026-11-08 19:39:16.985	2026-11-01 20:02:16.323	345	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 19:39:16.987364	\N
345	3	d4383804110a2a3b9f738452de2bac9bfbf0c5358d7837323a4565f4bcbdd326	2026-11-08 20:02:16.308	2026-11-01 20:29:13.2	346	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 20:02:16.314476	\N
346	3	7afbcfacabdb40e8ed5afbee2b3a8371baabe18a810ad100a121190230a17bea	2026-11-08 20:29:13.185	2026-11-01 21:03:39.029	347	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 20:29:13.187684	\N
347	3	a66fa6a5e86d9f814f4c9e04f46c87c87be9d768d36d3d31f521849cb2258653	2026-11-08 21:03:39.013	2026-11-01 21:21:01.722	348	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 21:03:39.014045	\N
348	3	773753502e96e9af80fbff3e982d58c2bb1a747ea18d398bcbe3e222623cc3b8	2026-11-08 21:21:01.712	2026-11-02 06:49:38.405	349	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 21:21:01.71599	\N
349	3	d8018a6632a0bfbc4d75b64120583ffb0188b13c0ee615b7fc412c602ff31075	2026-11-09 06:49:38.263	2026-11-02 06:53:17.17	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-02 06:49:38.264748	\N
350	3	283fb3ae39e6f68f1533867e06068535e0fa593b06cad1ad69a09df95038b97a	2026-11-09 06:54:58.476	2026-11-03 17:59:51.211	351	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-02 06:54:58.477533	\N
351	3	40b7ab006528616356a3ecf69fc853b2542a1adf9cc7f16018094ceba24616c8	2026-11-10 17:59:51.185	2026-11-03 17:59:53.275	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-03 17:59:51.18787	\N
352	3	48d065268165e97b8422497981736f60733bfcde6711d1203945247cb244f4ec	2026-11-10 17:59:54.754	2026-11-06 02:32:29.655	353	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-03 17:59:54.755543	\N
353	3	0e62405fa6ea7b7d4e9bce2b7297a9f023c093b40162b0b1c196aaadc11200d4	2026-11-13 02:32:29.636	2026-11-06 02:32:31.226	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 02:32:29.638825	\N
354	3	76ca98d8babf29aaf42dfaeb5e0ff329a0108fef0918d1ad0aea2187580a678c	2026-11-13 02:32:32.927	2026-11-06 02:34:28.25	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 02:32:32.92902	\N
355	2	4210701a95fee870effbab85cea7e2644c75a77b205cdda3e6eb36e07175307a	2026-11-13 02:34:37.492	2026-11-06 07:38:54.521	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 02:34:37.493771	\N
356	2	46a629f08180be2518ccb4b5fea32e4e7074baa209ee5e3046714fb3c1170ee0	2026-11-13 08:50:17.791	2026-11-06 08:50:23.179	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 08:50:17.792436	\N
357	3	c8d8eb9a21dba7f7956cb26296ff097dabb1ee565093413a99c4afaeafd731ff	2026-11-13 08:50:26.413	2026-11-06 09:06:29.321	358	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 08:50:26.424878	\N
358	3	5c840eeca4e18ce6c76929437b400c538069c65da3edf3bce6f4faf1e46fa06a	2026-11-13 09:06:29.315	2026-11-06 09:21:49.586	359	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 09:06:29.31615	\N
360	3	38baa0748ab555435c1afffab014b2c253302b0c732b0cf5949fc9617521a09d	2026-11-13 17:22:37.469	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 17:22:37.471461	\N
359	3	aa5cb6a8a1a97be846beceb972624a3a72d893872123137e8803934963e175f5	2026-11-13 09:21:49.58	2026-11-06 17:22:37.943	360	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 09:21:49.582031	\N
361	3	f3f91981f5710a901db2d938670e16cfebdaff6874d5a4c6fece620fc1c2fad5	2026-11-13 17:22:41.718	2026-11-06 17:36:13.608	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 17:22:41.870412	\N
362	3	52ccd45fe684014444b68b2f5c731d3ea24787509ecd01f92080e34bcc9a2870	2026-11-13 17:36:15.281	2026-11-06 18:39:23.041	363	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 17:36:15.283096	\N
363	3	8dffadd5055509b64f7a0b632be32adeea692ceaf2dd3e86690c37f5171b20ae	2026-11-13 18:39:23.024	2026-11-06 18:39:27.357	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 18:39:23.026869	\N
364	3	5a1481074d90319c64c6146b2ea85bfad9488896bcc7874ba287971f71e9f611	2026-11-13 18:39:28.703	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 18:39:28.703801	\N
365	3	1bc6fd870070e1c689ee1b63e740fef4b1ea7a2190ddb0e874bd81edfa9b4b6b	2026-11-13 19:19:32.747	2026-11-06 19:23:40.755	366	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 19:19:32.772308	37c68923-776e-4bc9-87b6-849f24409c3a
366	3	198306e3f0caaadefb0d1f79c263bbc904ac7eb8f50261433df26ee98d695610	2026-11-13 19:23:40.719	2026-11-06 19:30:24.673	367	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 19:23:40.751204	37c68923-776e-4bc9-87b6-849f24409c3a
367	3	a0c218c1f788b72149cbdec2c5f5111d2e779d0a855bd0728bc136343eab59ed	2026-11-13 19:30:24.631	2026-11-06 19:35:21.822	368	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 19:30:24.665915	37c68923-776e-4bc9-87b6-849f24409c3a
368	3	a17b4622a1c2f052e296b301e682b085b37184e6398b3c07456f59fecec59b7e	2026-11-13 19:35:21.806	2026-11-06 19:45:55.37	369	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 19:35:21.819609	37c68923-776e-4bc9-87b6-849f24409c3a
369	3	8196e5ba29e7a8caccfff5cd5c838bb26f9f5407b260f59963c337cb63ac6daa	2026-11-13 19:45:55.343	2026-11-06 19:47:18.533	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 19:45:55.367382	37c68923-776e-4bc9-87b6-849f24409c3a
370	3	cc5425779a2238eda2682de2afe0ffe07703a440b35a8b0faed2e13abfaf756c	2026-11-13 19:47:19.785	2026-11-06 20:04:49.478	371	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 19:47:19.804044	b7fac4d8-1714-47f0-a84f-4bc18d847e71
372	4	e02b9bcb1b4efdce8038ac7b6dc713dcb2f8d4f187c5d655574bb2e1fa03f517	2026-11-13 20:08:45.384	2026-11-06 20:09:07.518	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-06 20:08:45.389528	85fa98e4-5cd1-46db-8f4e-3a3251a8e863
371	3	e853b9ef4f4e736c614c62a3e8ee4dc90b085b4b0bb9038f69a0d1e6ce5708ea	2026-11-13 20:04:49.456	2026-11-06 20:20:04.164	373	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 20:04:49.478284	b7fac4d8-1714-47f0-a84f-4bc18d847e71
373	3	75830ab6570b2d42f387a8fa5e011f96c144611dea372cd4600374528158f886	2026-11-13 20:20:04.126	2026-11-06 20:35:04.117	374	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 20:20:04.148983	b7fac4d8-1714-47f0-a84f-4bc18d847e71
374	3	9775d81bda5e92f9476b5ae9ccf7bcd296ee8456a3bfc2c1adfe4722dcfe081d	2026-11-13 20:35:04.105	2026-11-06 20:46:03.97	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 20:35:04.114629	b7fac4d8-1714-47f0-a84f-4bc18d847e71
375	3	bdf088f7cd17c07d53ebb6840fd818a86e148697f8fc05dae151485c65ac8ad2	2026-11-13 20:46:06.125	2026-11-06 21:02:04.127	376	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 20:46:06.140692	a196c5db-c709-4ccb-a9a1-0270f1fc6751
376	3	364d0cb10d212dd2bef2a064f5f79000ac52f902c28dc0c73df6b261af19fee8	2026-11-13 21:02:04.115	2026-11-06 21:17:05.108	377	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 21:02:04.130118	a196c5db-c709-4ccb-a9a1-0270f1fc6751
377	3	1fb411602b87c2c7ca83fe5f30ecb4685e1f283ebd5746e25673faeba0128f63	2026-11-13 21:17:05.084	2026-11-06 21:33:04.116	378	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 21:17:05.104106	a196c5db-c709-4ccb-a9a1-0270f1fc6751
378	3	1cd26e53ab6a386883c252b61736628d5d823e623a30a5711a374e857c62a5eb	2026-11-13 21:33:04.101	2026-11-06 21:48:04.102	379	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 21:33:04.113839	a196c5db-c709-4ccb-a9a1-0270f1fc6751
379	3	d090aea6b612ba1c347324e55d5d507192beff30675bf18a73245369ce2bef92	2026-11-13 21:48:04.095	2026-11-06 22:15:35.253	380	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 21:48:04.105995	a196c5db-c709-4ccb-a9a1-0270f1fc6751
380	3	51c77b3db656ec7b19ca7b4479b8e6d3179cbe5c086994c795e788c5f363aac8	2026-11-13 22:15:35.242	2026-11-06 22:15:37.562	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:15:35.251473	a196c5db-c709-4ccb-a9a1-0270f1fc6751
381	3	2da40af6e87ef173d2105daa7057dcf8833e86f51bbff11bbd924b9949b9223f	2026-11-13 22:15:40.626	2026-11-06 22:15:46.76	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:15:40.641929	d094706f-8967-4966-9b2d-ecd0f234c3d7
382	3	f77cf1c28fcfe22912e59729736c91a0a318ae10abb042d1040ecb90aeba57ac	2026-11-13 22:15:50.791	2026-11-06 22:16:19.915	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:15:50.797002	e6ce1c69-61c4-4b98-b34c-e27977bcde8d
383	3	5e889c0db0a3cdc5b0a28776c89fa049548779ddca5a31bb419557bfc23a7c5f	2026-11-13 22:19:13.145	2026-11-06 22:19:41.845	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:19:13.164209	582a6567-6da3-4e63-b334-6b9d96e2d329
384	3	ac6ed6ab8dac351870618de2a7bf7ac916ac1a9228caa8b8bd5bbeb39b5c1793	2026-11-13 22:23:03.33	2026-11-06 22:31:16.134	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:23:03.348167	e33c102e-46a8-4660-b7a1-300faf5923ff
385	3	523e391ea2505e6c0dcf7e41d5cd359e9439a51df1c0086984d2f28d3cd86eb9	2026-11-13 22:31:33.473	2026-11-06 22:34:42.326	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:31:33.491911	7733324b-c86d-448f-ad67-5f9009cbf443
386	3	6fa3c43597cee2bdad9a5847d02061e7629c6341fd2010ef0a45b6274abe580e	2026-11-13 22:34:47.671	2026-11-06 22:39:28.04	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:34:47.683587	79527953-3577-49e1-b882-b55b9751b77d
388	3	742f43710680c9b567515a4e09add79b28fa7ae37a73e0e1430dcd552919fd31	2026-11-13 22:39:32.131	2026-11-06 22:40:10.288	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:39:32.144811	2207c701-49e0-49ee-b875-b9fcf3573fb7
389	3	7e7c6df38895206ca2bbbdbe4a0c346045b8e09788ff06d74dbd761294c1933d	2026-11-13 22:40:13.415	2026-11-06 22:40:32.321	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:40:13.419926	c1e50693-51fd-437e-b6c5-6f18d250d9dd
390	3	5acf9291d6a4539e26607eea19fb6fcc5fa2997bfd4231f179aa958f79409d6d	2026-11-13 22:40:36.42	2026-11-06 22:40:51.755	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:40:36.442692	2f827dec-737d-44fd-bc9c-edceb6aac821
391	3	0752012fdb5efb7e38fffb0bb8aa8463684e32531a7460ecdcc3130d5fff4d16	2026-11-13 22:41:18.182	2026-11-06 22:42:57.903	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:41:18.200605	076a8364-d061-437f-9426-a042e2b331ae
392	3	45d8c5ead298d09dbd11d1eb58b5310a3145077edbb876b9ee2959ca6af10960	2026-11-13 22:43:00.841	2026-11-06 22:45:20.524	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:43:00.847978	03e350ea-e01f-4888-9f8f-9842947438d4
393	3	db4cde42522053456ff715b15ac99d0b401805fa10381e11e5feaa4c3887a65a	2026-11-13 22:45:22.598	2026-11-06 22:45:43.525	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:45:22.624021	1f173a25-7c99-42cf-9197-1a3c15d72b55
394	3	5674370864e4f94590fea08aa159901bb281cf1d18ae7de54d45fc92c23f9dea	2026-11-13 22:45:45.745	2026-11-06 22:45:58.116	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:45:45.753505	322a88ab-2bf1-42a0-9368-1689e16cf638
395	3	e1654b14ba17d3645bb8b2a223c94ad031aa89e97586531b54206141eef43486	2026-11-13 22:46:07.695	2026-11-06 22:46:11.491	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:46:07.715915	b25f9199-035f-49fe-9c84-28c23f11aeaf
396	3	66d639686d238e23abdecd7e0ee40e1d6dc52161a3f8e778ae0c1671aab54a90	2026-11-13 22:46:16.207	2026-11-06 22:46:20.202	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:46:16.224505	27bfddfd-aeea-43cc-b9a7-c86602820be2
397	3	d0aa1dfe0847347f317b79cb7756a3bbf6f373e468d6755e92470e56fe5c9d6d	2026-11-13 22:48:39.058	2026-11-06 22:48:44.592	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:48:39.077953	9cd92359-be4f-43d8-8da6-b8fa05213fd8
398	3	c0b59c611c1111905b4ad76c7e501b80e7d7f32ec31e2761622901ccfee64a1b	2026-11-13 22:48:48.655	2026-11-06 22:49:04.685	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:48:48.672786	2139f34a-f089-4b0b-8b2f-ccbee27ea893
399	3	eed90ddbd2e7d1ca7f326631c1d3d6c3d9ae39f62d644caacf14bb543c8ab9ef	2026-11-13 22:49:29.082	2026-11-06 22:54:59.06	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:49:29.106265	9971ecf8-1e57-4715-a45d-0a4e5f2d1b8c
400	3	7caa6609a72e808a74b5550987108bb39f137416cc3bb7d30c126111211dca3a	2026-11-13 22:55:08.199	2026-11-06 22:55:31.727	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:55:08.227118	c4733f17-58a3-437e-815e-a1b4d775fbbf
401	3	4c4bb723ce7bf8261d0179f06578ce1384d0155020d5230a0b4fbb97f20abd6c	2026-11-13 22:55:38.791	2026-11-06 22:58:20.48	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:55:38.813088	98f9de67-3560-4fcb-b7b6-8a00d30de6c8
402	3	d0d08389e443b74ac87d9dea3e02780f38e812fc6acb8784115ae0ce6a5af5d7	2026-11-13 22:59:29.878	2026-11-06 23:07:01.224	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:59:29.898685	7976785b-6622-4a89-aaf7-bccc85bff26d
403	3	ac16ec0926154ae63c0e45b440b52cbf07bbdfbd9bb91a4f6004e3999af6c88d	2026-11-13 23:16:32.167	2026-11-06 23:19:47.96	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:16:32.185533	c2ac5e6a-022a-4aaf-8c47-64b8668f4ce4
404	3	2df633339038f90437a1672cf1f1c6ffb725f608303ba58d9307b31270e62252	2026-11-13 23:20:51.425	2026-11-06 23:23:00.259	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:20:51.444799	00b6412f-c4a8-4186-a237-602c94d73db6
405	3	bf947083cb5da71dd3a61c5009b269323b93e58bda4291b416a132e7c2766b16	2026-11-13 23:24:12.274	2026-11-06 23:24:16.509	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:24:12.292513	31009ea0-14e6-42fc-b08a-05f92a15fca2
406	3	2c58651fdc18224fe6bd27eb501f87d7a7a210c2e6a2424af6bfed9b0d6e9adf	2026-11-13 23:24:33.702	2026-11-06 23:26:35.277	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:24:33.719813	4f25c6a7-3a3c-4cf6-b3e9-5d6b30411c72
407	3	2e35a4138a3b19e2c4fdbfaf73d60cd126a0754757af883278ee29984308159c	2026-11-13 23:26:42.26	2026-11-06 23:30:07.671	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:26:42.265037	8d45fbe7-0e4d-49ee-8dfd-1b826b81893b
408	3	872963a7c2c0f5729bf62643aabcc7f51754d03f97540b917be5d83dffd89db0	2026-11-13 23:32:27.919	2026-11-06 23:48:04.114	409	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:32:27.924969	2130f217-e8c0-4c32-a31a-a2586e8faf05
409	3	d2e014bb4db1a675342fb6c3d1ff6f4e72330a8d386641571da9ce486acdf71b	2026-11-13 23:48:04.098	2026-11-06 23:54:12.155	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:48:04.111252	2130f217-e8c0-4c32-a31a-a2586e8faf05
411	3	d1212236f2d8c51f6968976866a1814791534c5243ee0aa0cfae6bcdcf72f191	2026-11-14 00:10:04.1	2026-11-07 00:18:19.12	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 00:10:04.115418	51cf3871-f285-48d1-af08-fa5a3b7b2711
387	4	c650e13f0dd875063ab57f095b18a9631a3b7117f8e8879c6b83b434becce60c	2026-11-13 22:35:29.291	2026-11-07 00:11:27.438	412	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-06 22:35:29.29985	e00bb1b7-7bed-449d-9d49-5cdeaa49eb00
410	3	0cefc36a65b78d5e7d8e3b2683f5331b3b3e9209be9805d3bccd56a88a76bb84	2026-11-13 23:54:24.191	2026-11-07 00:10:04.117	411	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:54:24.210563	51cf3871-f285-48d1-af08-fa5a3b7b2711
412	4	35c190ed8ff29321522f51faa32f2144d3ec990e171d6c59f1abb325a08c833e	2026-11-14 00:10:59.793	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 00:10:59.815749	e00bb1b7-7bed-449d-9d49-5cdeaa49eb00
413	3	37a9f2626db810fbbf6b50d719c7d0d22ad4106dc52c0b8dbbd651f69e8d4e89	2026-11-14 00:12:00.192	2026-11-07 00:27:04.117	415	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 00:12:00.21864	2aade671-5975-4080-8b1a-33bc7e36ae35
414	2	41c04ab916a9176833843a4b7b84cb751e4a072fbb9123bbfdf0ce3efd8d3489	2026-11-14 00:18:27.732	2026-11-07 00:34:04.117	416	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 00:18:27.750311	fb2b98f0-da61-4d42-a2b5-7d7f95b00261
416	2	36b6cb9147f8a9fc3c7b8131b7b401f9f6cabedd9ca9cc84ecfb95aa943a51a3	2026-11-14 00:34:04.096	2026-11-07 01:49:48.956	417	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 00:34:04.114515	fb2b98f0-da61-4d42-a2b5-7d7f95b00261
417	2	0d7eaa2ab0f4fc3f6f3d108b0936f44b85c357ee13a63b6784c4e2ac9a378c8d	2026-11-14 01:49:48.895	2026-11-07 01:49:51.847	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 01:49:48.944252	fb2b98f0-da61-4d42-a2b5-7d7f95b00261
418	3	cae13e22d5d70f83cc1b57e9f7c146a64270d966a905e5e01f0bc61bc65a88bb	2026-11-14 01:50:00.429	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 01:50:00.45603	06f48dae-8922-4c95-b160-5a6a39d2c3ee
419	3	cfdebe4900a37bbba18492aabfae640790342d506b9c777cc390ff18edb62a17	2026-11-14 01:51:20.053	2026-11-07 02:05:04.167	420	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 01:51:20.060301	0e5fc744-574d-40f3-91b1-261223af02c4
421	3	6fe6927528f52b5f5078c949c778d4da1d8d4ffdc7b3fa89a06edaf0f589696e	2026-11-14 02:05:11.475	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 02:05:11.501175	cc9a694c-d954-4dcc-ac7a-48d91b9c5ef3
420	3	d484a34f48037230b2088ef5c18eb971001bc9c03e9b4fd3f54d4c4391023ffd	2026-11-14 02:05:04.11	2026-11-07 02:06:51.278	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:05:04.156444	0e5fc744-574d-40f3-91b1-261223af02c4
422	3	f82279fb4e68f1b1453f75d1d0a2897f6cb4dbb59e18d9e5c3548adecd213596	2026-11-14 02:07:01.337	2026-11-07 02:07:41.128	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:07:01.343633	9c1b92a4-9345-4027-85fd-0d80fe060fc5
423	4	429f806648c0b73a3841b29704ea2f4efee6192bb26e3035701561c5ec9ad99d	2026-11-14 02:07:48.52	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:07:48.539876	564c6ebf-063f-40b9-959d-ab9eeecfa6f6
424	4	688c3bbeff8101c2998fadbd50787fe2cd622c7792944ae984c2be18cb474100	2026-11-14 02:07:50.69	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:07:50.706138	17a674b3-f836-456b-8f39-acdd4392ea03
425	4	1a34949eb8ccf270da0c954286376bbdbac29b11c5fc65b63ea6855a5a5a82e1	2026-11-14 02:07:51.599	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:07:51.615932	b30ae0bb-fbce-4111-a1a0-117dea17d988
426	4	8faa9b23b733f15d35c82b936fbe892c60c4573f839221f5eaca734362a4025d	2026-11-14 02:07:52.127	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:07:52.142383	1fabff85-705b-4eab-b249-2abeb8a2eff2
427	4	6ed85de2a5adb2a16fa248033a1edb877096daa8714bddae25e1016232e77663	2026-11-14 02:07:52.36	2026-11-07 02:19:45.218	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:07:52.376179	fdae4243-f305-4557-ae80-434dade59fcd
430	3	ba949ae16dd19e9c068f0b8c68bac83a20c074aff0c2e2683e1dc0490a8fee14	2026-11-14 02:22:07.256	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 02:22:07.319613	2aade671-5975-4080-8b1a-33bc7e36ae35
415	3	1a7fbbffac5219126941276b742a655029199f1e39ceafd1d60a56861a7ddf5f	2026-11-14 00:27:04.104	2026-11-07 02:22:07.322	430	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 00:27:04.11564	2aade671-5975-4080-8b1a-33bc7e36ae35
428	3	4cad926454ba26fdbc2fa0078736f1ddf4c1377f491c093680789348711b3c5d	2026-11-14 02:19:00.308	2026-11-07 02:34:00.991	432	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 02:19:00.340077	db286fec-ffd8-4bcc-85aa-84366013362c
429	3	8dd5aca484aa84601c96f461f9a31a8912fac817c961ad8b29219e6115aa3d32	2026-11-14 02:20:15.519	2026-11-07 02:36:04.082	433	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:20:15.547708	8175ef1b-e611-41d0-92b8-3b64cf244841
434	3	cd2453dfca74a2595c7285d6e1d3d34e7c066b6bae1a1edbe897fe0abfcf7e21	2026-11-14 02:38:04.102	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 02:38:04.111641	2f474add-93bb-44eb-abee-d30a78c2622d
431	3	36541808571eb4189525f1a86e5fefc275aa49b91759a628c5791201587b6ba3	2026-11-14 02:22:15.371	2026-11-07 02:38:04.113	434	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 02:22:15.376691	2f474add-93bb-44eb-abee-d30a78c2622d
433	3	8783faaa7e3f03ffe42cd1a860f6845d41cc6d3925a8489ccf1c0186b8e260ff	2026-11-14 02:36:04.075	2026-11-07 07:43:58.4	435	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:36:04.07987	8175ef1b-e611-41d0-92b8-3b64cf244841
432	3	cdb84fdbbdfebe050c2c1ddac6c6da6a2a152c914a8fb80718062c62c4f6f183	2026-11-14 02:34:00.968	2026-11-07 07:44:01.197	436	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 02:34:00.989039	db286fec-ffd8-4bcc-85aa-84366013362c
436	3	e07d8d93fc5bab1d332bdbfca41106bf01a63241ab96f534a435bc99c41346be	2026-11-14 07:44:01.189	2026-11-07 07:59:01.271	437	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 07:44:01.19611	db286fec-ffd8-4bcc-85aa-84366013362c
437	3	4d6ebcd0fa7323a7e976e5467807df6d1bb4cf76b667c4c8f0e7d7104b391825	2026-11-14 07:59:01.249	2026-11-07 08:14:01.38	439	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 07:59:01.26917	db286fec-ffd8-4bcc-85aa-84366013362c
438	3	c26fdf552cc77a161b0f0a47c2ba9516820184094ef0cd59e2ff2187dd300e92	2026-11-14 07:59:04.031	2026-11-07 08:14:04.148	440	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 07:59:04.046424	8175ef1b-e611-41d0-92b8-3b64cf244841
435	3	d383788535046c15c6caa0e9e6aa3726a7dc6a77d6120d41f89063001a88be81	2026-11-14 07:43:58.383	2026-11-07 07:59:04.047	438	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 07:43:58.397358	8175ef1b-e611-41d0-92b8-3b64cf244841
441	3	24e54114372bab236438797e2063d24744d61a3e7d17df2f9479e4d00724dcd9	2026-11-14 08:29:01.455	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 08:29:01.478331	db286fec-ffd8-4bcc-85aa-84366013362c
439	3	f01590cbfc77abbcdbc754849d1547e0bfb1ba707bc17dfc97bf4937172dae80	2026-11-14 08:14:01.357	2026-11-07 08:29:01.478	441	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 08:14:01.367708	db286fec-ffd8-4bcc-85aa-84366013362c
442	3	d3507986af3235090d0b5eaab578ebb3d329b939dc791e88b9ebc8c357022789	2026-11-14 08:29:04.255	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 08:29:04.264449	8175ef1b-e611-41d0-92b8-3b64cf244841
440	3	4d5586c3c55af85cee54d8956ad817c1b7b6219bf6c79fc7825bb5f2c0c3597d	2026-11-14 08:14:04.131	2026-11-07 08:29:04.263	442	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 08:14:04.147841	8175ef1b-e611-41d0-92b8-3b64cf244841
\.


--
-- TOC entry 3641 (class 0 OID 16400)
-- Dependencies: 216
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
-- TOC entry 3664 (class 0 OID 41674)
-- Dependencies: 239
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, utilisateur_id, gare_id, device_type, device_name, last_seen_at, connected_at, expires_at, revoked_at) FROM stdin;
00b6412f-c4a8-4186-a237-602c94d73db6	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:22:57.206-05	2026-11-06 23:20:51.426-05	2026-11-13 23:20:51.426-05	2026-11-06 23:23:00.278-05
e33c102e-46a8-4660-b7a1-300faf5923ff	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:31:13.45-05	2026-11-06 22:23:03.331-05	2026-11-13 22:23:03.331-05	2026-11-06 22:31:16.152-05
2aade671-5975-4080-8b1a-33bc7e36ae35	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-07 02:22:07.263-05	2026-11-07 00:12:00.194-05	2026-11-14 02:22:07.256-05	\N
9971ecf8-1e57-4715-a45d-0a4e5f2d1b8c	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:54:50.157-05	2026-11-06 22:49:29.084-05	2026-11-13 22:49:29.084-05	2026-11-06 22:54:59.069-05
31009ea0-14e6-42fc-b08a-05f92a15fca2	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:24:12.581-05	2026-11-06 23:24:12.276-05	2026-11-13 23:24:12.276-05	2026-11-06 23:24:16.528-05
c4733f17-58a3-437e-815e-a1b4d775fbbf	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:55:08.995-05	2026-11-06 22:55:08.201-05	2026-11-13 22:55:08.201-05	2026-11-06 22:55:31.738-05
37c68923-776e-4bc9-87b6-849f24409c3a	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 19:47:15.901-05	2026-11-06 19:19:32.749-05	2026-11-13 19:45:55.343-05	2026-11-06 19:47:18.553-05
076a8364-d061-437f-9426-a042e2b331ae	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:42:49.102-05	2026-11-06 22:41:18.183-05	2026-11-13 22:41:18.183-05	2026-11-06 22:42:57.908-05
7733324b-c86d-448f-ad67-5f9009cbf443	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:34:39.592-05	2026-11-06 22:31:33.474-05	2026-11-13 22:31:33.474-05	2026-11-06 22:34:42.331-05
51cf3871-f285-48d1-af08-fa5a3b7b2711	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 00:18:16.317-05	2026-11-06 23:54:24.192-05	2026-11-14 00:10:04.1-05	2026-11-07 00:18:19.137-05
4f25c6a7-3a3c-4cf6-b3e9-5d6b30411c72	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:26:32.691-05	2026-11-06 23:24:33.703-05	2026-11-13 23:24:33.703-05	2026-11-06 23:26:35.288-05
98f9de67-3560-4fcb-b7b6-8a00d30de6c8	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:58:10.088-05	2026-11-06 22:55:38.796-05	2026-11-13 22:55:38.796-05	2026-11-06 22:58:20.503-05
fb2b98f0-da61-4d42-a2b5-7d7f95b00261	2	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 01:49:49.039-05	2026-11-07 00:18:27.734-05	2026-11-14 01:49:48.895-05	2026-11-07 01:49:51.868-05
8d45fbe7-0e4d-49ee-8dfd-1b826b81893b	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:30:04.101-05	2026-11-06 23:26:42.261-05	2026-11-13 23:26:42.261-05	2026-11-06 23:30:07.683-05
a196c5db-c709-4ccb-a9a1-0270f1fc6751	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:15:35.269-05	2026-11-06 20:46:06.126-05	2026-11-13 22:15:35.242-05	2026-11-06 22:15:37.583-05
03e350ea-e01f-4888-9f8f-9842947438d4	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:45:08.047-05	2026-11-06 22:43:00.843-05	2026-11-13 22:43:00.843-05	2026-11-06 22:45:20.545-05
d094706f-8967-4966-9b2d-ecd0f234c3d7	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:15:40.899-05	2026-11-06 22:15:40.627-05	2026-11-13 22:15:40.627-05	2026-11-06 22:15:46.781-05
85fa98e4-5cd1-46db-8f4e-3a3251a8e863	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-06 20:08:45.457-05	2026-11-06 20:08:45.386-05	2026-11-13 20:08:45.386-05	2026-11-06 20:09:07.523-05
b7fac4d8-1714-47f0-a84f-4bc18d847e71	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 20:46:02.174-05	2026-11-06 19:47:19.787-05	2026-11-13 20:35:04.105-05	2026-11-06 20:46:03.984-05
e6ce1c69-61c4-4b98-b34c-e27977bcde8d	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:15:51.057-05	2026-11-06 22:15:50.792-05	2026-11-13 22:15:50.792-05	2026-11-06 22:16:19.932-05
1f173a25-7c99-42cf-9197-1a3c15d72b55	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:45:40.298-05	2026-11-06 22:45:22.601-05	2026-11-13 22:45:22.601-05	2026-11-06 22:45:43.547-05
322a88ab-2bf1-42a0-9368-1689e16cf638	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:45:46.054-05	2026-11-06 22:45:45.746-05	2026-11-13 22:45:45.746-05	2026-11-06 22:45:58.141-05
582a6567-6da3-4e63-b334-6b9d96e2d329	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:19:36.333-05	2026-11-06 22:19:13.147-05	2026-11-13 22:19:13.147-05	2026-11-06 22:19:41.85-05
b25f9199-035f-49fe-9c84-28c23f11aeaf	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:46:07.982-05	2026-11-06 22:46:07.698-05	2026-11-13 22:46:07.698-05	2026-11-06 22:46:11.503-05
79527953-3577-49e1-b882-b55b9751b77d	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:39:25.269-05	2026-11-06 22:34:47.673-05	2026-11-13 22:34:47.673-05	2026-11-06 22:39:28.061-05
27bfddfd-aeea-43cc-b9a7-c86602820be2	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:46:16.483-05	2026-11-06 22:46:16.208-05	2026-11-13 22:46:16.208-05	2026-11-06 22:46:20.217-05
7976785b-6622-4a89-aaf7-bccc85bff26d	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:06:57.46-05	2026-11-06 22:59:29.879-05	2026-11-13 22:59:29.879-05	2026-11-06 23:07:01.244-05
9cd92359-be4f-43d8-8da6-b8fa05213fd8	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:48:39.536-05	2026-11-06 22:48:39.061-05	2026-11-13 22:48:39.061-05	2026-11-06 22:48:44.614-05
2207c701-49e0-49ee-b875-b9fcf3573fb7	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:39:50.746-05	2026-11-06 22:39:32.133-05	2026-11-13 22:39:32.133-05	2026-11-06 22:40:10.311-05
2139f34a-f089-4b0b-8b2f-ccbee27ea893	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:48:48.924-05	2026-11-06 22:48:48.657-05	2026-11-13 22:48:48.657-05	2026-11-06 22:49:04.701-05
c1e50693-51fd-437e-b6c5-6f18d250d9dd	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:40:13.676-05	2026-11-06 22:40:13.416-05	2026-11-13 22:40:13.416-05	2026-11-06 22:40:32.336-05
06f48dae-8922-4c95-b160-5a6a39d2c3ee	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:04:04.088-05	2026-11-07 01:50:00.431-05	2026-11-14 01:50:00.431-05	\N
2f827dec-737d-44fd-bc9c-edceb6aac821	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:40:48.625-05	2026-11-06 22:40:36.422-05	2026-11-13 22:40:36.422-05	2026-11-06 22:40:51.777-05
e00bb1b7-7bed-449d-9d49-5cdeaa49eb00	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-07 00:10:59.799-05	2026-11-06 22:35:29.292-05	2026-11-14 00:10:59.793-05	2026-11-07 00:11:27.445-05
c2ac5e6a-022a-4aaf-8c47-64b8668f4ce4	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:19:44.08-05	2026-11-06 23:16:32.168-05	2026-11-13 23:16:32.168-05	2026-11-06 23:19:47.975-05
2130f217-e8c0-4c32-a31a-a2586e8faf05	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:54:04.346-05	2026-11-06 23:32:27.92-05	2026-11-13 23:48:04.098-05	2026-11-06 23:54:12.17-05
0e5fc744-574d-40f3-91b1-261223af02c4	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:06:45.032-05	2026-11-07 01:51:20.055-05	2026-11-14 02:05:04.11-05	2026-11-07 02:06:51.294-05
cc9a694c-d954-4dcc-ac7a-48d91b9c5ef3	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	2026-11-07 02:15:40.329-05	2026-11-07 02:05:11.477-05	2026-11-14 02:05:11.477-05	\N
fdae4243-f305-4557-ae80-434dade59fcd	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:19:42.97-05	2026-11-07 02:07:52.362-05	2026-11-14 02:07:52.362-05	2026-11-07 02:19:45.229-05
9c1b92a4-9345-4027-85fd-0d80fe060fc5	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:07:35.566-05	2026-11-07 02:07:01.339-05	2026-11-14 02:07:01.339-05	2026-11-07 02:07:41.132-05
564c6ebf-063f-40b9-959d-ab9eeecfa6f6	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:07:48.522-05	2026-11-07 02:07:48.522-05	2026-11-14 02:07:48.522-05	\N
17a674b3-f836-456b-8f39-acdd4392ea03	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:07:50.692-05	2026-11-07 02:07:50.692-05	2026-11-14 02:07:50.692-05	\N
b30ae0bb-fbce-4111-a1a0-117dea17d988	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:07:51.6-05	2026-11-07 02:07:51.6-05	2026-11-14 02:07:51.6-05	\N
1fabff85-705b-4eab-b249-2abeb8a2eff2	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:07:52.128-05	2026-11-07 02:07:52.128-05	2026-11-14 02:07:52.128-05	\N
8175ef1b-e611-41d0-92b8-3b64cf244841	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 08:32:04.287-05	2026-11-07 02:20:15.521-05	2026-11-14 08:29:04.255-05	\N
db286fec-ffd8-4bcc-85aa-84366013362c	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	2026-11-07 08:32:30.886-05	2026-11-07 02:19:00.309-05	2026-11-14 08:29:01.455-05	\N
2f474add-93bb-44eb-abee-d30a78c2622d	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-07 02:39:04.145-05	2026-11-07 02:22:15.373-05	2026-11-14 02:38:04.102-05	\N
\.


--
-- TOC entry 3653 (class 0 OID 16659)
-- Dependencies: 228
-- Data for Name: sync_queue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sync_queue (id, entity_type, entity_id, operation, payload, status, retry_count, created_at, last_attempt_at, last_error) FROM stdin;
\.


--
-- TOC entry 3642 (class 0 OID 16408)
-- Dependencies: 217
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateur (actif, bloque, created_at, email, last_login_at, nom, password_hash, prenom, telephone, updated_at, username, id, gare_id, role_id) FROM stdin;
t	f	2026-08-24 12:44:16.116101	admin@gare.com	\N	Super	$2b$10$xHe0wx4r9HxuiAYEEd/haeN8uzDSo3VXEkXJjScClPPeXsTv9KJXG	Admin	+243000000000	2026-09-02 11:18:28.807072	admin	1	\N	1
t	f	2026-09-11 15:45:33.834643	autorite1@gare.com	2026-09-30 09:12:14.603	AUTORITE_HABILITE	$2b$10$7EYBJFxWfszGGFGi6gHL/.QLXPtyBIsg5hLD0gu5AB9hfCRGk3Wjm	Test	\N	2026-09-30 09:12:14.605816	autorite1	5	d3b94ae9-279e-43c1-81d7-67d6960734a9	8
t	f	2026-08-26 19:06:48.180316	jean.kameni@gare.com	2026-11-07 00:18:27.764	Kameni	$2b$10$nMaPWZEtxu0aR66bj4Bcw.mG8og5dIhpa3QE9yhaxVkx6EBIvtLNC	Jean	+243810000001	2026-11-07 00:18:27.766763	controleur1	2	d3b94ae9-279e-43c1-81d7-67d6960734a9	2
t	f	2026-09-25 03:39:17.836736	responsable1@gare.com	2026-09-29 07:18:43.299	Responsable	$2b$10$zHUa8GFicwFWpqFsQjnemeI0NFWsX6MMMBFzgJQAPlNvxneag/auC	Gare	\N	2026-09-29 07:18:43.302823	responsable1	11	d3b94ae9-279e-43c1-81d7-67d6960734a9	7
t	f	2026-09-11 15:30:38.609346	agent1@gare.com	2026-11-07 02:07:52.378	Agent	$2b$10$/pPQB0s4mQRfVnYuXRQ9cuyWMbgh72UotnLYd.bEKcEuZnKqFzRsa	Test	\N	2026-11-07 02:07:52.380004	agent1	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	6
t	f	2026-09-11 15:11:44.183937	admin2@gare.com	2026-11-07 02:22:15.379	Administrateur	$2b$10$LaDjxk.z2/VLNzIHSaGfOuE4vzYzyD1KPYsnWVEH6bVVks9TTgp3G	Test	\N	2026-11-07 02:22:15.382014	admin2	3	b85b7387-decd-4626-abac-80e70d08bbda	1
\.


--
-- TOC entry 3646 (class 0 OID 16507)
-- Dependencies: 221
-- Data for Name: vehicule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicule (id, plaque_immatriculation, type, marque, modele, capacite, statut, created_at, updated_at, proprietaire_id, gare_id) FROM stdin;
30cac1dc-f6ca-4f56-b811-50a78685b5cc	CE-1234-AA	BUS	Toyota	Coaster	30	ACTIF	2026-09-29 04:53:19.24369	2026-09-29 04:53:19.24369	bfb47b50-6000-42c8-8220-8985ae27f12f	b85b7387-decd-4626-abac-80e70d08bbda
5530fb55-d0d4-4c74-8772-d7867c458de3	CE-1235-AA	LIMOSINE	FORD	EDGE	12	ACTIF	2026-09-30 09:07:50.364996	2026-09-30 09:07:50.364996	bfb47b50-6000-42c8-8220-8985ae27f12f	b85b7387-decd-4626-abac-80e70d08bbda
1916db58-bdf4-4988-83d3-eb5e187b3ea8	CE-1834-AB	MINI BUS	MERCEDES	GROOVE	12	ACTIF	2026-09-30 09:10:16.38828	2026-09-30 09:10:16.38828	bfb47b50-6000-42c8-8220-8985ae27f12f	b85b7387-decd-4626-abac-80e70d08bbda
505c1322-b981-4717-a11a-405a30051b95	CE-12310-AA	AUTOBUS	Ford	Edge	22	ACTIF	2026-10-31 21:17:21.719311	2026-10-31 21:17:21.719311	bfb47b50-6000-42c8-8220-8985ae27f12f	d3b94ae9-279e-43c1-81d7-67d6960734a9
18273fbf-b423-4dc0-a151-a1e4ca2e96fb	LT-12548	MINI CAR	Toyota	Sprinter	12	ACTIF	2026-09-29 09:24:17.574368	2026-11-01 19:40:02.011562	bfb47b50-6000-42c8-8220-8985ae27f12f	b85b7387-decd-4626-abac-80e70d08bbda
c473cf16-d002-451c-a53c-aa870211fa2f	LT-12548-DF	BERLINE	SUBARU	OUTBACK	6	ACTIF	2026-11-01 21:06:17.756032	2026-11-01 21:06:17.756032	77ccafa1-b405-4ced-9094-7a276a45ae43	b85b7387-decd-4626-abac-80e70d08bbda
\.


--
-- TOC entry 3675 (class 0 OID 0)
-- Dependencies: 238
-- Name: bordereau_route_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bordereau_route_seq', 7, true);


--
-- TOC entry 3676 (class 0 OID 0)
-- Dependencies: 233
-- Name: refresh_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refresh_token_id_seq', 442, true);


--
-- TOC entry 3677 (class 0 OID 0)
-- Dependencies: 218
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 8, true);


--
-- TOC entry 3678 (class 0 OID 0)
-- Dependencies: 219
-- Name: utilisateur_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateur_id_seq', 12, true);


--
-- TOC entry 3382 (class 2606 OID 16448)
-- Name: utilisateur PK_838f0f99fe900e49ef050030443; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "PK_838f0f99fe900e49ef050030443" PRIMARY KEY (id);


--
-- TOC entry 3378 (class 2606 OID 16435)
-- Name: role PK_b36bcfe02fc8de3c57a8b2391c2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id);


--
-- TOC entry 3445 (class 2606 OID 16789)
-- Name: alerte_document alerte_document_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerte_document
    ADD CONSTRAINT alerte_document_pkey PRIMARY KEY (id);


--
-- TOC entry 3441 (class 2606 OID 16775)
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- TOC entry 3404 (class 2606 OID 16541)
-- Name: chauffeur chauffeur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chauffeur
    ADD CONSTRAINT chauffeur_pkey PRIMARY KEY (id);


--
-- TOC entry 3411 (class 2606 OID 16567)
-- Name: destination destination_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_code_key UNIQUE (code);


--
-- TOC entry 3413 (class 2606 OID 16565)
-- Name: destination destination_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_pkey PRIMARY KEY (id);


--
-- TOC entry 3407 (class 2606 OID 16552)
-- Name: document_chauffeur document_chauffeur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_chauffeur
    ADD CONSTRAINT document_chauffeur_pkey PRIMARY KEY (id);


--
-- TOC entry 3400 (class 2606 OID 16528)
-- Name: document_vehicule document_vehicule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_vehicule
    ADD CONSTRAINT document_vehicule_pkey PRIMARY KEY (id);


--
-- TOC entry 3462 (class 2606 OID 16902)
-- Name: fiche_impression fiche_impression_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_impression
    ADD CONSTRAINT fiche_impression_pkey PRIMARY KEY (id);


--
-- TOC entry 3439 (class 2606 OID 16756)
-- Name: fiche_passager fiche_passager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_passager
    ADD CONSTRAINT fiche_passager_pkey PRIMARY KEY (fiche_id, passager_id);


--
-- TOC entry 3428 (class 2606 OID 16707)
-- Name: fiche fiche_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fiche_pkey PRIMARY KEY (id);


--
-- TOC entry 3430 (class 2606 OID 16709)
-- Name: fiche fiche_reference_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fiche_reference_key UNIQUE (reference);


--
-- TOC entry 3464 (class 2606 OID 16922)
-- Name: fiche_remise fiche_remise_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_remise
    ADD CONSTRAINT fiche_remise_pkey PRIMARY KEY (id);


--
-- TOC entry 3390 (class 2606 OID 16506)
-- Name: gare gare_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gare
    ADD CONSTRAINT gare_code_key UNIQUE (code);


--
-- TOC entry 3392 (class 2606 OID 16504)
-- Name: gare gare_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gare
    ADD CONSTRAINT gare_pkey PRIMARY KEY (id);


--
-- TOC entry 3416 (class 2606 OID 16577)
-- Name: itineraire itineraire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itineraire
    ADD CONSTRAINT itineraire_pkey PRIMARY KEY (id);


--
-- TOC entry 3420 (class 2606 OID 16594)
-- Name: passager passager_numero_cni_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passager
    ADD CONSTRAINT passager_numero_cni_key UNIQUE (numero_cni);


--
-- TOC entry 3422 (class 2606 OID 16592)
-- Name: passager passager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passager
    ADD CONSTRAINT passager_pkey PRIMARY KEY (id);


--
-- TOC entry 3460 (class 2606 OID 16848)
-- Name: proprietaire proprietaire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proprietaire
    ADD CONSTRAINT proprietaire_pkey PRIMARY KEY (id);


--
-- TOC entry 3455 (class 2606 OID 16826)
-- Name: refresh_token refresh_token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_pkey PRIMARY KEY (id);


--
-- TOC entry 3457 (class 2606 OID 16828)
-- Name: refresh_token refresh_token_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_token_hash_key UNIQUE (token_hash);


--
-- TOC entry 3470 (class 2606 OID 41684)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3426 (class 2606 OID 16669)
-- Name: sync_queue sync_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync_queue
    ADD CONSTRAINT sync_queue_pkey PRIMARY KEY (id);


--
-- TOC entry 3380 (class 2606 OID 16416)
-- Name: role ukc36say97xydpmgigg38qv5l2p; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT ukc36say97xydpmgigg38qv5l2p UNIQUE (code);


--
-- TOC entry 3386 (class 2606 OID 16420)
-- Name: utilisateur ukkq7nt5wyq9v9lpcpgxag2f24a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT ukkq7nt5wyq9v9lpcpgxag2f24a UNIQUE (username);


--
-- TOC entry 3388 (class 2606 OID 16418)
-- Name: utilisateur ukrma38wvnqfaf66vvmi57c71lo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT ukrma38wvnqfaf66vvmi57c71lo UNIQUE (email);


--
-- TOC entry 3437 (class 2606 OID 25015)
-- Name: fiche uq_fiche_numero_bordereau; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT uq_fiche_numero_bordereau UNIQUE (numero_bordereau);


--
-- TOC entry 3418 (class 2606 OID 16579)
-- Name: itineraire uq_itineraire_destination_code; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itineraire
    ADD CONSTRAINT uq_itineraire_destination_code UNIQUE (destination_id, code);


--
-- TOC entry 3396 (class 2606 OID 16515)
-- Name: vehicule vehicule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicule
    ADD CONSTRAINT vehicule_pkey PRIMARY KEY (id);


--
-- TOC entry 3398 (class 2606 OID 16517)
-- Name: vehicule vehicule_plaque_immatriculation_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicule
    ADD CONSTRAINT vehicule_plaque_immatriculation_key UNIQUE (plaque_immatriculation);


--
-- TOC entry 3446 (class 1259 OID 16802)
-- Name: idx_alerte_document; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerte_document ON public.alerte_document USING btree (document_id);


--
-- TOC entry 3447 (class 1259 OID 16805)
-- Name: idx_alerte_expiration; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerte_expiration ON public.alerte_document USING btree (date_expiration);


--
-- TOC entry 3448 (class 1259 OID 16803)
-- Name: idx_alerte_proprietaire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerte_proprietaire ON public.alerte_document USING btree (proprietaire_type, proprietaire_id);


--
-- TOC entry 3449 (class 1259 OID 16804)
-- Name: idx_alerte_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerte_statut ON public.alerte_document USING btree (statut);


--
-- TOC entry 3442 (class 1259 OID 16801)
-- Name: idx_audit_entite; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_entite ON public.audit_log USING btree (entite, entite_id);


--
-- TOC entry 3443 (class 1259 OID 16800)
-- Name: idx_audit_utilisateur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_utilisateur ON public.audit_log USING btree (utilisateur_id);


--
-- TOC entry 3405 (class 1259 OID 33212)
-- Name: idx_chauffeur_gare_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chauffeur_gare_id ON public.chauffeur USING btree (gare_id);


--
-- TOC entry 3408 (class 1259 OID 16674)
-- Name: idx_document_chauffeur_chauffeur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_chauffeur_chauffeur ON public.document_chauffeur USING btree (chauffeur_id);


--
-- TOC entry 3409 (class 1259 OID 16675)
-- Name: idx_document_chauffeur_expiration; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_chauffeur_expiration ON public.document_chauffeur USING btree (date_expiration);


--
-- TOC entry 3401 (class 1259 OID 16673)
-- Name: idx_document_vehicule_expiration; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_vehicule_expiration ON public.document_vehicule USING btree (date_expiration);


--
-- TOC entry 3402 (class 1259 OID 16672)
-- Name: idx_document_vehicule_vehicule; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_vehicule_vehicule ON public.document_vehicule USING btree (vehicule_id);


--
-- TOC entry 3431 (class 1259 OID 16797)
-- Name: idx_fiche_chauffeur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_chauffeur ON public.fiche USING btree (chauffeur_id);


--
-- TOC entry 3432 (class 1259 OID 16798)
-- Name: idx_fiche_destination; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_destination ON public.fiche USING btree (destination_id);


--
-- TOC entry 3433 (class 1259 OID 16795)
-- Name: idx_fiche_gare; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_gare ON public.fiche USING btree (gare_id);


--
-- TOC entry 3434 (class 1259 OID 16877)
-- Name: idx_fiche_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_statut ON public.fiche USING btree (statut);


--
-- TOC entry 3435 (class 1259 OID 16796)
-- Name: idx_fiche_vehicule; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_vehicule ON public.fiche USING btree (vehicule_id);


--
-- TOC entry 3414 (class 1259 OID 16676)
-- Name: idx_itineraire_destination; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_itineraire_destination ON public.itineraire USING btree (destination_id);


--
-- TOC entry 3458 (class 1259 OID 16855)
-- Name: idx_proprietaire_telephone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_proprietaire_telephone ON public.proprietaire USING btree (telephone);


--
-- TOC entry 3451 (class 1259 OID 16836)
-- Name: idx_refresh_token_expires_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_token_expires_at ON public.refresh_token USING btree (expires_at);


--
-- TOC entry 3452 (class 1259 OID 41718)
-- Name: idx_refresh_token_session; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_token_session ON public.refresh_token USING btree (session_id);


--
-- TOC entry 3453 (class 1259 OID 16834)
-- Name: idx_refresh_token_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_token_user ON public.refresh_token USING btree (user_id);


--
-- TOC entry 3465 (class 1259 OID 41690)
-- Name: idx_sessions_actives; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_actives ON public.sessions USING btree (utilisateur_id, last_seen_at DESC) WHERE (revoked_at IS NULL);


--
-- TOC entry 3466 (class 1259 OID 41686)
-- Name: idx_sessions_expires; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_expires ON public.sessions USING btree (expires_at);


--
-- TOC entry 3467 (class 1259 OID 41699)
-- Name: idx_sessions_gare; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_gare ON public.sessions USING btree (gare_id);


--
-- TOC entry 3468 (class 1259 OID 41689)
-- Name: idx_sessions_utilisateur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_utilisateur ON public.sessions USING btree (utilisateur_id);


--
-- TOC entry 3423 (class 1259 OID 16678)
-- Name: idx_sync_queue_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sync_queue_entity ON public.sync_queue USING btree (entity_type, entity_id);


--
-- TOC entry 3424 (class 1259 OID 16677)
-- Name: idx_sync_queue_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sync_queue_status ON public.sync_queue USING btree (status);


--
-- TOC entry 3383 (class 1259 OID 16680)
-- Name: idx_utilisateur_gare; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utilisateur_gare ON public.utilisateur USING btree (gare_id);


--
-- TOC entry 3384 (class 1259 OID 16671)
-- Name: idx_utilisateur_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utilisateur_role ON public.utilisateur USING btree (role_id);


--
-- TOC entry 3393 (class 1259 OID 33213)
-- Name: idx_vehicule_gare_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicule_gare_id ON public.vehicule USING btree (gare_id);


--
-- TOC entry 3394 (class 1259 OID 16854)
-- Name: idx_vehicule_proprietaire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicule_proprietaire ON public.vehicule USING btree (proprietaire_id);


--
-- TOC entry 3450 (class 1259 OID 33201)
-- Name: uq_alerte_document_echeance; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_alerte_document_echeance ON public.alerte_document USING btree (document_id, proprietaire_type, date_expiration, type_alerte);


--
-- TOC entry 3471 (class 2606 OID 16453)
-- Name: utilisateur FK_332c39ebc87e25e15a3e80aab48; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "FK_332c39ebc87e25e15a3e80aab48" FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- TOC entry 3490 (class 2606 OID 16790)
-- Name: alerte_document fk_alerte_utilisateur_lecture; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerte_document
    ADD CONSTRAINT fk_alerte_utilisateur_lecture FOREIGN KEY (utilisateur_lecture) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3489 (class 2606 OID 16776)
-- Name: audit_log fk_audit_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT fk_audit_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3476 (class 2606 OID 33202)
-- Name: chauffeur fk_chauffeur_gare; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chauffeur
    ADD CONSTRAINT fk_chauffeur_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3477 (class 2606 OID 16553)
-- Name: document_chauffeur fk_document_chauffeur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_chauffeur
    ADD CONSTRAINT fk_document_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES public.chauffeur(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3475 (class 2606 OID 16529)
-- Name: document_vehicule fk_document_vehicule; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_vehicule
    ADD CONSTRAINT fk_document_vehicule FOREIGN KEY (vehicule_id) REFERENCES public.vehicule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3479 (class 2606 OID 16745)
-- Name: fiche fk_fiche_annulateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_annulateur FOREIGN KEY (annulateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3480 (class 2606 OID 16720)
-- Name: fiche fk_fiche_chauffeur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES public.chauffeur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3481 (class 2606 OID 16735)
-- Name: fiche fk_fiche_createur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_createur FOREIGN KEY (createur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3482 (class 2606 OID 16725)
-- Name: fiche fk_fiche_destination; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_destination FOREIGN KEY (destination_id) REFERENCES public.destination(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3483 (class 2606 OID 16740)
-- Name: fiche fk_fiche_finalisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_finalisateur FOREIGN KEY (finalisateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3484 (class 2606 OID 16710)
-- Name: fiche fk_fiche_gare; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3493 (class 2606 OID 16903)
-- Name: fiche_impression fk_fiche_impression_fiche; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_impression
    ADD CONSTRAINT fk_fiche_impression_fiche FOREIGN KEY (fiche_id) REFERENCES public.fiche(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3494 (class 2606 OID 16908)
-- Name: fiche_impression fk_fiche_impression_imprimeur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_impression
    ADD CONSTRAINT fk_fiche_impression_imprimeur FOREIGN KEY (imprimeur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3485 (class 2606 OID 16730)
-- Name: fiche fk_fiche_itineraire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_itineraire FOREIGN KEY (itineraire_id) REFERENCES public.itineraire(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3487 (class 2606 OID 16757)
-- Name: fiche_passager fk_fiche_passager_fiche; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_passager
    ADD CONSTRAINT fk_fiche_passager_fiche FOREIGN KEY (fiche_id) REFERENCES public.fiche(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3488 (class 2606 OID 16762)
-- Name: fiche_passager fk_fiche_passager_passager; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_passager
    ADD CONSTRAINT fk_fiche_passager_passager FOREIGN KEY (passager_id) REFERENCES public.passager(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3495 (class 2606 OID 16923)
-- Name: fiche_remise fk_fiche_remise_fiche; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_remise
    ADD CONSTRAINT fk_fiche_remise_fiche FOREIGN KEY (fiche_id) REFERENCES public.fiche(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3496 (class 2606 OID 16928)
-- Name: fiche_remise fk_fiche_remise_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_remise
    ADD CONSTRAINT fk_fiche_remise_utilisateur FOREIGN KEY (remise_par_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3486 (class 2606 OID 16715)
-- Name: fiche fk_fiche_vehicule; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_vehicule FOREIGN KEY (vehicule_id) REFERENCES public.vehicule(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3478 (class 2606 OID 16580)
-- Name: itineraire fk_itineraire_destination; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itineraire
    ADD CONSTRAINT fk_itineraire_destination FOREIGN KEY (destination_id) REFERENCES public.destination(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3491 (class 2606 OID 41729)
-- Name: refresh_token fk_refresh_token_session; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT fk_refresh_token_session FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3492 (class 2606 OID 16829)
-- Name: refresh_token fk_refresh_token_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3497 (class 2606 OID 41713)
-- Name: sessions fk_sessions_gare; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_sessions_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3498 (class 2606 OID 41708)
-- Name: sessions fk_sessions_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_sessions_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3472 (class 2606 OID 16691)
-- Name: utilisateur fk_utilisateur_gare; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT fk_utilisateur_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3473 (class 2606 OID 33207)
-- Name: vehicule fk_vehicule_gare; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicule
    ADD CONSTRAINT fk_vehicule_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3474 (class 2606 OID 16849)
-- Name: vehicule fk_vehicule_proprietaire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicule
    ADD CONSTRAINT fk_vehicule_proprietaire FOREIGN KEY (proprietaire_id) REFERENCES public.proprietaire(id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2026-11-07 08:32:46

--
-- PostgreSQL database dump complete
--

\unrestrict iMfo1l2TOZIHarabUyx1eWfN3EBv4YPabyPNarh4hESlFjPoBIU6nbS3ZqhoKFG

