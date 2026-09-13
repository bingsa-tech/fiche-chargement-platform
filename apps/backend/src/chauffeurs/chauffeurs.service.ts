import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateChauffeurDto } from './dto/create-chauffeur.dto';
import { UpdateChauffeurDto } from './dto/update-chauffeur.dto';
import { Chauffeur } from './entities/chauffeur.entity';

@Injectable()
export class ChauffeursService {
  constructor(
    @InjectRepository(Chauffeur)
    private readonly chauffeurRepository: Repository<Chauffeur>,
  ) {}

  // CREATE
  async create(createChauffeurDto: CreateChauffeurDto): Promise<Chauffeur> {
    const chauffeur = this.chauffeurRepository.create(createChauffeurDto);

    return await this.chauffeurRepository.save(chauffeur);
  }

  // READ ALL
  async findAll(): Promise<Chauffeur[]> {
    return await this.chauffeurRepository.find({
      order: {
        nom: 'ASC',
        prenom: 'ASC',
      },
    });
  }

  // READ ONE
  async findOne(id: string): Promise<Chauffeur> {
    const chauffeur = await this.chauffeurRepository.findOne({
      where: { id },
    });

    if (!chauffeur) {
      throw new NotFoundException(
        `Chauffeur avec l'identifiant ${id} introuvable`,
      );
    }

    return chauffeur;
  }

  // UPDATE
  async update(
    id: string,
    updateChauffeurDto: UpdateChauffeurDto,
  ): Promise<Chauffeur> {
    const chauffeur = await this.findOne(id);

    Object.assign(chauffeur, updateChauffeurDto);

    return await this.chauffeurRepository.save(chauffeur);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const chauffeur = await this.findOne(id);

    try {
      await this.chauffeurRepository.remove(chauffeur);
    } catch (error) {
      throw new ConflictException(
        'Impossible de supprimer ce chauffeur car il est utilisé dans une ou plusieurs fiches.',
      );
    }
  }
}