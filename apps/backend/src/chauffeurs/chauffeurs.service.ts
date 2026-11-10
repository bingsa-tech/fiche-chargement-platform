
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateChauffeurDto } from './dto/create-chauffeur.dto';
import { UpdateChauffeurDto } from './dto/update-chauffeur.dto';

import { Chauffeur } from './entities/chauffeur.entity';
import { DocumentChauffeur } from '../documents/entities/document-chauffeur.entity';
import { Gare } from '../gares/entities/gare.entity';

import { AuditService } from '../audit/audit.service';

type UtilisateurAuthentifie = {
  sub: number;
  username: string;
  role: string;
  gareId: string | null;
};

@Injectable()
export class ChauffeursService {
  constructor(
    @InjectRepository(Chauffeur)
    private readonly chauffeurRepository: Repository<Chauffeur>,

    private readonly dataSource: DataSource,

    @InjectRepository(Gare)
    private readonly gareRepository: Repository<Gare>,

    private readonly auditService: AuditService,
  ) {}

  /**
   * Retourne la gare de l'utilisateur non administrateur.
   */
  private getGareId(user: UtilisateurAuthentifie): string {
    if (user.role === 'ADMIN') {
      throw new BadRequestException(
        'La gare doit être déterminée séparément pour un administrateur.',
      );
    }

    if (!user.gareId) {
      throw new ForbiddenException(
        "Aucune gare n'est associée à cet utilisateur.",
      );
    }

    return user.gareId;
  }

  /**
   * Construit un snapshot JSON sans inclure les relations TypeORM.
   */
  private createChauffeurSnapshot(
    chauffeur: Chauffeur,
    document?: DocumentChauffeur | null,
  ): Record<string, unknown> {
    const relationsToExclude = ['gare', 'documentChauffeurs'];

    const snapshot = Object.fromEntries(
      Object.entries(chauffeur).filter(
        ([key, value]) =>
          !relationsToExclude.includes(key) &&
          typeof value !== 'function',
      ),
    );

    if (document !== undefined) {
      snapshot.document = document
        ? Object.fromEntries(
            Object.entries(document).filter(
              ([key, value]) => typeof value !== 'function',
            ),
          )
        : null;
    }

    return snapshot;
  }

  async create(
    createChauffeurDto: CreateChauffeurDto,
    user: UtilisateurAuthentifie,
    appareilId: string | null = null,
  ): Promise<Chauffeur> {
    const { document, gareId: gareDemandee, ...chauffeurData } =
      createChauffeurDto;

    // Un ADMIN peut choisir la gare.
    // Les autres rôles utilisent obligatoirement leur propre gare.
    const gareId =
      user.role === 'ADMIN'
        ? gareDemandee
        : this.getGareId(user);

    if (!gareId) {
      throw new BadRequestException(
        "La gare est obligatoire pour créer un chauffeur en tant qu'ADMIN.",
      );
    }

    return this.dataSource.transaction(
      async (manager) => {
        const gare = await manager.findOne(Gare, {
          where: { id: gareId },
        });

        if (!gare) {
          throw new NotFoundException(
            `Gare avec l'identifiant ${gareId} introuvable.`,
          );
        }

        const chauffeur = manager.create(Chauffeur, {
          ...chauffeurData,
          gareId,
        });

        const savedChauffeur = await manager.save(
          Chauffeur,
          chauffeur,
        );

        const documentEntity = manager.create(
          DocumentChauffeur,
          {
            chauffeurId: savedChauffeur.id,
            typeDocument: document.typeDocument,
            numeroDocument: document.numeroDocument ?? null,
            dateDelivrance: document.dateDelivrance
              ? new Date(document.dateDelivrance)
              : null,
            dateExpiration: new Date(document.dateExpiration),
            statut: document.statut,
            observations: document.observations ?? null,
          },
        );

        const savedDocument = await manager.save(
          DocumentChauffeur,
          documentEntity,
        );

        const chauffeurComplet = await manager.findOne(
          Chauffeur,
          {
            where: { id: savedChauffeur.id },
            relations: {
              documentChauffeurs: true,
              gare: true,
            },
          },
        );

        if (!chauffeurComplet) {
          throw new NotFoundException(
            `Chauffeur ${savedChauffeur.id} introuvable après création.`,
          );
        }

        // AUDIT CREATE : même transaction que le chauffeur
        // et son document.
        await this.auditService.createLog(
          {
            utilisateurId: user.sub,
            action: 'CREATE',
            entite: 'CHAUFFEUR',
            entiteId: savedChauffeur.id,
            ancienneValeur: null,
            nouvelleValeur: this.createChauffeurSnapshot(
              chauffeurComplet,
              savedDocument,
            ),
            appareilId,
          },
          manager,
        );

        return chauffeurComplet;
      },
    );
  }

