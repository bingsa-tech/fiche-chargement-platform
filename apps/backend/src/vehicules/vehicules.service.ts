import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateVehiculeCompletDto } from './dto/create-vehicule-complet.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';

import { Vehicule } from './entities/vehicule.entity';
import { Proprietaire } from '../proprietaires/entities/proprietaire.entity';
import { DocumentVehicule } from '../documents/entities/document-vehicule.entity';

@Injectable()
export class VehiculesService {
  constructor(
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,

    @InjectRepository(Proprietaire)
    private readonly proprietaireRepository: Repository<Proprietaire>,

    private readonly dataSource: DataSource,
  ) {}

  // =====================================================
  // CREATE
  // VEHICULE + DOCUMENTS
  // =====================================================

  async create(
    data: CreateVehiculeCompletDto,
  ): Promise<Vehicule> {
    return this.dataSource.transaction(
      async (manager) => {
        // -------------------------------------------------
        // 1. Vérifier le propriétaire
        // -------------------------------------------------

        const proprietaire =
          await manager
            .getRepository(Proprietaire)
            .findOne({
              where: {
                id: data.proprietaireId,
              },
            });

        if (!proprietaire) {
          throw new NotFoundException(
            `Propriétaire avec l'identifiant ${data.proprietaireId} introuvable`,
          );
        }

        // -------------------------------------------------
        // 2. Vérifier qu'il existe au moins un document
        // -------------------------------------------------

        if (
          !data.documents ||
          data.documents.length === 0
        ) {
          throw new ConflictException(
            'Un véhicule doit posséder au moins un document.',
          );
        }

        // -------------------------------------------------
        // 3. Créer le véhicule
        // -------------------------------------------------

        const vehiculeRepository =
          manager.getRepository(Vehicule);

        const vehicule =
          vehiculeRepository.create({
            plaqueImmatriculation:
              data.plaqueImmatriculation,

            type: data.type,

            marque:
              data.marque ?? null,

            modele:
              data.modele ?? null,

            capacite:
              data.capacite,

            statut:
              data.statut,

            proprietaireId:
              proprietaire.id,

            proprietaire,
          });

        let vehiculeSaved: Vehicule;

        try {
          vehiculeSaved =
            await vehiculeRepository.save(vehicule);
        } catch (error) {
          throw new ConflictException(
            'Impossible de créer le véhicule. La plaque d’immatriculation existe peut-être déjà.',
          );
        }

        // -------------------------------------------------
        // 4. Créer les documents
        // -------------------------------------------------

        const documentRepository =
          manager.getRepository(DocumentVehicule);

        for (const dataDocument of data.documents) {
          const document =
            documentRepository.create({
              // L'ID est fourni par le backend
              // après la création du véhicule.
              vehiculeId: vehiculeSaved.id,

              typeDocument:
                dataDocument.typeDocument,

              numeroDocument:
                dataDocument.numeroDocument ?? null,

              dateDelivrance:
                dataDocument.dateDelivrance
                  ? this.createDateWithoutTimezone(
                      dataDocument.dateDelivrance,
                    )
                  : null,

              dateExpiration:
                this.createDateWithoutTimezone(
                  dataDocument.dateExpiration,
                ),

              statut:
                dataDocument.statut,

              observations:
                dataDocument.observations ?? null,
            });

          await documentRepository.save(document);
        }

        // -------------------------------------------------
        // 5. Recharger le véhicule avec ses relations
        // -------------------------------------------------

        const result =
          await vehiculeRepository.findOne({
            where: {
              id: vehiculeSaved.id,
            },
            relations: {
              proprietaire: true,
              documentsVehicules: true,
            },
          });

        if (!result) {
          throw new NotFoundException(
            'Le véhicule vient d’être créé mais est introuvable.',
          );
        }

        return result;
      },
    );
  }

  // =====================================================
  // DATE PostgreSQL DATE
  // =====================================================

