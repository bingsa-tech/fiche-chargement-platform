import {
  BadRequestException,
  ForbiddenException,
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

type FicheUserContext = {
  id: number;
  username: string;
  role: string;
  gareId: string | null;
};

@Injectable()
export class FicheService {
  constructor(
    @InjectRepository(Fiche)
    private readonly ficheRepository: Repository<Fiche>,

    private readonly ficheImpressionsService: FicheImpressionsService,
  ) {}

  // =====================================================
  // CONTRÔLE D'ACCÈS AUX GARES
  // =====================================================

  private peutConsulterToutesLesGares(
    user: FicheUserContext,
  ): boolean {
    return (
      user.role === 'ADMIN' ||
      user.role === 'AUTORITE_HABILITEE'
    );
  }

  private exigerGareUtilisateur(
    user: FicheUserContext,
  ): string {
    if (!user.gareId) {
      throw new ForbiddenException(
        'Votre compte n’est associé à aucune gare.',
      );
    }

    return user.gareId;
  }

  private verifierGareCreation(
    gareId: string,
    user: FicheUserContext,
  ): void {
    if (user.role === 'ADMIN') {
      return;
    }

    const rolesAutorises = [
      'AGENT',
      'CONTROLEUR',
      'RESPONSABLE_GARE',
    ];

    if (!rolesAutorises.includes(user.role)) {
      throw new ForbiddenException(
        'Votre rôle ne permet pas de créer une fiche.',
      );
    }

    const gareUtilisateur = this.exigerGareUtilisateur(user);

    if (gareId !== gareUtilisateur) {
      throw new ForbiddenException(
        'Vous ne pouvez pas créer une fiche dans une autre gare.',
      );
    }
  }

  // =====================================================
  // CRÉER UNE FICHE
  // =====================================================

  async create(
    createFicheDto: CreateFicheDto,
    user: FicheUserContext,
  ): Promise<Fiche> {
    this.verifierGareCreation(createFicheDto.gareId, user);

    const fiche = this.ficheRepository.create({
      ...createFicheDto,
      statut: FicheStatut.EN_ATTENTE,
      createurId: user.id,
    });

    return this.ficheRepository.save(fiche);
  }

  // =====================================================
  // CONSULTER TOUTES LES FICHES AUTORISÉES
  // =====================================================

  async findAll(user: FicheUserContext): Promise<Fiche[]> {
    const where = this.peutConsulterToutesLesGares(user)
      ? {}
      : {
          gareId: this.exigerGareUtilisateur(user),
        };

    return this.ficheRepository.find({
      where,
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

  // =====================================================
  // CONSULTER UNE FICHE
  // =====================================================

  async findOne(
    id: string,
    user: FicheUserContext,
  ): Promise<Fiche> {
    const where = this.peutConsulterToutesLesGares(user)
      ? { id }
      : {
          id,
          gareId: this.exigerGareUtilisateur(user),
        };

    const fiche = await this.ficheRepository.findOne({
      where,
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
      throw new NotFoundException('Fiche introuvable.');
    }

    return fiche;
  }

  // =====================================================
  // PRENDRE EN CHARGE
  // EN_ATTENTE → EN_COURS
  // =====================================================

  async prendreEnCharge(
    id: string,
    user: FicheUserContext,
  ): Promise<Fiche> {
    const fiche = await this.findOne(id, user);

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
    user: FicheUserContext,
  ): Promise<Fiche> {
    const fiche = await this.findOne(id, user);

    if (fiche.statut !== FicheStatut.EN_COURS) {
      throw new BadRequestException(
        `La fiche doit être EN_COURS pour être finalisée. Statut actuel : ${fiche.statut}.`,
      );
    }

    fiche.statut = FicheStatut.FINALISEE;
    fiche.finalisateurId = user.id;
    fiche.dateFinalisation = new Date();

    return this.ficheRepository.save(fiche);
  }

  // =====================================================
  // MODIFIER UNE FICHE
  // =====================================================

  async update(
    id: string,
    updateFicheDto: UpdateFicheDto,
    user: FicheUserContext,
  ): Promise<Fiche> {
    const fiche = await this.findOne(id, user);

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

  // =====================================================
  // SUPPRIMER UNE FICHE
  // =====================================================

  async remove(
    id: string,
    user: FicheUserContext,
  ): Promise<void> {
    const fiche = await this.findOne(id, user);

    await this.ficheRepository.remove(fiche);
  }

  // =====================================================
  // IMPRIMER UNE FICHE
  // FINALISEE → IMPRIMEE
  // =====================================================

  async imprimer(
    id: string,
    user: FicheUserContext,
  ): Promise<Fiche> {
    const fiche = await this.findOne(id, user);

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
      user.id,
    );

    fiche.statut = FicheStatut.IMPRIMEE;

    return this.ficheRepository.save(fiche);
  }
}
