import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Fiche } from './entities/fiche.entity';
import { CreateFicheDto } from './dto/create-fiche.dto';
import { UpdateFicheDto } from './dto/update-fiche.dto';
import { ImprimerFicheDto } from '../fiche-impressions/dto/imprimer-fiche.dto';
import { FicheStatut } from './enums/fiche-statut.enum';
import { FicheImpressionsService } from '../fiche-impressions/fiche-impressions.service';
import { FicheImpression } from '../fiche-impressions/entities/fiche-impression.entity';
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

  private readonly dataSource: DataSource,
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

  // Enregistrer la fiche : PostgreSQL génère le numéro.
  const ficheEnregistree = await this.ficheRepository.save(fiche);

  // Relire la fiche depuis la base pour récupérer
  // le numéro de bordereau généré par PostgreSQL.
  return this.ficheRepository.findOneByOrFail({
    id: ficheEnregistree.id,
  });
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
        fichePassagers: { passager: true, },
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
  dto: ImprimerFicheDto = {},
): Promise<Fiche> {
  return this.dataSource.transaction(async (manager) => {
    const ficheRepository = manager.getRepository(Fiche);

    const fiche = await ficheRepository.findOne({
      where: { id },
      lock: { mode: 'pessimistic_write' },
    });

    if (!fiche) {
      throw new NotFoundException(`Fiche ${id} introuvable`);
    }

    // Vérifier l'accès à la gare et les droits métier.
    if (!this.peutConsulterToutesLesGares(user)) {
      const gareUtilisateur = this.exigerGareUtilisateur(user);

      if (fiche.gareId !== gareUtilisateur) {
        throw new ForbiddenException(
          'Vous ne pouvez pas imprimer une fiche d’une autre gare.',
        );
      }
    }

    const impressionRepository =
      manager.getRepository(FicheImpression);

    const impressions = await impressionRepository
      .createQueryBuilder('impression')
      .where('impression.ficheId = :ficheId', {
        ficheId: fiche.id,
      })
      .getMany();

    const numeroExemplaireSuivant =
      impressions.reduce(
        (max, impression) =>
          Math.max(max, Number(impression.numeroExemplaire) || 0),
        0,
      ) + 1;

    if (fiche.statut === FicheStatut.FINALISEE) {
      if (numeroExemplaireSuivant !== 1) {
        throw new BadRequestException(
          'Une impression existe déjà pour cette fiche. Vérifiez son historique.',
        );
      }

      fiche.statut = FicheStatut.IMPRIMEE;
    } else if (fiche.statut === FicheStatut.IMPRIMEE) {
  if (numeroExemplaireSuivant <= 1) {
    throw new BadRequestException(
      'Historique d’impression incohérent : impossible de réimprimer cette fiche.',
    );
  }

  const motif = dto.motifReimpression?.trim();

  if (!motif || motif.length < 5) {
    throw new BadRequestException(
      'Un motif de réimpression d’au moins 5 caractères est obligatoire.',
    );
  }
    } else {
      throw new BadRequestException(
        `La fiche doit être FINALISEE pour une première impression ou IMPRIMEE pour une réimpression. Statut actuel : ${fiche.statut}.`,
      );
    }

    await this.ficheImpressionsService.create(
      {
        ficheId: fiche.id,
        numeroExemplaire: numeroExemplaireSuivant,
        motifReimpression:
          numeroExemplaireSuivant > 1
            ? dto.motifReimpression!.trim()
            : undefined,
      },
      user.id,
      manager,
    );

   await ficheRepository.save(fiche);

const ficheComplete = await ficheRepository.findOne({
  where: { id: fiche.id },
  relations: {
    gare: true,
    vehicule: true,
    chauffeur: true,
    destination: true,
    itineraire: true,
    createur: true,
    finalisateur: true,
    annulateur: true,
    fichePassagers: {
      passager: true,
    },
  },
});

if (!ficheComplete) {
  throw new NotFoundException(
    `Fiche ${fiche.id} introuvable après impression.`,
  );
}

return ficheComplete;
  });
}
}