  /**
   * Transforme YYYY-MM-DD en Date locale sans utiliser
   * directement new Date('YYYY-MM-DD'), afin d'éviter
   * les décalages de date liés à UTC.
   */
  private createDateWithoutTimezone(
    dateString: string,
  ): Date {
    const [year, month, day] =
      dateString.split('-').map(Number);

    return new Date(
      year,
      month - 1,
      day,
    );
  }

  // =====================================================
  // READ ALL
  // =====================================================

  async findAll(): Promise<Vehicule[]> {
    return this.vehiculeRepository.find({
      relations: {
        proprietaire: true,
        documentsVehicules: true,
      },
      order: {
        plaqueImmatriculation: 'ASC',
      },
    });
  }

  // =====================================================
  // READ ONE
  // =====================================================

  async findOne(id: string): Promise<Vehicule> {
    const vehicule =
      await this.vehiculeRepository.findOne({
        where: {
          id,
        },
        relations: {
          proprietaire: true,
          documentsVehicules: true,
        },
      });

    if (!vehicule) {
      throw new NotFoundException(
        `Véhicule avec l'identifiant ${id} introuvable`,
      );
    }

    return vehicule;
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async update(
    id: string,
    updateVehiculeDto: UpdateVehiculeDto,
  ): Promise<Vehicule> {
    const vehicule =
      await this.findOne(id);

    // ---------------------------------------------------
    // Propriétaire
    // ---------------------------------------------------

    if (
      updateVehiculeDto.proprietaireId !==
      undefined
    ) {
      const proprietaire =
        await this.proprietaireRepository.findOne({
          where: {
            id: updateVehiculeDto.proprietaireId,
          },
        });

      if (!proprietaire) {
        throw new NotFoundException(
          `Propriétaire avec l'identifiant ${updateVehiculeDto.proprietaireId} introuvable`,
        );
      }

      vehicule.proprietaireId =
        proprietaire.id;

      vehicule.proprietaire =
        proprietaire;
    }

    // ---------------------------------------------------
    // Plaque
    // ---------------------------------------------------

    if (
      updateVehiculeDto.plaqueImmatriculation !==
      undefined
    ) {
      vehicule.plaqueImmatriculation =
        updateVehiculeDto.plaqueImmatriculation;
    }

    // ---------------------------------------------------
    // Type
    // ---------------------------------------------------

    if (
      updateVehiculeDto.type !==
      undefined
    ) {
      vehicule.type =
        updateVehiculeDto.type;
    }

    // ---------------------------------------------------
    // Marque
    // ---------------------------------------------------

    if (
      updateVehiculeDto.marque !==
      undefined
    ) {
      vehicule.marque =
        updateVehiculeDto.marque;
    }

    // ---------------------------------------------------
    // Modèle
    // ---------------------------------------------------

    if (
      updateVehiculeDto.modele !==
      undefined
    ) {
      vehicule.modele =
        updateVehiculeDto.modele;
    }

    // ---------------------------------------------------
    // Capacité
    // ---------------------------------------------------

    if (
      updateVehiculeDto.capacite !==
      undefined
    ) {
      vehicule.capacite =
        updateVehiculeDto.capacite;
    }

    // ---------------------------------------------------
    // Statut
    // ---------------------------------------------------

    if (
      updateVehiculeDto.statut !==
      undefined
    ) {
      vehicule.statut =
        updateVehiculeDto.statut;
    }

    // ---------------------------------------------------
    // Sauvegarde
    // ---------------------------------------------------

    try {
      await this.vehiculeRepository.save(
        vehicule,
      );
    } catch (error) {
      throw new ConflictException(
        'Impossible de modifier le véhicule. La plaque d’immatriculation existe peut-être déjà.',
      );
    }

    // Retourner les relations à jour
    return this.findOne(id);
  }

  // =====================================================
  // DELETE
  // =====================================================

  async remove(id: string): Promise<void> {
    const vehicule =
      await this.findOne(id);

    try {
      await this.vehiculeRepository.remove(
        vehicule,
      );
    } catch (error) {
      throw new ConflictException(
        'Impossible de supprimer ce véhicule car il est utilisé dans une ou plusieurs fiches.',
      );
    }
  }
}