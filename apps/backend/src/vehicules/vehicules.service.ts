import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { Vehicule } from './entities/vehicule.entity';
import { Proprietaire } from '../proprietaires/entities/proprietaire.entity';

@Injectable()
export class VehiculesService {
  constructor(
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,

    @InjectRepository(Proprietaire)
    private readonly proprietaireRepository: Repository<Proprietaire>,
  ) {}

  // CREATE
  async create(
    createVehiculeDto: CreateVehiculeDto,
  ): Promise<Vehicule> {
    const proprietaire =
      await this.proprietaireRepository.findOne({
        where: {
          id: createVehiculeDto.proprietaireId,
        },
      });

    if (!proprietaire) {
      throw new NotFoundException(
        `Propriétaire avec l'identifiant ${createVehiculeDto.proprietaireId} introuvable`,
      );
    }

    const vehicule = this.vehiculeRepository.create({
      plaqueImmatriculation:
        createVehiculeDto.plaqueImmatriculation,
      type: createVehiculeDto.type,
      marque: createVehiculeDto.marque ?? null,
      modele: createVehiculeDto.modele ?? null,
      capacite: createVehiculeDto.capacite,
      statut: createVehiculeDto.statut,
      proprietaireId: proprietaire.id,
      proprietaire,
    });

    try {
      return await this.vehiculeRepository.save(vehicule);
    } catch (error) {
      throw new ConflictException(
        'Impossible de créer le véhicule. La plaque d’immatriculation existe peut-être déjà.',
      );
    }
  }

  // READ ALL
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

  // READ ONE
  async findOne(id: string): Promise<Vehicule> {
    const vehicule =
      await this.vehiculeRepository.findOne({
        where: { id },
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

  // UPDATE
  async update(
    id: string,
    updateVehiculeDto: UpdateVehiculeDto,
  ): Promise<Vehicule> {
    const vehicule = await this.findOne(id);

    if (updateVehiculeDto.proprietaireId) {
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

      vehicule.proprietaireId = proprietaire.id;
      vehicule.proprietaire = proprietaire;
    }

    if (
      updateVehiculeDto.plaqueImmatriculation !== undefined
    ) {
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

    try {
      return await this.vehiculeRepository.save(vehicule);
    } catch (error) {
      throw new ConflictException(
        'Impossible de modifier le véhicule. La plaque d’immatriculation existe peut-être déjà.',
      );
    }
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const vehicule = await this.findOne(id);

    try {
      await this.vehiculeRepository.remove(vehicule);
    } catch (error) {
      throw new ConflictException(
        'Impossible de supprimer ce véhicule car il est utilisé dans une ou plusieurs fiches.',
      );
    }
  }
}