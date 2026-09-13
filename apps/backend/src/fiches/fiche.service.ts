import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Fiche } from './entities/fiche.entity';
import { CreateFicheDto } from './dto/create-fiche.dto';
import { UpdateFicheDto } from './dto/update-fiche.dto';

import { FicheStatut } from './enums/fiche-statut.enum';

@Injectable()
export class FicheService {
  constructor(
    @InjectRepository(Fiche)
    private readonly ficheRepository: Repository<Fiche>,
  ) {}

  async create(createFicheDto: CreateFicheDto): Promise<Fiche> {
    const fiche = this.ficheRepository.create({
      ...createFicheDto,
      statut: FicheStatut.EN_ATTENTE,
    });

    return this.ficheRepository.save(fiche);
  }

  async findAll(): Promise<Fiche[]> {
    return this.ficheRepository.find({
      relations: {
        gare: true,
        vehicule: true,
        chauffeur: true,
        destination: true,
        itineraire: true,
        createur: true,
        finalisateur: true,
        annulateur: true,
        fichePassagers: true,
      },
      order: {
        dateCreation: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Fiche> {
    const fiche = await this.ficheRepository.findOne({
      where: { id },
      relations: {
        gare: true,
        vehicule: true,
        chauffeur: true,
        destination: true,
        itineraire: true,
        createur: true,
        finalisateur: true,
        annulateur: true,
        fichePassagers: true,
      },
    });

    if (!fiche) {
      throw new NotFoundException(
        `Fiche ${id} introuvable`,
      );
    }

    return fiche;
  }

  async update(
    id: string,
    updateFicheDto: UpdateFicheDto,
  ): Promise<Fiche> {
    const fiche = await this.findOne(id);

    Object.assign(fiche, updateFicheDto);

    return this.ficheRepository.save(fiche);
  }

  async remove(id: string): Promise<void> {
    const fiche = await this.findOne(id);

    await this.ficheRepository.remove(fiche);
  }
}