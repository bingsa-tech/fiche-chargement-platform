
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateGareDto } from './dto/create-gare.dto';
import { UpdateGareDto } from './dto/update-gare.dto';
import { Gare } from './entities/gare.entity';

import { AuditService } from '../audit/audit.service';

@Injectable()
export class GaresService {
  constructor(
    @InjectRepository(Gare)
    private readonly gareRepository: Repository<Gare>,

    private readonly auditService: AuditService,

    private readonly dataSource: DataSource,
  ) {}

  // =====================================================
  // SNAPSHOT POUR AUDIT
  // =====================================================

  private createGareSnapshot(gare: Gare) {
    return {
      id: gare.id,
      code: gare.code,
      nom: gare.nom,
      ville: gare.ville,
      adresse: gare.adresse,
      statut: gare.statut,
      latitude: gare.latitude,
      longitude: gare.longitude,

      // Utilisé pour le périmètre de consultation
      // du RESPONSABLE_GARE.
      gareId: gare.id,
    };
  }

  // =====================================================
  // CREATE + AUDIT
  // =====================================================

  async create(
    createGareDto: CreateGareDto,
    utilisateurId: number,
    appareilId: string | null = null,
  ): Promise<Gare> {
    if (!Number.isInteger(utilisateurId) || utilisateurId <= 0) {
      throw new Error(
        'Identifiant utilisateur invalide pour l’audit.',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Gare);

      const gare = repository.create(createGareDto);

      let gareEnregistree: Gare;

      try {
        gareEnregistree = await repository.save(gare);
      } catch {
        throw new ConflictException(
          'Impossible de créer la gare. Le code existe peut-être déjà.',
        );
      }

      await this.auditService.createLog(
        {
          utilisateurId,
          action: 'CREATE',
          entite: 'GARE',
          entiteId: gareEnregistree.id,
          ancienneValeur: null,
          nouvelleValeur: this.createGareSnapshot(
            gareEnregistree,
          ),
          appareilId,
        },
        manager,
      );

      return gareEnregistree;
    });
  }

  // =====================================================
  // READ ALL
  // =====================================================

  async findAll(): Promise<Gare[]> {
    return this.gareRepository.find({
      order: {
        nom: 'ASC',
      },
    });
  }

  // =====================================================
  // READ ONE
  // =====================================================

  async findOne(id: string): Promise<Gare> {
    const gare = await this.gareRepository.findOne({
      where: { id },
    });

    if (!gare) {
      throw new NotFoundException(
        `Gare avec l'identifiant ${id} introuvable.`,
      );
    }

    return gare;
  }

  // =====================================================
  // UPDATE + AUDIT
  // =====================================================

  async update(
    id: string,
    updateGareDto: UpdateGareDto,
    utilisateurId: number,
    appareilId: string | null = null,
  ): Promise<Gare> {
    if (!Number.isInteger(utilisateurId) || utilisateurId <= 0) {
      throw new Error(
        'Identifiant utilisateur invalide pour l’audit.',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Gare);

      const gare = await repository.findOne({
        where: { id },
      });

      if (!gare) {
        throw new NotFoundException(
          `Gare avec l'identifiant ${id} introuvable.`,
        );
      }

      // Capturer les valeurs avant modification.
      const ancienneValeur = this.createGareSnapshot(gare);

      Object.assign(gare, updateGareDto);

      let gareActualisee: Gare;

      try {
        gareActualisee = await repository.save(gare);
      } catch {
        throw new ConflictException(
          'Impossible de modifier la gare. Le code existe peut-être déjà.',
        );
      }

      // Enregistrer les valeurs après modification.
      await this.auditService.createLog(
        {
          utilisateurId,
          action: 'UPDATE',
          entite: 'GARE',
          entiteId: gareActualisee.id,
          ancienneValeur,
          nouvelleValeur: this.createGareSnapshot(
            gareActualisee,
          ),
          appareilId,
        },
        manager,
      );

      return gareActualisee;
    });
  }

  // =====================================================
  // DELETE + AUDIT
  // =====================================================

  async remove(
    id: string,
    utilisateurId: number,
    appareilId: string | null = null,
  ): Promise<void> {
    if (!Number.isInteger(utilisateurId) || utilisateurId <= 0) {
      throw new Error(
        'Identifiant utilisateur invalide pour l’audit.',
      );
    }

    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Gare);

      const gare = await repository.findOne({
        where: { id },
      });

      if (!gare) {
        throw new NotFoundException(
          `Gare avec l'identifiant ${id} introuvable.`,
        );
      }

      // Capturer les anciennes valeurs avant suppression.
      const ancienneValeur = this.createGareSnapshot(gare);

      try {
        await repository.remove(gare);
      } catch {
        throw new ConflictException(
          'Impossible de supprimer cette gare car elle est utilisée par une fiche ou un utilisateur.',
        );
      }

      // Le UUID est conservé dans le journal même
      // si la gare n'existe plus.
      await this.auditService.createLog(
        {
          utilisateurId,
          action: 'DELETE',
          entite: 'GARE',
          entiteId: id,
          ancienneValeur,
          nouvelleValeur: null,
          appareilId,
        },
        manager,
      );
    });
  }
}
