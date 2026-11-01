
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

type UtilisateurAuthentifie = {
  id: number;
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
  ) {}

  /**
   * Retourne la gare de l'utilisateur non administrateur.
   * Un utilisateur sans gare ne peut pas accéder aux données
   * limitées par gare.
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

  async create(
    createChauffeurDto: CreateChauffeurDto,
    user: UtilisateurAuthentifie,
  ): Promise<Chauffeur> {
    const { document, gareId: gareDemandee, ...chauffeurData } =
      createChauffeurDto;

    // Un ADMIN peut choisir la gare.
    // Pour les autres rôles, on ne fait jamais confiance au client.
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
      async (transactionalEntityManager) => {
        const gare = await transactionalEntityManager.findOne(Gare, {
          where: { id: gareId },
        });

        if (!gare) {
          throw new NotFoundException(
            `Gare avec l'identifiant ${gareId} introuvable.`,
          );
        }

        const chauffeur = transactionalEntityManager.create(Chauffeur, {
          ...chauffeurData,
          gareId,
        });

        const savedChauffeur =
          await transactionalEntityManager.save(Chauffeur, chauffeur);

        const documentEntity =
          transactionalEntityManager.create(DocumentChauffeur, {
            chauffeurId: savedChauffeur.id,
            typeDocument: document.typeDocument,
            numeroDocument: document.numeroDocument ?? null,
            dateDelivrance: document.dateDelivrance
              ? new Date(document.dateDelivrance)
              : null,
            dateExpiration: new Date(document.dateExpiration),
            statut: document.statut,
            observations: document.observations ?? null,
          });

        await transactionalEntityManager.save(
          DocumentChauffeur,
          documentEntity,
        );

        const chauffeurComplet =
          await transactionalEntityManager.findOne(Chauffeur, {
            where: { id: savedChauffeur.id },
            relations: { documentChauffeurs: true, gare: true },
          });

        if (!chauffeurComplet) {
          throw new NotFoundException(
            `Chauffeur ${savedChauffeur.id} introuvable après création.`,
          );
        }

        return chauffeurComplet;
      },
    );
  }

  async findAll(user: UtilisateurAuthentifie): Promise<Chauffeur[]> {
    const where =
      user.role === 'ADMIN'
        ? {}
        : { gareId: this.getGareId(user) };

    return this.chauffeurRepository.find({
      where,
      relations: { documentChauffeurs: true, gare: true },
      order: { nom: 'ASC', prenom: 'ASC' },
    });
  }

  async findOne(
    id: string,
    user: UtilisateurAuthentifie,
  ): Promise<Chauffeur> {
    const where =
      user.role === 'ADMIN'
        ? { id }
        : { id, gareId: this.getGareId(user) };

    const chauffeur = await this.chauffeurRepository.findOne({
      where,
      relations: { documentChauffeurs: true, gare: true },
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
  ): Promise<Chauffeur> {
    // La recherche vérifie aussi la gare de l'utilisateur.
    const chauffeur = await this.findOne(id, user);

    // Empêche le DTO de déplacer un chauffeur vers une autre gare.
    Object.assign(chauffeur, updateChauffeurDto, {
      gareId: chauffeur.gareId,
    });

    await this.chauffeurRepository.save(chauffeur);

    return this.findOne(id, user);
  }

  async remove(
    id: string,
    user: UtilisateurAuthentifie,
  ): Promise<void> {
    // Un chauffeur d'une autre gare ne sera pas récupéré.
    const chauffeur = await this.findOne(id, user);

    try {
      await this.chauffeurRepository.remove(chauffeur);
    } catch {
      throw new ConflictException(
        'Impossible de supprimer ce chauffeur, car il est utilisé dans une ou plusieurs fiches.',
      );
    }
  }
}
