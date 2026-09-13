import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Passager } from './entities/passager.entity';
import { CreatePassagerDto } from './dto/create-passager.dto';
import { UpdatePassagerDto } from './dto/update-passager.dto';

@Injectable()
export class PassagersService {
  constructor(
    @InjectRepository(Passager)
    private readonly passagerRepository: Repository<Passager>,
  ) {}

  // CREATE
  async create(createPassagerDto: CreatePassagerDto): Promise<Passager> {
    const existing = await this.passagerRepository.findOne({
      where: {
        numeroCni: createPassagerDto.numeroCni,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Un passager avec ce numéro de CNI existe déjà',
      );
    }

    const passager = this.passagerRepository.create(createPassagerDto);

    return await this.passagerRepository.save(passager);
  }

  // READ ALL
  async findAll(): Promise<Passager[]> {
    return await this.passagerRepository.find({
      order: {
        nom: 'ASC',
        prenom: 'ASC',
      },
    });
  }

  // READ ONE
  async findOne(id: string): Promise<Passager> {
    const passager = await this.passagerRepository.findOne({
      where: { id },
    });

    if (!passager) {
      throw new NotFoundException(
        `Passager avec l'identifiant ${id} introuvable`,
      );
    }

    return passager;
  }

  // UPDATE
  async update(
    id: string,
    updatePassagerDto: UpdatePassagerDto,
  ): Promise<Passager> {
    const passager = await this.findOne(id);

    if (
      updatePassagerDto.numeroCni &&
      updatePassagerDto.numeroCni !== passager.numeroCni
    ) {
      const existing = await this.passagerRepository.findOne({
        where: {
          numeroCni: updatePassagerDto.numeroCni,
        },
      });

      if (existing) {
        throw new ConflictException(
          'Un autre passager utilise déjà ce numéro de CNI',
        );
      }
    }

    Object.assign(passager, updatePassagerDto);

    return await this.passagerRepository.save(passager);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const passager = await this.findOne(id);

    await this.passagerRepository.remove(passager);
  }
}