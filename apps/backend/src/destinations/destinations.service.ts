import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Destination } from './entities/destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
  ) {}

  async create(
    createDestinationDto: CreateDestinationDto,
  ): Promise<Destination> {
    const existingDestination =
      await this.destinationRepository.findOne({
        where: {
          code: createDestinationDto.code,
        },
      });

    if (existingDestination) {
      throw new ConflictException(
        `Une destination avec le code "${createDestinationDto.code}" existe déjà.`,
      );
    }

    const destination =
      this.destinationRepository.create(
        createDestinationDto,
      );

    return await this.destinationRepository.save(
      destination,
    );
  }

  async findAll(): Promise<Destination[]> {
    return await this.destinationRepository.find({
      order: {
        nom: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Destination> {
    const destination =
      await this.destinationRepository.findOne({
        where: { id },
      });

    if (!destination) {
      throw new NotFoundException(
        `Destination avec l'identifiant "${id}" introuvable.`,
      );
    }

    return destination;
  }

  async update(
    id: string,
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<Destination> {
    const destination = await this.findOne(id);

    if (
      updateDestinationDto.code &&
      updateDestinationDto.code !== destination.code
    ) {
      const existingDestination =
        await this.destinationRepository.findOne({
          where: {
            code: updateDestinationDto.code,
          },
        });

      if (existingDestination) {
        throw new ConflictException(
          `Une destination avec le code "${updateDestinationDto.code}" existe déjà.`,
        );
      }
    }

    Object.assign(
      destination,
      updateDestinationDto,
    );

    return await this.destinationRepository.save(
      destination,
    );
  }

  async remove(id: string): Promise<void> {
    const destination = await this.findOne(id);

    await this.destinationRepository.remove(
      destination,
    );
  }
}