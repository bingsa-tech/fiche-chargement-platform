
import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Gare } from '../gares/entities/gare.entity';
import { CreateVehiculeCompletDto } from './dto/create-vehicule-complet.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';

import { Vehicule } from './entities/vehicule.entity';
import { Proprietaire } from '../proprietaires/entities/proprietaire.entity';
import { DocumentVehicule } from '../documents/entities/document-vehicule.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class VehiculesService {
  constructor(
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,

    private readonly auditService: AuditService,

    private readonly dataSource: DataSource,
  ) {}

  // =====================================================
  // SNAPSHOT POUR AUDIT
  // =====================================================

  private createVehiculeSnapshot(vehicule: Vehicule) {
    return {
      plaqueImmatriculation: vehicule.plaqueImmatriculation,
      type: vehicule.type,
      marque: vehicule.marque,
      modele: vehicule.modele,
      capacite: vehicule.capacite,
      statut: vehicule.statut,
      proprietaireId: vehicule.proprietaireId,
       gareId: vehicule.gareId,
    };
  }

  // =====================================================
  // CREATE
  // VEHICULE + DOCUMENTS + AUDIT
  // =====================================================

  async create(
  data: CreateVehiculeCompletDto,
  utilisateurId: number,
  gareId: string,
  appareilId: string | null = null,
): Promise<Vehicule> {
  if (!Number.isInteger(utilisateurId) || utilisateurId <= 0) {
    throw new Error('Identifiant utilisateur invalide pour l’audit.');
  }
  if (!gareId) {
    throw new ConflictException(
      'Impossible de créer un véhicule sans gare associée.',
    );
  }

  return this.dataSource.transaction(async (manager) => {
    const proprietaireRepository =
      manager.getRepository(Proprietaire);

    const vehiculeRepository =
      manager.getRepository(Vehicule);

    const documentRepository =
      manager.getRepository(DocumentVehicule);

    // 1. Vérifier le propriétaire
    const proprietaire = await proprietaireRepository.findOne({
      where: { id: data.proprietaireId },
    });

    if (!proprietaire) {
      throw new NotFoundException(
        `Propriétaire ${data.proprietaireId} introuvable.`,
      );
    }

    // 2. Vérifier les documents
    if (!data.documents || data.documents.length === 0) {
      throw new ConflictException(
        'Un véhicule doit posséder au moins un document.',
      );
    }

    // 3. Créer le véhicule avec sa gare
    const vehicule = vehiculeRepository.create({
      plaqueImmatriculation: data.plaqueImmatriculation,
      type: data.type,
      marque: data.marque ?? null,
      modele: data.modele ?? null,
      capacite: data.capacite,
      statut: data.statut,
      proprietaireId: proprietaire.id,
      proprietaire,

      // Affectation obligatoire de la gare
      gare: { id: gareId },
    });

    const vehiculeSaved =
      await vehiculeRepository.save(vehicule);

    // 4. Créer les documents associés
    for (const dataDocument of data.documents) {
      const document = documentRepository.create({
        vehiculeId: vehiculeSaved.id,
        typeDocument: dataDocument.typeDocument,
        numeroDocument: dataDocument.numeroDocument ?? null,

        dateDelivrance: dataDocument.dateDelivrance
          ? this.createDateWithoutTimezone(
              dataDocument.dateDelivrance,
            )
          : null,

        dateExpiration: this.createDateWithoutTimezone(
          dataDocument.dateExpiration,
        ),

        statut: dataDocument.statut,
        observations: dataDocument.observations ?? null,
      });

      await documentRepository.save(document);
    }

    // 5. Recharger le véhicule
    const result = await vehiculeRepository.findOne({
      where: { id: vehiculeSaved.id },
      relations: {
        proprietaire: true,
        documentsVehicules: true,
        gare: true,
      },
    });

    if (!result) {
      throw new NotFoundException(
        'Le véhicule créé est introuvable.',
      );
    }

    // 6. Enregistrer l'audit dans la même transaction
    await this.auditService.createLog(
      {
        utilisateurId,
        action: 'CREATE',
        entite: 'VEHICULE',
        entiteId: result.id,
        ancienneValeur: null,
        nouvelleValeur: {
          ...this.createVehiculeSnapshot(result),
          gareId,
          nombreDocuments:
            result.documentsVehicules?.length ?? 0,
        },
        appareilId,
      },
      manager,
    );

    return result;
  });
}
  // =====================================================
  // DATE PostgreSQL DATE
  // =====================================================

  /**
   * Transforme YYYY-MM-DD en Date locale sans utiliser
   * directement new Date('YYYY-MM-DD'), afin d'éviter
   * les décalages de date liés à UTC.
   */
  private createDateWithoutTimezone(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);

    return new Date(year, month - 1, day);
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
    const vehicule = await this.vehiculeRepository.findOne({
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
        `Véhicule avec l'identifiant ${id} introuvable.`,
      );
    }

    return vehicule;
  }

  // =====================================================
  // UPDATE + AUDIT
  // =====================================================

  async update(
    id: string,
    updateVehiculeDto: UpdateVehiculeDto,
    utilisateurId: number,
    appareilId: string | null = null,
  ): Promise<Vehicule> {
    if (!Number.isInteger(utilisateurId) || utilisateurId <= 0) {
    throw new Error('Identifiant utilisateur invalide pour l’audit.');
  }
    return this.dataSource.transaction(async (manager) => {
      const vehiculeRepository =
        manager.getRepository(Vehicule);

      const proprietaireRepository =
        manager.getRepository(Proprietaire);

      // 1. Retrouver le véhicule

      const vehicule = await vehiculeRepository.findOne({
        where: { id },
        relations: {
          proprietaire: true,
          documentsVehicules: true,
        },
      });

      if (!vehicule) {
        throw new NotFoundException(
          `Véhicule avec l'identifiant ${id} introuvable.`,
        );
      }

      // 2. Capturer les anciennes valeurs avant modification

      const ancienneValeur =
        this.createVehiculeSnapshot(vehicule);

      // 3. Modifier le propriétaire si nécessaire

      if (updateVehiculeDto.proprietaireId !== undefined) {
        const proprietaire =
          await proprietaireRepository.findOne({
            where: {
              id: updateVehiculeDto.proprietaireId,
            },
          });

        if (!proprietaire) {
          throw new NotFoundException(
            `Propriétaire avec l'identifiant ${updateVehiculeDto.proprietaireId} introuvable.`,
          );
        }

        vehicule.proprietaireId = proprietaire.id;
        vehicule.proprietaire = proprietaire;
      }

      // 4. Modifier les autres propriétés

      if (updateVehiculeDto.plaqueImmatriculation !== undefined) {
        vehicule.plaqueImmatriculation =
          updateVehiculeDto.plaqueImmatriculation;
      }

      if (updateVehiculeDto.type !== undefined) {
        vehicule.type = updateVehiculeDto.type;
      }

      if (updateVehiculeDto.marque !== undefined) {
        vehicule.marque = updateVehiculeDto.marque;
      }

      if (updateVehiculeDto.modele !== undefined) {
        vehicule.modele = updateVehiculeDto.modele;
      }

      if (updateVehiculeDto.capacite !== undefined) {
        vehicule.capacite = updateVehiculeDto.capacite;
      }

      if (updateVehiculeDto.statut !== undefined) {
        vehicule.statut = updateVehiculeDto.statut;
      }

      // 5. Sauvegarder

      try {
        await vehiculeRepository.save(vehicule);
      } catch {
        throw new ConflictException(
          'Impossible de modifier le véhicule. La plaque d’immatriculation existe peut-être déjà.',
        );
      }

      // 6. Recharger les données actualisées

      const vehiculeActualise =
        await vehiculeRepository.findOne({
          where: { id },
          relations: {
            proprietaire: true,
            documentsVehicules: true,
          },
        });

      if (!vehiculeActualise) {
        throw new NotFoundException(
          'Le véhicule modifié est introuvable.',
        );
      }

      // 7. Enregistrer l'audit dans la même transaction

      await this.auditService.createLog(
        {
          utilisateurId,
          action: 'UPDATE',
          entite: 'VEHICULE',
          entiteId: vehiculeActualise.id,
          ancienneValeur,
          nouvelleValeur:
            this.createVehiculeSnapshot(vehiculeActualise),
          appareilId,
        },
        manager,
      );

      return vehiculeActualise;
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
    throw new Error('Identifiant utilisateur invalide pour l’audit.');
  }
    await this.dataSource.transaction(async (manager) => {
      const vehiculeRepository =
        manager.getRepository(Vehicule);

      // 1. Retrouver le véhicule

      const vehicule = await vehiculeRepository.findOne({
        where: { id },
        relations: {
          proprietaire: true,
          documentsVehicules: true,
        },
      });

      if (!vehicule) {
        throw new NotFoundException(
          `Véhicule avec l'identifiant ${id} introuvable.`,
        );
      }

      // 2. Capturer les anciennes valeurs

      const ancienneValeur = {
        ...this.createVehiculeSnapshot(vehicule),
        nombreDocuments: vehicule.documentsVehicules?.length ?? 0,
      };

      // 3. Supprimer le véhicule

      try {
        await vehiculeRepository.remove(vehicule);
      } catch {
        throw new ConflictException(
          'Impossible de supprimer ce véhicule car il est utilisé dans une ou plusieurs fiches.',
        );
      }

      // 4. Enregistrer l'audit après la suppression
      // L'entité n'existe plus, mais son UUID reste dans le journal.

      await this.auditService.createLog(
        {
          utilisateurId,
          action: 'DELETE',
          entite: 'VEHICULE',
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
