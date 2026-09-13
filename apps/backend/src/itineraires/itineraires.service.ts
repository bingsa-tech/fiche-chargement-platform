import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Itineraire } from './entities/itineraire.entity';
import { CreateItineraireDto } from './dto/create-itineraire.dto';
import { UpdateItineraireDto } from './dto/update-itineraire.dto';

@Injectable()
export class ItinerairesService {
  constructor(
    @InjectRepository(Itineraire)
    private readonly itineraireRepository: Repository<Itineraire>,
  ) {}

  async create(
    createItineraireDto: CreateItineraireDto,
  ): Promise<Itineraire> {
    const { destinationId, code } = createItineraireDto;

    const existing = await this.itineraireRepository.findOne({
      where: {
        destinationId,
        code,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Un itinéraire avec ce code existe déjà pour cette destination',
      );
    }

    const itineraire =
      this.itineraireRepository.create(createItineraireDto);

    return await this.itineraireRepository.save(itineraire);
  }

  async findAll(): Promise<Itineraire[]> {
    return await this.itineraireRepository.find({
      relations: {
        destination: true,
      },
      order: {
        libelle: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Itineraire> {
    const itineraire = await this.itineraireRepository.findOne({
      where: { id },
      relations: {
        destination: true,
      },
    });

    if (!itineraire) {
      throw new NotFoundException(
        `Itinéraire avec l'identifiant ${id} introuvable`,
      );
    }

    return itineraire;
  }

  async update(
    id: string,
    updateItineraireDto: UpdateItineraireDto,
  ): Promise<Itineraire> {
    const itineraire = await this.findOne(id);

    if (
      updateItineraireDto.destinationId ||
      updateItineraireDto.code
    ) {
      const destinationId =
        updateItineraireDto.destinationId ?? itineraire.destinationId;

      const code =
        updateItineraireDto.code ?? itineraire.code;

      const existing = await this.itineraireRepository.findOne({
        where: {
          destinationId,
          code,
        },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Un itinéraire avec ce code existe déjà pour cette destination',
        );
      }
    }

    Object.assign(itineraire, updateItineraireDto);

    return await this.itineraireRepository.save(itineraire);
  }

  async remove(id: string): Promise<void> {
    const itineraire = await this.findOne(id);

    await this.itineraireRepository.remove(itineraire);
  }
}