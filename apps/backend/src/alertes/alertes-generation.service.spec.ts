import { AlertesGenerationService } from './alertes-generation.service';
import { AlerteProprietaireType } from './enums/alerte-proprietaire-type.enum';
import { AlerteType } from './enums/alerte-type.enum';
import { AlerteStatut } from './enums/alerte-statut.enum';
import { DocumentChauffeur } from '../documents/entities/document-chauffeur.entity';
import { DocumentVehicule } from '../documents/entities/document-vehicule.entity';

type DocumentQueryBuilder = {
  where: jest.Mock;
  andWhere: jest.Mock;
  getMany: jest.Mock;
};

describe('AlertesGenerationService', () => {
  let service: AlertesGenerationService;
  let documentsChauffeurs: DocumentChauffeur[];
  let documentsVehicules: DocumentVehicule[];
  let executeInsert: jest.Mock;
  let valuesInsert: jest.Mock;
  let loggerSpy: jest.SpyInstance;
  let chauffeurQueryBuilder: DocumentQueryBuilder;
  let vehiculeQueryBuilder: DocumentQueryBuilder;

  const dateDansHuitJours = (): string => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + 8);
    return date.toISOString().slice(0, 10);
  };

  const creerQueryBuilderDocuments = (
    getDocuments: () => unknown[],
  ): DocumentQueryBuilder => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(async () => getDocuments()),
  });

  beforeEach(() => {
    documentsChauffeurs = [];
    documentsVehicules = [];

    executeInsert = jest.fn(async () => ({
      raw: [{ id: 'alerte-test-id' }],
    }));

    valuesInsert = jest.fn().mockReturnThis();

    const alerteQueryBuilder = {
      insert: jest.fn().mockReturnThis(),
      values: valuesInsert,
      orIgnore: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      execute: executeInsert,
    };

    const alerteRepository = {
      createQueryBuilder: jest.fn(() => alerteQueryBuilder),
    };

    chauffeurQueryBuilder = creerQueryBuilderDocuments(
      () => documentsChauffeurs,
    );
    vehiculeQueryBuilder = creerQueryBuilderDocuments(
      () => documentsVehicules,
    );

    const chauffeurRepository = {
      createQueryBuilder: jest.fn(() => chauffeurQueryBuilder),
    };

    const vehiculeRepository = {
      createQueryBuilder: jest.fn(() => vehiculeQueryBuilder),
    };

    service = new AlertesGenerationService(
      alerteRepository as any,
      chauffeurRepository as any,
      vehiculeRepository as any,
    );

    loggerSpy = jest
      .spyOn((service as any).logger, 'log')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('crée une alerte ATTENTION non lue pour un véhicule admissible', async () => {
    const expiration = dateDansHuitJours();

    documentsVehicules = [
      {
        id: 'document-vehicule-test',
        vehiculeId: 'vehicule-test',
        typeDocument: 'ASSURANCE',
        dateExpiration: expiration,
        statut: 'VALIDE',
      } as DocumentVehicule,
    ];

    await service.genererAlertesAutomatiquement();

    expect(valuesInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        documentId: 'document-vehicule-test',
        proprietaireType: AlerteProprietaireType.VEHICULE,
        proprietaireId: 'vehicule-test',
        typeDocument: 'ASSURANCE',
        typeAlerte: AlerteType.ATTENTION,
        statut: AlerteStatut.NON_LUE,
        dateExpiration: expiration,
        dateLecture: null,
        utilisateurLecture: null,
      }),
    );

    expect(loggerSpy).toHaveBeenLastCalledWith(
      'Vérification terminée : 1 nouvelle(s) alerte(s).',
    );
  });

  it('crée une alerte ATTENTION non lue pour un chauffeur admissible', async () => {
    const expiration = dateDansHuitJours();

    documentsChauffeurs = [
      {
        id: 'document-chauffeur-test',
        chauffeurId: 'chauffeur-test',
        typeDocument: 'PERMIS_CONDUIRE',
        dateExpiration: expiration,
        statut: 'VALIDE',
      } as DocumentChauffeur,
    ];

    await service.genererAlertesAutomatiquement();

    expect(valuesInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        documentId: 'document-chauffeur-test',
        proprietaireType: AlerteProprietaireType.CHAUFFEUR,
        proprietaireId: 'chauffeur-test',
        typeDocument: 'PERMIS_CONDUIRE',
        typeAlerte: AlerteType.ATTENTION,
        statut: AlerteStatut.NON_LUE,
        dateExpiration: expiration,
        dateLecture: null,
        utilisateurLecture: null,
      }),
    );

    expect(loggerSpy).toHaveBeenLastCalledWith(
      'Vérification terminée : 1 nouvelle(s) alerte(s).',
    );
  });

  it('recherche les documents VALIDE dont l’expiration est dans les 30 jours', async () => {
    await service.genererAlertesAutomatiquement();

    const parties = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Toronto',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());

    const annee = parties.find((p) => p.type === 'year')!.value;
    const mois = parties.find((p) => p.type === 'month')!.value;
    const jour = parties.find((p) => p.type === 'day')!.value;

    const aujourdHui = `${annee}-${mois}-${jour}`;

    const dateLimiteDate = new Date(`${aujourdHui}T00:00:00.000Z`);
    dateLimiteDate.setUTCDate(dateLimiteDate.getUTCDate() + 30);
    const dateLimite = dateLimiteDate.toISOString().slice(0, 10);

    for (const builder of [
      chauffeurQueryBuilder,
      vehiculeQueryBuilder,
    ]) {
      expect(builder.where).toHaveBeenCalledWith(
        'doc.dateExpiration >= :aujourdHui',
        { aujourdHui },
      );

      expect(builder.andWhere).toHaveBeenCalledWith(
        'doc.dateExpiration <= :dateLimite',
        { dateLimite },
      );

      expect(builder.andWhere).toHaveBeenCalledWith(
        'doc.statut = :statut',
        { statut: 'VALIDE' },
      );

      expect(builder.getMany).toHaveBeenCalledTimes(1);
    }
  });

  it('ne compte pas une insertion ignorée comme une nouvelle alerte', async () => {
    executeInsert.mockResolvedValue({ raw: [] });

    documentsVehicules = [
      {
        id: 'document-vehicule-test',
        vehiculeId: 'vehicule-test',
        typeDocument: 'ASSURANCE',
        dateExpiration: dateDansHuitJours(),
        statut: 'VALIDE',
      } as DocumentVehicule,
    ];

    await service.genererAlertesAutomatiquement();

    expect(valuesInsert).toHaveBeenCalledTimes(1);

    expect(loggerSpy).toHaveBeenLastCalledWith(
      'Vérification terminée : 0 nouvelle(s) alerte(s).',
    );
  });

  it('ne tente aucune insertion lorsqu’aucun document n’est admissible', async () => {
    await service.genererAlertesAutomatiquement();

    expect(valuesInsert).not.toHaveBeenCalled();

    expect(loggerSpy).toHaveBeenLastCalledWith(
      'Vérification terminée : 0 nouvelle(s) alerte(s).',
    );
  });
});
