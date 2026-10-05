import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  Repository,
} from 'typeorm';

import { CreateChauffeurDto } from './dto/create-chauffeur.dto';
import { UpdateChauffeurDto } from './dto/update-chauffeur.dto';
import { Chauffeur } from './entities/chauffeur.entity';

import { DocumentChauffeur } from '../documents/entities/document-chauffeur.entity';

@Injectable()
export class ChauffeursService {
  constructor(
    @InjectRepository(Chauffeur)
    private readonly chauffeurRepository: Repository<Chauffeur>,

   
    private readonly dataSource: DataSource,
  ) {}

  // ============================================================
  // CREATE
  // ============================================================

  async create(
    createChauffeurDto: CreateChauffeurDto,
  ): Promise<Chauffeur> {
    const {
      document,
      ...chauffeurData
    } = createChauffeurDto;

    /**
     * Transaction :
     *
     * 1. Création du chauffeur
     * 2. Création obligatoire de son document
     * 3. Validation de l'ensemble
     * 4. COMMIT
     *
     * Si une étape échoue :
     * ROLLBACK complet.
     */
    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        // --------------------------------------------------------
        // 1. Création du chauffeur
        // --------------------------------------------------------

        const chauffeur =
          transactionalEntityManager.create(
            Chauffeur,
            chauffeurData,
          );

        const savedChauffeur =
          await transactionalEntityManager.save(
            Chauffeur,
            chauffeur,
          );

        // --------------------------------------------------------
        // 2. Création du document obligatoire
        // --------------------------------------------------------

        const documentEntity =
          transactionalEntityManager.create(
            DocumentChauffeur,
            {
              chauffeurId: savedChauffeur.id,
              typeDocument: document.typeDocument,
              numeroDocument:
                document.numeroDocument ?? null,
              dateDelivrance:
                document.dateDelivrance
                  ? new Date(
                      document.dateDelivrance,
                    )
                  : null,
              dateExpiration:
                new Date(
                  document.dateExpiration,
                ),
              statut: document.statut,
              observations:
                document.observations ?? null,
            },
          );

        await transactionalEntityManager.save(
          DocumentChauffeur,
          documentEntity,
        );

        // --------------------------------------------------------
        // 3. Retourner le chauffeur avec son document
        // --------------------------------------------------------

        const chauffeurComplet =
          await transactionalEntityManager.findOne(
            Chauffeur,
            {
              where: {
                id: savedChauffeur.id,
              },
              relations: {
                documentChauffeurs: true,
              },
            },
          );

        if (!chauffeurComplet) {
          throw new NotFoundException(
            `Chauffeur avec l'identifiant ${savedChauffeur.id} introuvable après création.`,
          );
        }

        return chauffeurComplet;
      },
    );
  }

  // ============================================================
  // READ ALL
  // ============================================================

  async findAll(): Promise<Chauffeur[]> {
    return await this.chauffeurRepository.find({
      relations: {
        documentChauffeurs: true,
      },
      order: {
        nom: 'ASC',
        prenom: 'ASC',
      },
    });
  }

  // ============================================================
  // READ ONE
  // ============================================================

  async findOne(id: string): Promise<Chauffeur> {
    const chauffeur =
      await this.chauffeurRepository.findOne({
        where: {
          id,
        },
        relations: {
          documentChauffeurs: true,
        },
      });

    if (!chauffeur) {
      throw new NotFoundException(
        `Chauffeur avec l'identifiant ${id} introuvable`,
      );
    }

    return chauffeur;
  }

  // ============================================================
  // UPDATE
  // ============================================================

  async update(
    id: string,
    updateChauffeurDto: UpdateChauffeurDto,
  ): Promise<Chauffeur> {
    const chauffeur =
      await this.chauffeurRepository.findOne({
        where: {
          id,
        },
      });

    if (!chauffeur) {
      throw new NotFoundException(
        `Chauffeur avec l'identifiant ${id} introuvable`,
      );
    }

    Object.assign(
      chauffeur,
      updateChauffeurDto,
    );

    await this.chauffeurRepository.save(
      chauffeur,
    );

    return this.findOne(id);
  }

  // ============================================================
  // DELETE
  // ============================================================

  async remove(id: string): Promise<void> {
    const chauffeur =
      await this.findOne(id);

    try {
      await this.chauffeurRepository.remove(
        chauffeur,
      );
    } catch (error) {
      throw new ConflictException(
        'Impossible de supprimer ce chauffeur car il est utilisé dans une ou plusieurs fiches.',
      );
    }
  }
}