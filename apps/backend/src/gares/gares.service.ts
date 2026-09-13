import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateGareDto } from './dto/create-gare.dto';
import { UpdateGareDto } from './dto/update-gare.dto';
import { Gare } from './entities/gare.entity';

@Injectable()
export class GaresService {
  constructor(
    @InjectRepository(Gare)
    private readonly gareRepository: Repository<Gare>,
  ) {}

  // CREATE
  async create(createGareDto: CreateGareDto): Promise<Gare> {
    try {
      const gare = this.gareRepository.create(createGareDto);

      return await this.gareRepository.save(gare);
    } catch (error) {
      throw new ConflictException(
        'Impossible de créer la gare. Le code existe peut-être déjà.',
      );
    }
  }

  // READ ALL
  async findAll(): Promise<Gare[]> {
    return await this.gareRepository.find({
      order: {
        nom: 'ASC',
      },
    });
  }

  // READ ONE
  async findOne(id: string): Promise<Gare> {
    const gare = await this.gareRepository.findOne({
      where: { id },
    });

    if (!gare) {
      throw new NotFoundException(
        `Gare avec l'identifiant ${id} introuvable`,
      );
    }

    return gare;
  }

  // UPDATE
  async update(
    id: string,
    updateGareDto: UpdateGareDto,
  ): Promise<Gare> {
    const gare = await this.findOne(id);

    Object.assign(gare, updateGareDto);

    try {
      return await this.gareRepository.save(gare);
    } catch (error) {
      throw new ConflictException(
        'Impossible de modifier la gare. Le code existe peut-être déjà.',
      );
    }
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const gare = await this.findOne(id);

    try {
      await this.gareRepository.remove(gare);
    } catch (error) {
      throw new ConflictException(
        'Impossible de supprimer cette gare car elle est utilisée par une fiche ou un utilisateur.',
      );
    }
  }
}