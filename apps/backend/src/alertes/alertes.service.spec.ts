
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { AlertesService } from './alertes.service';
import { AlerteDocument } from './entities/alerte-document.entity';
import { DocumentChauffeur } from '../documents/entities/document-chauffeur.entity';
import { DocumentVehicule } from '../documents/entities/document-vehicule.entity';
import { CreateAlerteDto } from './dto/create-alerte.dto';
import { AlerteProprietaireType } from './enums/alerte-proprietaire-type.enum';
import { AlerteStatut } from './enums/alerte-statut.enum';
import { AlerteType } from './enums/alerte-type.enum';

describe('AlertesService', () => {
  let service: AlertesService;

  const alerteRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const documentChauffeurRepository = {
    find: jest.fn(),
  };

  const documentVehiculeRepository = {
    find: jest.fn(),
  };

  const dtoValide: CreateAlerteDto = {
    typeDocument: 'PERMIS_CONDUIRE',
    documentId: '11111111-1111-4111-8111-111111111111',
    proprietaireType: AlerteProprietaireType.CHAUFFEUR,
    proprietaireId: '22222222-2222-4222-8222-222222222222',
    dateDeclenchement: '2026-10-01',
    dateExpiration: '2026-11-15',
    typeAlerte: AlerteType.ATTENTION,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertesService,
        {
          provide: getRepositoryToken(AlerteDocument),
          useValue: alerteRepository,
        },
        {
          provide: getRepositoryToken(DocumentChauffeur),
          useValue: documentChauffeurRepository,
        },
        {
          provide: getRepositoryToken(DocumentVehicule),
          useValue: documentVehiculeRepository,
        },
      ],
    }).compile();

    service = module.get<AlertesService>(AlertesService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('devrait créer une alerte avec le statut NON_LUE', async () => {
      const alerteCreee = {
        ...dtoValide,
        statut: AlerteStatut.NON_LUE,
        dateLecture: null,
        utilisateurLecture: null,
      };

      alerteRepository.create.mockReturnValue(alerteCreee);
      alerteRepository.save.mockResolvedValue(alerteCreee);

      const resultat = await service.create(dtoValide);

      expect(alerteRepository.create).toHaveBeenCalledWith({
        ...dtoValide,
        statut: AlerteStatut.NON_LUE,
        dateLecture: null,
        utilisateurLecture: null,
      });
      expect(alerteRepository.save).toHaveBeenCalledWith(alerteCreee);
      expect(resultat.statut).toBe(AlerteStatut.NON_LUE);
      expect(resultat.dateLecture).toBeNull();
      expect(resultat.utilisateurLecture).toBeNull();
    });

    it('devrait refuser une expiration antérieure au déclenchement', async () => {
      const dtoInvalide = {
        ...dtoValide,
        dateDeclenchement: '2026-11-15',
        dateExpiration: '2026-10-01',
      };

      await expect(service.create(dtoInvalide)).rejects.toThrow(
        ConflictException,
      );

      expect(alerteRepository.create).not.toHaveBeenCalled();
      expect(alerteRepository.save).not.toHaveBeenCalled();
    });

    it('devrait accepter une expiration égale au déclenchement', async () => {
      const dto = {
        ...dtoValide,
        dateDeclenchement: '2026-10-15',
        dateExpiration: '2026-10-15',
      };

      alerteRepository.create.mockImplementation((data) => data);
      alerteRepository.save.mockImplementation(async (data) => data);

      const resultat = await service.create(dto);

      expect(resultat.dateExpiration).toBe('2026-10-15');
      expect(alerteRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('devrait retourner une alerte existante', async () => {
      const alerte = {
        id: '33333333-3333-4333-8333-333333333333',
        statut: AlerteStatut.NON_LUE,
      } as AlerteDocument;

      alerteRepository.findOne.mockResolvedValue(alerte);

      await expect(service.findOne(alerte.id)).resolves.toBe(alerte);

      expect(alerteRepository.findOne).toHaveBeenCalledWith({
        where: { id: alerte.id },
      });
    });

    it('devrait lever NotFoundException si l’alerte est introuvable', async () => {
      alerteRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('33333333-3333-4333-8333-333333333333'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('marquerCommeLue', () => {
    it('devrait enregistrer le statut et les informations de lecture', async () => {
      const alerte = {
        id: '33333333-3333-4333-8333-333333333333',
        statut: AlerteStatut.NON_LUE,
        dateLecture: null,
        utilisateurLecture: null,
      } as AlerteDocument;

      alerteRepository.findOne.mockResolvedValue(alerte);
      alerteRepository.save.mockImplementation(async (data) => data);

      const resultat = await service.marquerCommeLue(alerte.id, 42);

      expect(resultat.statut).toBe(AlerteStatut.LUE);
      expect(resultat.utilisateurLecture).toBe(42);
      expect(resultat.dateLecture).toBeInstanceOf(Date);
      expect(alerteRepository.save).toHaveBeenCalledWith(alerte);
    });

    it('ne devrait pas écraser les informations de lecture existantes', async () => {
      const premiereDateLecture = new Date('2026-10-20T14:00:00.000Z');

      const alerte = {
        id: '33333333-3333-4333-8333-333333333333',
        statut: AlerteStatut.LUE,
        dateLecture: premiereDateLecture,
        utilisateurLecture: 12,
      } as AlerteDocument;

      alerteRepository.findOne.mockResolvedValue(alerte);

      const resultat = await service.marquerCommeLue(alerte.id, 42);

      expect(resultat).toBe(alerte);
      expect(resultat.dateLecture).toBe(premiereDateLecture);
      expect(resultat.utilisateurLecture).toBe(12);
      expect(alerteRepository.save).not.toHaveBeenCalled();
    });

    it('devrait propager NotFoundException si l’alerte est introuvable', async () => {
      alerteRepository.findOne.mockResolvedValue(null);

      await expect(
        service.marquerCommeLue(
          '33333333-3333-4333-8333-333333333333',
          42,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('devrait enrichir les alertes avec les informations des propriétaires', async () => {
      const alerteChauffeur = {
        id: '33333333-3333-4333-8333-333333333333',
        documentId: dtoValide.documentId,
        proprietaireType: AlerteProprietaireType.CHAUFFEUR,
        statut: AlerteStatut.NON_LUE,
        dateExpiration: '2026-11-15',
      };

      const alerteVehicule = {
        id: '44444444-4444-4444-8444-444444444444',
        documentId: '55555555-5555-4555-8555-555555555555',
        proprietaireType: AlerteProprietaireType.VEHICULE,
        statut: AlerteStatut.NON_LUE,
        dateExpiration: '2026-12-01',
      };

      alerteRepository.find.mockResolvedValue([
        alerteChauffeur,
        alerteVehicule,
      ]);

      documentChauffeurRepository.find.mockResolvedValue([
        {
          id: dtoValide.documentId,
          typeDocument: 'PERMIS_CONDUIRE',
          numeroDocument: 'PC-123',
          dateExpiration: '2026-11-15',
          statut: 'VALIDE',
          chauffeur: {
            id: dtoValide.proprietaireId,
            nom: 'Dupont',
            prenom: 'Jean',
          },
        },
      ]);

      documentVehiculeRepository.find.mockResolvedValue([
        {
          id: alerteVehicule.documentId,
          typeDocument: 'ASSURANCE',
          numeroDocument: 'ASS-456',
          dateExpiration: '2026-12-01',
          statut: 'VALIDE',
          vehicule: {
            id: '66666666-6666-4666-8666-666666666666',
            plaqueImmatriculation: 'ABC-123',
            marque: 'Toyota',
            modele: 'Corolla',
          },
        },
      ]);

      const resultat = await service.findAll();

      expect(resultat).toHaveLength(2);

      expect(resultat[0].document).toMatchObject({
        id: dtoValide.documentId,
        numeroDocument: 'PC-123',
      });
      expect(resultat[0].proprietaire).toMatchObject({
        nom: 'Dupont',
        prenom: 'Jean',
      });

      expect(resultat[1].document).toMatchObject({
        id: alerteVehicule.documentId,
        numeroDocument: 'ASS-456',
      });
      expect(resultat[1].proprietaire).toMatchObject({
        plaqueImmatriculation: 'ABC-123',
        marque: 'Toyota',
        modele: 'Corolla',
      });
    });
  });
});