  async findAll(
    user: UtilisateurAuthentifie,
  ): Promise<Chauffeur[]> {
    const where =
      user.role === 'ADMIN'
        ? {}
        : { gareId: this.getGareId(user) };

    return this.chauffeurRepository.find({
      where,
      relations: {
        documentChauffeurs: true,
        gare: true,
      },
      order: {
        nom: 'ASC',
        prenom: 'ASC',
      },
    });
  }

  async findOne(
    id: string,
    user: UtilisateurAuthentifie,
  ): Promise<Chauffeur> {
    const where =
      user.role === 'ADMIN'
        ? { id }
        : {
            id,
            gareId: this.getGareId(user),
          };

    const chauffeur = await this.chauffeurRepository.findOne({
      where,
      relations: {
        documentChauffeurs: true,
        gare: true,
      },
    });

    if (!chauffeur) {
      throw new NotFoundException(
        `Chauffeur avec l'identifiant ${id} introuvable.`,
      );
    }

    return chauffeur;
  }

  async update(
    id: string,
    updateChauffeurDto: UpdateChauffeurDto,
    user: UtilisateurAuthentifie,
    appareilId: string | null = null,
  ): Promise<Chauffeur> {
    return this.dataSource.transaction(async (manager) => {
      // Vérification de l'existence et du périmètre de gare.
      const where =
        user.role === 'ADMIN'
          ? { id }
          : {
              id,
              gareId: this.getGareId(user),
            };

      const chauffeur = await manager.findOne(Chauffeur, {
        where,
        relations: {
          documentChauffeurs: true,
          gare: true,
        },
      });

      if (!chauffeur) {
        throw new NotFoundException(
          `Chauffeur avec l'identifiant ${id} introuvable.`,
        );
      }

      const ancienneValeur =
        this.createChauffeurSnapshot(chauffeur);

      // Empêche le DTO de déplacer le chauffeur vers une autre gare.
      Object.assign(chauffeur, updateChauffeurDto, {
        gareId: chauffeur.gareId,
      });

      await manager.save(Chauffeur, chauffeur);

      const chauffeurMisAJour = await manager.findOne(
        Chauffeur,
        {
          where: { id },
          relations: {
            documentChauffeurs: true,
            gare: true,
          },
        },
      );

      if (!chauffeurMisAJour) {
        throw new NotFoundException(
          `Chauffeur ${id} introuvable après modification.`,
        );
      }

      // AUDIT UPDATE
      await this.auditService.createLog(
        {
          utilisateurId: user.sub,
          action: 'UPDATE',
          entite: 'CHAUFFEUR',
          entiteId: id,
          ancienneValeur,
          nouvelleValeur:
            this.createChauffeurSnapshot(chauffeurMisAJour),
          appareilId,
        },
        manager,
      );

      return chauffeurMisAJour;
    });
  }

  async remove(
    id: string,
    user: UtilisateurAuthentifie,
    appareilId: string | null = null,
  ): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        // Vérification du périmètre de gare.
        const where =
          user.role === 'ADMIN'
            ? { id }
            : {
                id,
                gareId: this.getGareId(user),
              };

        const chauffeur = await manager.findOne(Chauffeur, {
          where,
          relations: {
            documentChauffeurs: true,
            gare: true,
          },
        });

        if (!chauffeur) {
          throw new NotFoundException(
            `Chauffeur avec l'identifiant ${id} introuvable.`,
          );
        }

        const ancienneValeur =
          this.createChauffeurSnapshot(chauffeur);

        await manager.remove(Chauffeur, chauffeur);

        // AUDIT DELETE : snapshot conservé après suppression.
        await this.auditService.createLog(
          {
            utilisateurId: user.sub,
            action: 'DELETE',
            entite: 'CHAUFFEUR',
            entiteId: id,
            ancienneValeur,
            nouvelleValeur: null,
            appareilId,
          },
          manager,
        );
      });
    } catch (error) {
      // Ne pas masquer les erreurs métier ou les erreurs d'audit.
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // Une suppression peut être bloquée par une fiche liée.
      if (
        error instanceof Error &&
        (
          (error as { code?: string }).code === '23503' ||
          (error as { driverError?: { code?: string } })
            .driverError?.code === '23503'
        )
      ) {
        throw new ConflictException(
          'Impossible de supprimer ce chauffeur, car il est utilisé dans une ou plusieurs fiches.',
        );
      }

      throw error;
    }
  }
}
