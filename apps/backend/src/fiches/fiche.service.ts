
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { Fiche } from './entities/fiche.entity';
import { CreateFicheDto } from './dto/create-fiche.dto';
import { UpdateFicheDto } from './dto/update-fiche.dto';
import { ImprimerFicheDto } from '../fiche-impressions/dto/imprimer-fiche.dto';
import { FicheStatut } from './enums/fiche-statut.enum';
import { FicheImpressionsService } from '../fiche-impressions/fiche-impressions.service';
import { FicheImpression } from '../fiche-impressions/entities/fiche-impression.entity';
import { AuditService } from '../audit/audit.service';

type FicheUserContext = {
  id: number;
  username: string;
  role: string;
  gareId: string | null;
};

@Injectable()
export class FicheService {
  constructor(
    @InjectRepository(Fiche)
    private readonly ficheRepository: Repository<Fiche>,

    private readonly ficheImpressionsService: FicheImpressionsService,

    private readonly dataSource: DataSource,

    private readonly auditService: AuditService,
  ) {}

  // =====================================================
  // CONFIGURATION DES RELATIONS
  // =====================================================

  private readonly ficheRelations = {
    gare: true,
    vehicule: true,
    chauffeur: true,
    destination: true,
    itineraire: true,
    createur: true,
    finalisateur: true,
    annulateur: true,
    fichePassagers: {
      passager: true,
    },
  };

  // =====================================================
  // SNAPSHOT POUR L'AUDIT
  // =====================================================

  private creerSnapshot(fiche: Fiche): Record<string, unknown> {
    const relations = [
      'gare',
      'vehicule',
      'chauffeur',
      'destination',
      'itineraire',
      'createur',
      'finalisateur',
      'annulateur',
      'fichePassagers',
    ];

    const snapshot: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(fiche)) {
      if (relations.includes(key) || typeof value === 'function') {
        continue;
      }

      snapshot[key] = value;
    }

