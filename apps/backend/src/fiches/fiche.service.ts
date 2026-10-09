import {
  BadRequestException,
  Injectable,
  NotFoundException,
  
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Fiche } from './entities/fiche.entity';
import { CreateFicheDto } from './dto/create-fiche.dto';
import { UpdateFicheDto } from './dto/update-fiche.dto';

import { FicheStatut } from './enums/fiche-statut.enum';
import { FicheImpressionsService } from '../fiche-impressions/fiche-impressions.service';
@Injectable()
export class FicheService {
  constructor(
  @InjectRepository(Fiche)
  private readonly ficheRepository: Repository<Fiche>,

  private readonly ficheImpressionsService: FicheImpressionsService,
) {}

  async create(createFicheDto: CreateFicheDto, createurId: number): Promise<Fiche> {
    const fiche = this.ficheRepository.create({
      ...createFicheDto,
      statut: FicheStatut.EN_ATTENTE,
      createurId,
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
// =====================================================
// PRENDRE EN CHARGE
// EN_ATTENTE → EN_COURS
// =====================================================

async prendreEnCharge(id: string): Promise<Fiche> {
  const fiche = await this.findOne(id);

  if (fiche.statut !== FicheStatut.EN_ATTENTE) {
    throw new BadRequestException(
      `La fiche doit être EN_ATTENTE pour être prise en charge. Statut actuel : ${fiche.statut}.`,
    );
  }

  fiche.statut = FicheStatut.EN_COURS;

  return this.ficheRepository.save(fiche);
}

// =====================================================
// FINALISER
// EN_COURS → FINALISEE
// =====================================================

async finaliser(
  id: string,
  finalisateurId: number,
): Promise<Fiche> {
  const fiche = await this.findOne(id);

  if (fiche.statut !== FicheStatut.EN_COURS) {
    throw new BadRequestException(
      `La fiche doit être EN_COURS pour être finalisée. Statut actuel : ${fiche.statut}.`,
    );
  }

  fiche.statut = FicheStatut.FINALISEE;
  fiche.finalisateurId = finalisateurId;
  fiche.dateFinalisation = new Date();

  return this.ficheRepository.save(fiche);
}
async update(
  id: string,
  updateFicheDto: UpdateFicheDto,
): Promise<Fiche> {
  const fiche = await this.findOne(id);

  if (
    fiche.statut !== FicheStatut.EN_ATTENTE &&
    fiche.statut !== FicheStatut.EN_COURS &&
    fiche.statut !== FicheStatut.FINALISEE
  ) {
    throw new BadRequestException(
      `La fiche ne peut plus être modifiée lorsque son statut est ${fiche.statut}.`,
    );
  }

  Object.assign(fiche, updateFicheDto);

  return this.ficheRepository.save(fiche);
}

  async remove(id: string): Promise<void> {
    const fiche = await this.findOne(id);

    await this.ficheRepository.remove(fiche);
  }

// =====================================================
// IMPRIMER
// FINALISEE → IMPRIMEE
// =====================================================

async imprimer(
  id: string,
  imprimeurId: number,
): Promise<Fiche> {
  const fiche = await this.findOne(id);

  if (fiche.statut !== FicheStatut.FINALISEE) {
    throw new BadRequestException(
      `La fiche doit être FINALISEE pour être imprimée. Statut actuel : ${fiche.statut}.`,
    );
  }

  await this.ficheImpressionsService.create(
    {
      ficheId: fiche.id,
      numeroExemplaire: 1,
    },
    imprimeurId,
  );

  fiche.statut = FicheStatut.IMPRIMEE;

  return this.ficheRepository.save(fiche);
}
}