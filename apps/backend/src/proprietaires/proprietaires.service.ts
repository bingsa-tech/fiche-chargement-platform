import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Proprietaire } from './entities/proprietaire.entity';
import { CreateProprietaireDto } from './dto/create-proprietaire.dto';
import { UpdateProprietaireDto } from './dto/update-proprietaire.dto';

@Injectable()
export class ProprietairesService {
  constructor(
    @InjectRepository(Proprietaire)
    private readonly proprietaireRepository: Repository<Proprietaire>,
  ) {}

  async create(
    createProprietaireDto: CreateProprietaireDto,
  ): Promise<Proprietaire> {
    const proprietaire =
      this.proprietaireRepository.create(createProprietaireDto);

    return this.proprietaireRepository.save(proprietaire);
  }

  async findAll(): Promise<Proprietaire[]> {
    return this.proprietaireRepository.find({
      relations: {
        vehicules: true,
      },
      order: {
        nom: 'ASC',
        prenom: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Proprietaire> {
    const proprietaire =
      await this.proprietaireRepository.findOne({
        where: { id },
        relations: {
          vehicules: true,
        },
      });

    if (!proprietaire) {
      throw new NotFoundException(
        `Propriétaire avec l'identifiant ${id} introuvable`,
      );
    }

    return proprietaire;
  }

  async update(
    id: string,
    updateProprietaireDto: UpdateProprietaireDto,
  ): Promise<Proprietaire> {
    const proprietaire = await this.findOne(id);

    Object.assign(proprietaire, updateProprietaireDto);

    return this.proprietaireRepository.save(proprietaire);
  }

  async remove(id: string): Promise<void> {
    const proprietaire = await this.findOne(id);

    await this.proprietaireRepository.remove(proprietaire);
  }
}