    return snapshot;
  }

  // =====================================================
  // JOURNAL D'AUDIT
  // =====================================================

  private async enregistrerAudit(
    manager: EntityManager,
    action: string,
    ficheId: string,
    user: FicheUserContext,
    ancienneValeur: Record<string, unknown> | null,
    nouvelleValeur: Record<string, unknown> | null,
    appareilId: string | null,
  ): Promise<void> {
    await this.auditService.createLog(
      {
        utilisateurId: user.id,
        action,
        entite: 'FICHE',
        entiteId: ficheId,
        ancienneValeur,
        nouvelleValeur,
        appareilId,
      },
      manager,
    );
  }

  // =====================================================
  // CONTRÔLE D'ACCÈS AUX GARES
  // =====================================================

  private peutConsulterToutesLesGares(
    user: FicheUserContext,
  ): boolean {
    return (
      user.role === 'ADMIN' ||
      user.role === 'AUTORITE_HABILITEE'
    );
  }

  private exigerGareUtilisateur(
    user: FicheUserContext,
  ): string {
    if (!user.gareId) {
      throw new ForbiddenException(
        'Votre compte n’est associé à aucune gare.',
      );
    }

    return user.gareId;
  }

  private verifierGareCreation(
    gareId: string,
    user: FicheUserContext,
  ): void {
    if (user.role === 'ADMIN') {
      return;
    }

    const rolesAutorises = [
      'AGENT',
      'CONTROLEUR',
      'RESPONSABLE_GARE',
    ];

    if (!rolesAutorises.includes(user.role)) {
      throw new ForbiddenException(
        'Votre rôle ne permet pas de créer une fiche.',
      );
    }

    const gareUtilisateur = this.exigerGareUtilisateur(user);

    if (gareId !== gareUtilisateur) {
      throw new ForbiddenException(
        'Vous ne pouvez pas créer une fiche dans une autre gare.',
      );
    }
  }

  // =====================================================
  // CHARGER UNE FICHE AVEC CONTRÔLE D'ACCÈS
  // =====================================================

  private async chargerFiche(
    manager: EntityManager,
    id: string,
    user: FicheUserContext,
  ): Promise<Fiche> {
    const where = this.peutConsulterToutesLesGares(user)
      ? { id }
      : {
          id,
          gareId: this.exigerGareUtilisateur(user),
        };

    const fiche = await manager.getRepository(Fiche).findOne({
      where,
      relations: this.ficheRelations,
    });

    if (!fiche) {
      throw new NotFoundException('Fiche introuvable.');
    }

    return fiche;
  }

  // =====================================================
  // CRÉER UNE FICHE
  // =====================================================

  async create(
    createFicheDto: CreateFicheDto,
    user: FicheUserContext,
    appareilId: string | null = null,
  ): Promise<Fiche> {
    this.verifierGareCreation(createFicheDto.gareId, user);

    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Fiche);

      const fiche = repository.create({
        ...createFicheDto,
        statut: FicheStatut.EN_ATTENTE,
        createurId: user.id,
      });

      const ficheEnregistree = await repository.save(fiche);

      const ficheComplete = await repository.findOne({
        where: { id: ficheEnregistree.id },
        relations: this.ficheRelations,
      });

      if (!ficheComplete) {
        throw new NotFoundException(
          'Fiche introuvable après sa création.',
        );
      }

      await this.enregistrerAudit(
        manager,
        'CREATE',
        ficheComplete.id,
        user,
        null,
        this.creerSnapshot(ficheComplete),
        appareilId,
      );

      return ficheComplete;
    });
  }

  // =====================================================
  // CONSULTER TOUTES LES FICHES AUTORISÉES
  // =====================================================

  async findAll(user: FicheUserContext): Promise<Fiche[]> {
    const where = this.peutConsulterToutesLesGares(user)
      ? {}
      : {
          gareId: this.exigerGareUtilisateur(user),
        };

    return this.ficheRepository.find({
      where,
      relations: this.ficheRelations,
      order: {
        dateCreation: 'DESC',
      },
    });
  }

  // =====================================================
  // CONSULTER UNE FICHE
  // =====================================================

  async findOne(
    id: string,
    user: FicheUserContext,
  ): Promise<Fiche> {
    const where = this.peutConsulterToutesLesGares(user)
      ? { id }
      : {
          id,
          gareId: this.exigerGareUtilisateur(user),
        };

    const fiche = await this.ficheRepository.findOne({
      where,
      relations: this.ficheRelations,
    });

    if (!fiche) {
      throw new NotFoundException('Fiche introuvable.');
    }

    return fiche;
  }

  // =====================================================
  // PRENDRE EN CHARGE
  // EN_ATTENTE → EN_COURS
  // =====================================================

  async prendreEnCharge(
    id: string,
    user: FicheUserContext,
    appareilId: string | null = null,
  ): Promise<Fiche> {
    return this.dataSource.transaction(async (manager) => {
      const fiche = await this.chargerFiche(manager, id, user);

      if (fiche.statut !== FicheStatut.EN_ATTENTE) {
        throw new BadRequestException(
          `La fiche doit être EN_ATTENTE pour être prise en charge. Statut actuel : ${fiche.statut}.`,
        );
      }

      const ancienneValeur = this.creerSnapshot(fiche);

      fiche.statut = FicheStatut.EN_COURS;

      const ficheEnregistree = await manager
        .getRepository(Fiche)
        .save(fiche);

      await this.enregistrerAudit(
        manager,
        'PRENDRE_EN_CHARGE',
        fiche.id,
        user,
        ancienneValeur,
        this.creerSnapshot(ficheEnregistree),
        appareilId,
      );

      return ficheEnregistree;
    });
  }

  // =====================================================
  // FINALISER
  // EN_COURS → FINALISEE
  // =====================================================

  async finaliser(
    id: string,
    user: FicheUserContext,
    appareilId: string | null = null,
  ): Promise<Fiche> {
    return this.dataSource.transaction(async (manager) => {
      const fiche = await this.chargerFiche(manager, id, user);

      if (fiche.statut !== FicheStatut.EN_COURS) {
        throw new BadRequestException(
          `La fiche doit être EN_COURS pour être finalisée. Statut actuel : ${fiche.statut}.`,
        );
      }

      const ancienneValeur = this.creerSnapshot(fiche);

      fiche.statut = FicheStatut.FINALISEE;
      fiche.finalisateurId = user.id;
      fiche.dateFinalisation = new Date();

      const ficheEnregistree = await manager
        .getRepository(Fiche)
        .save(fiche);

      await this.enregistrerAudit(
        manager,
        'FINALISER',
        fiche.id,
        user,
        ancienneValeur,
        this.creerSnapshot(ficheEnregistree),
        appareilId,
      );

      return ficheEnregistree;
    });
  }

  // =====================================================
  // MODIFIER UNE FICHE
  // =====================================================

  async update(
    id: string,
    updateFicheDto: UpdateFicheDto,
    user: FicheUserContext,
    appareilId: string | null = null,
  ): Promise<Fiche> {
    return this.dataSource.transaction(async (manager) => {
      const fiche = await this.chargerFiche(manager, id, user);

      if (
        fiche.statut !== FicheStatut.EN_ATTENTE &&
        fiche.statut !== FicheStatut.EN_COURS &&
        fiche.statut !== FicheStatut.FINALISEE
      ) {
        throw new BadRequestException(
          `La fiche ne peut plus être modifiée lorsque son statut est ${fiche.statut}.`,
        );
      }

      const ancienneValeur = this.creerSnapshot(fiche);

      Object.assign(fiche, updateFicheDto);

      const ficheEnregistree = await manager
        .getRepository(Fiche)
        .save(fiche);

      await this.enregistrerAudit(
        manager,
        'UPDATE',
        fiche.id,
        user,
        ancienneValeur,
        this.creerSnapshot(ficheEnregistree),
        appareilId,
      );

      return ficheEnregistree;
    });
  }

  // =====================================================
  // SUPPRIMER UNE FICHE
  // =====================================================

  async remove(
    id: string,
    user: FicheUserContext,
    appareilId: string | null = null,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const fiche = await this.chargerFiche(manager, id, user);

      const ancienneValeur = this.creerSnapshot(fiche);

      await manager.getRepository(Fiche).remove(fiche);

      await this.enregistrerAudit(
        manager,
        'DELETE',
        id,
        user,
        ancienneValeur,
        null,
        appareilId,
      );
    });
  }

  // =====================================================
  // IMPRIMER UNE FICHE
  // FINALISEE → IMPRIMEE
  // =====================================================

  async imprimer(
    id: string,
    user: FicheUserContext,
    dto: ImprimerFicheDto = {},
    appareilId: string | null = null,
  ): Promise<Fiche> {
    return this.dataSource.transaction(async (manager) => {
      const ficheRepository = manager.getRepository(Fiche);

      const fiche = await ficheRepository.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!fiche) {
        throw new NotFoundException(`Fiche ${id} introuvable`);
      }

      // Vérifier l'accès à la gare.
      if (!this.peutConsulterToutesLesGares(user)) {
        const gareUtilisateur = this.exigerGareUtilisateur(user);

        if (fiche.gareId !== gareUtilisateur) {
          throw new ForbiddenException(
            'Vous ne pouvez pas imprimer une fiche d’une autre gare.',
          );
        }
      }

      const ancienneValeur = this.creerSnapshot(fiche);

      const impressionRepository =
        manager.getRepository(FicheImpression);

      const impressions = await impressionRepository
        .createQueryBuilder('impression')
        .where('impression.ficheId = :ficheId', {
          ficheId: fiche.id,
        })
        .getMany();

      const numeroExemplaireSuivant = impressions.reduce(
        (max, impression) =>
          Math.max(max, Number(impression.numeroExemplaire) || 0),
        0,
      ) + 1;

      if (fiche.statut === FicheStatut.FINALISEE) {
        if (numeroExemplaireSuivant !== 1) {
          throw new BadRequestException(
            'Une impression existe déjà pour cette fiche. Vérifiez son historique.',
          );
        }

        fiche.statut = FicheStatut.IMPRIMEE;
      } else if (fiche.statut === FicheStatut.IMPRIMEE) {
        if (numeroExemplaireSuivant <= 1) {
          throw new BadRequestException(
            'Historique d’impression incohérent : impossible de réimprimer cette fiche.',
          );
        }

        const motif = dto.motifReimpression?.trim();

        if (!motif || motif.length < 5) {
          throw new BadRequestException(
            'Un motif de réimpression d’au moins 5 caractères est obligatoire.',
          );
        }
      } else {
        throw new BadRequestException(
          `La fiche doit être FINALISEE pour une première impression ou IMPRIMEE pour une réimpression. Statut actuel : ${fiche.statut}.`,
        );
      }

      await this.ficheImpressionsService.create(
        {
          ficheId: fiche.id,
          numeroExemplaire: numeroExemplaireSuivant,
          motifReimpression:
            numeroExemplaireSuivant > 1
              ? dto.motifReimpression!.trim()
              : undefined,
        },
        user.id,
        manager,
      );

      const ficheEnregistree = await ficheRepository.save(fiche);

      const ficheComplete = await ficheRepository.findOne({
        where: { id: fiche.id },
        relations: this.ficheRelations,
      });

      if (!ficheComplete) {
        throw new NotFoundException(
          `Fiche ${fiche.id} introuvable après impression.`,
        );
      }

      await this.enregistrerAudit(
        manager,
        'IMPRIMER',
        fiche.id,
        user,
        ancienneValeur,
        {
          ...this.creerSnapshot(ficheComplete),
          impression: {
            numeroExemplaire: numeroExemplaireSuivant,
            motifReimpression:
              numeroExemplaireSuivant > 1
                ? dto.motifReimpression!.trim()
                : null,
          },
        },
        appareilId,
      );

      return ficheComplete;
    });
  }
}
