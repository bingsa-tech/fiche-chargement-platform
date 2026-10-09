import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FicheImpression } from './entities/fiche-impression.entity';
import { CreateFicheImpressionDto } from './dto/create-fiche-impression.dto';

import { Fiche } from '../fiches/entities/fiche.entity';

@Injectable()
export class FicheImpressionsService {
  constructor(
    @InjectRepository(FicheImpression)
    private readonly ficheImpressionRepository: Repository<FicheImpression>,

    @InjectRepository(Fiche)
    private readonly ficheRepository: Repository<Fiche>,
  ) {}

  // =====================================================
  // CRÉER UNE IMPRESSION
  // =====================================================

  async create(
    createDto: CreateFicheImpressionDto,
    imprimeurId: number,
  ): Promise<FicheImpression> {
    const fiche = await this.ficheRepository.findOne({
      where: {
        id: createDto.ficheId,
      },
    });

    if (!fiche) {
      throw new NotFoundException(
        `Fiche ${createDto.ficheId} introuvable`,
      );
    }

    const impression =
      this.ficheImpressionRepository.create({
        ficheId: createDto.ficheId,
        imprimeurId,
        numeroExemplaire:
          createDto.numeroExemplaire ?? 1,
        motifReimpression:
          createDto.motifReimpression ?? null,
      });

    return this.ficheImpressionRepository.save(
      impression,
    );
  }

  // =====================================================
  // LISTER LES IMPRESSIONS
  // =====================================================

  async findAll(): Promise<FicheImpression[]> {
    return this.ficheImpressionRepository.find({
      relations: {
        fiche: true,
        imprimeur: true,
      },
      order: {
        dateImpression: 'DESC',
      },
    });
  }

  // =====================================================
  // UNE IMPRESSION
  // =====================================================

  async findOne(
    id: string,
  ): Promise<FicheImpression> {
    const impression =
      await this.ficheImpressionRepository.findOne({
        where: {
          id,
        },
        relations: {
          fiche: true,
          imprimeur: true,
        },
      });

    if (!impression) {
      throw new NotFoundException(
        `Impression ${id} introuvable`,
      );
    }

    return impression;
  }

  // =====================================================
  // IMPRESSIONS D'UNE FICHE
  // =====================================================

  async findByFiche(
    ficheId: string,
  ): Promise<FicheImpression[]> {
    return this.ficheImpressionRepository.find({
      where: {
        ficheId,
      },
      relations: {
        imprimeur: true,
      },
      order: {
        dateImpression: 'DESC',
      },
    });
  }
}