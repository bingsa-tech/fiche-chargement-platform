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

@Injectable()
export class VehiculesService {
  constructor(
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,
  ) {}

  // CREATE
  async create(
    createVehiculeDto: CreateVehiculeDto,
  ): Promise<Vehicule> {
    const vehicule = this.vehiculeRepository.create(
      createVehiculeDto,
    );

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
    return await this.vehiculeRepository.find({
      order: {
        plaqueImmatriculation: 'ASC',
      },
    });
  }

  // READ ONE
  async findOne(id: string): Promise<Vehicule> {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id },
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

    Object.assign(vehicule, updateVehiculeDto);

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