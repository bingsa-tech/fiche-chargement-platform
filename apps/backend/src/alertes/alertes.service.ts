import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AlerteDocument } from './entities/alerte-document.entity';
import { CreateAlerteDto } from './dto/create-alerte.dto';
import { UpdateAlerteDto } from './dto/update-alerte.dto';

@Injectable()
export class AlertesService {
  constructor(
    @InjectRepository(AlerteDocument)
    private readonly alerteRepository: Repository<AlerteDocument>,
  ) {}

  async create(createAlerteDto: CreateAlerteDto): Promise<AlerteDocument> {
    const alerte = this.alerteRepository.create({
      ...createAlerteDto,
      dateLecture: createAlerteDto.dateLecture
        ? new Date(createAlerteDto.dateLecture)
        : null,
    });

    return await this.alerteRepository.save(alerte);
  }

  async findAll(): Promise<AlerteDocument[]> {
    return await this.alerteRepository.find({
      order: { dateExpiration: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AlerteDocument> {
    const alerte = await this.alerteRepository.findOne({ where: { id } });

    if (!alerte) {
      throw new NotFoundException(
        `Alerte avec l'identifiant ${id} introuvable`,
      );
    }

    return alerte;
  }

  async update(id: string, updateAlerteDto: UpdateAlerteDto): Promise<AlerteDocument> {
    const alerte = await this.findOne(id);

    Object.assign(alerte, {
      ...updateAlerteDto,
      dateLecture: updateAlerteDto.dateLecture
        ? new Date(updateAlerteDto.dateLecture)
        : alerte.dateLecture,
    });

    return await this.alerteRepository.save(alerte);
  }

  async remove(id: string): Promise<void> {
    const alerte = await this.findOne(id);
    await this.alerteRepository.remove(alerte);
  }

  async marquerCommeLue(id: string, utilisateurLecture: number): Promise<AlerteDocument> {
    const alerte = await this.findOne(id);

    alerte.statut = 'LUE' as any;
    alerte.dateLecture = new Date();
    alerte.utilisateurLecture = utilisateurLecture;

    return await this.alerteRepository.save(alerte);
  }
}
