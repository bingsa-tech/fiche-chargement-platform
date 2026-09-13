import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FichePassager } from './entities/fiche-passager.entity';
import { CreateFichePassagerDto } from './dto/create-fiche-passager.dto';
import { UpdateFichePassagerDto } from './dto/update-fiche-passager.dto';

@Injectable()
export class FichePassagersService {
  constructor(
    @InjectRepository(FichePassager)
    private readonly fichePassagerRepository: Repository<FichePassager>,
  ) {}

  async create(
    createDto: CreateFichePassagerDto,
  ): Promise<FichePassager> {
    const existing =
      await this.fichePassagerRepository.findOne({
        where: {
          ficheId: createDto.ficheId,
          passagerId: createDto.passagerId,
        },
      });

    if (existing) {
      throw new ConflictException(
        'Ce passager est déjà associé à cette fiche',
      );
    }

    const fichePassager =
      this.fichePassagerRepository.create(createDto);

    return await this.fichePassagerRepository.save(fichePassager);
  }

  async findAll(): Promise<FichePassager[]> {
    return await this.fichePassagerRepository.find({
      relations: {
        fiche: true,
        passager: true,
      },
    });
  }

  async findOne(
    ficheId: string,
    passagerId: string,
  ): Promise<FichePassager> {
    const fichePassager =
      await this.fichePassagerRepository.findOne({
        where: {
          ficheId,
          passagerId,
        },
        relations: {
          fiche: true,
          passager: true,
        },
      });

    if (!fichePassager) {
      throw new NotFoundException(
        'Association fiche/passager introuvable',
      );
    }

    return fichePassager;
  }

  async update(
    ficheId: string,
    passagerId: string,
    updateDto: UpdateFichePassagerDto,
  ): Promise<FichePassager> {
    const fichePassager =
      await this.findOne(ficheId, passagerId);

    Object.assign(fichePassager, updateDto);

    return await this.fichePassagerRepository.save(
      fichePassager,
    );
  }

  async remove(
    ficheId: string,
    passagerId: string,
  ): Promise<void> {
    const fichePassager =
      await this.findOne(ficheId, passagerId);

    await this.fichePassagerRepository.remove(fichePassager);
  }

  async findByFiche(ficheId: string): Promise<FichePassager[]> {
    return await this.fichePassagerRepository.find({
      where: {
        ficheId,
      },
      relations: {
        passager: true,
      },
    });
  }
}