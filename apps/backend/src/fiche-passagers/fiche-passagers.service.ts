
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FichePassager } from './entities/fiche-passager.entity';
import { Fiche } from '../fiches/entities/fiche.entity';
import { CreateFichePassagerDto } from './dto/create-fiche-passager.dto';
import { UpdateFichePassagerDto } from './dto/update-fiche-passager.dto';

export type FichePassagerUser = {
  id: number;
  username: string;
  role: string;
  gareId: string | null;
};

@Injectable()
export class FichePassagersService {
  constructor(
    @InjectRepository(FichePassager)
    private readonly fichePassagerRepository: Repository<FichePassager>,

    @InjectRepository(Fiche)
    private readonly ficheRepository: Repository<Fiche>,
  ) {}

  private peutConsulterToutesLesGares(user: FichePassagerUser): boolean {
    return ['ADMIN', 'AUTORITE_HABILITEE'].includes(user.role);
  }

  private async verifierAccesFiche(
    ficheId: string,
    user: FichePassagerUser,
  ): Promise<Fiche> {
    const fiche = await this.ficheRepository.findOne({
      where: { id: ficheId },
    });

    if (!fiche) {
      throw new NotFoundException('Fiche introuvable');
    }

    if (this.peutConsulterToutesLesGares(user)) {
      return fiche;
    }

    if (!user.gareId || fiche.gareId !== user.gareId) {
      throw new ForbiddenException(
        "Vous n'avez pas accès à cette fiche.",
      );
    }

    return fiche;
  }

  async create(
    createDto: CreateFichePassagerDto,
    user: FichePassagerUser,
  ): Promise<FichePassager> {
    await this.verifierAccesFiche(createDto.ficheId, user);

    const existing = await this.fichePassagerRepository.findOne({
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

    const association =
      this.fichePassagerRepository.create(createDto);

    return this.fichePassagerRepository.save(association);
  }

  async findAll(
    user: FichePassagerUser,
  ): Promise<FichePassager[]> {
    if (this.peutConsulterToutesLesGares(user)) {
      return this.fichePassagerRepository.find({
        relations: { fiche: true, passager: true },
      });
    }

    if (!user.gareId) {
      throw new ForbiddenException(
        "Aucune gare n'est associée à cet utilisateur.",
      );
    }

    return this.fichePassagerRepository.find({
      where: { fiche: { gareId: user.gareId } },
      relations: { fiche: true, passager: true },
    });
  }

  async findOne(
    ficheId: string,
    passagerId: string,
    user: FichePassagerUser,
  ): Promise<FichePassager> {
    await this.verifierAccesFiche(ficheId, user);

    const association = await this.fichePassagerRepository.findOne({
      where: { ficheId, passagerId },
      relations: { fiche: true, passager: true },
    });

    if (!association) {
      throw new NotFoundException(
        'Association fiche/passager introuvable',
      );
    }

    return association;
  }

  async update(
    ficheId: string,
    passagerId: string,
    updateDto: UpdateFichePassagerDto,
    user: FichePassagerUser,
  ): Promise<FichePassager> {
    const association = await this.findOne(
      ficheId,
      passagerId,
      user,
    );

    Object.assign(association, updateDto);

    return this.fichePassagerRepository.save(association);
  }

  async remove(
    ficheId: string,
    passagerId: string,
    user: FichePassagerUser,
  ): Promise<void> {
    const association = await this.findOne(
      ficheId,
      passagerId,
      user,
    );

    await this.fichePassagerRepository.remove(association);
  }

  async findByFiche(
    ficheId: string,
    user: FichePassagerUser,
  ): Promise<FichePassager[]> {
    await this.verifierAccesFiche(ficheId, user);

    return this.fichePassagerRepository.find({
      where: { ficheId },
      relations: { passager: true },
    });
  }
}
