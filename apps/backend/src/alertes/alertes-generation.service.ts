
import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';

import { AlerteDocument } from './entities/alerte-document.entity';
import { AlerteProprietaireType } from './enums/alerte-proprietaire-type.enum';
import { AlerteType } from './enums/alerte-type.enum';
import { AlerteStatut } from './enums/alerte-statut.enum';

import { DocumentChauffeur } from '../documents/entities/document-chauffeur.entity';
import { DocumentVehicule } from '../documents/entities/document-vehicule.entity';

@Injectable()
export class AlertesGenerationService implements OnModuleInit {
  private readonly logger = new Logger(AlertesGenerationService.name);

  constructor(
    @InjectRepository(AlerteDocument)
    private readonly alerteRepository: Repository<AlerteDocument>,

    @InjectRepository(DocumentChauffeur)
    private readonly chauffeurRepository: Repository<DocumentChauffeur>,

    @InjectRepository(DocumentVehicule)
    private readonly vehiculeRepository: Repository<DocumentVehicule>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.genererAlertesAutomatiquement();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'America/Toronto',
  })
  async verifierEcheances(): Promise<void> {
    await this.genererAlertesAutomatiquement();
  }

  async genererAlertesAutomatiquement(): Promise<void> {
    const aujourdHui = this.obtenirDateDuQuebec(new Date());

    const dateLimiteDate = new Date(`${aujourdHui}T00:00:00.000Z`);
    dateLimiteDate.setUTCDate(dateLimiteDate.getUTCDate() + 30);
    const dateLimite = this.formatDate(dateLimiteDate);

    this.logger.log(
      `Recherche des documents expirant entre ${aujourdHui} et ${dateLimite}`,
    );

    const [documentsChauffeurs, documentsVehicules] = await Promise.all([
      this.chauffeurRepository
        .createQueryBuilder('doc')
        .where('doc.dateExpiration >= :aujourdHui', { aujourdHui })
        .andWhere('doc.dateExpiration <= :dateLimite', { dateLimite })
        .andWhere('doc.statut = :statut', { statut: 'VALIDE' })
        .getMany(),

      this.vehiculeRepository
        .createQueryBuilder('doc')
        .where('doc.dateExpiration >= :aujourdHui', { aujourdHui })
        .andWhere('doc.dateExpiration <= :dateLimite', { dateLimite })
        .andWhere('doc.statut = :statut', { statut: 'VALIDE' })
        .getMany(),
    ]);

    let creees = 0;

    for (const doc of documentsChauffeurs) {
      const creee = await this.creerSiAbsente({
        typeDocument: doc.typeDocument,
        documentId: doc.id,
        proprietaireType: AlerteProprietaireType.CHAUFFEUR,
        proprietaireId: doc.chauffeurId,
        dateDeclenchement: aujourdHui,
        dateExpiration: this.formatDate(doc.dateExpiration),
        typeAlerte: AlerteType.ATTENTION,
        statut: AlerteStatut.NON_LUE,
        dateLecture: null,
        utilisateurLecture: null,
      });

      if (creee) creees++;
    }

    for (const doc of documentsVehicules) {
      const creee = await this.creerSiAbsente({
        typeDocument: doc.typeDocument,
        documentId: doc.id,
        proprietaireType: AlerteProprietaireType.VEHICULE,
        proprietaireId: doc.vehiculeId,
        dateDeclenchement: aujourdHui,
        dateExpiration: this.formatDate(doc.dateExpiration),
        typeAlerte: AlerteType.ATTENTION,
        statut: AlerteStatut.NON_LUE,
        dateLecture: null,
        utilisateurLecture: null,
      });

      if (creee) creees++;
    }

    this.logger.log(
      `Vérification terminée : ${creees} nouvelle(s) alerte(s).`,
    );
  }

  private async creerSiAbsente(
    donnees: Partial<AlerteDocument>,
  ): Promise<boolean> {
    const resultat = await this.alerteRepository
      .createQueryBuilder()
      .insert()
      .values(donnees)
      .orIgnore()
      .returning('id')
      .execute();

    return Array.isArray(resultat.raw) && resultat.raw.length > 0;
  }
  private obtenirDateDuQuebec(date: Date): string {
  const parties = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const annee = parties.find((p) => p.type === 'year')!.value;
  const mois = parties.find((p) => p.type === 'month')!.value;
  const jour = parties.find((p) => p.type === 'day')!.value;

  return `${annee}-${mois}-${jour}`;
}
  private formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date.slice(0, 10);
    }

    const annee = date.getUTCFullYear();
    const mois = String(date.getUTCMonth() + 1).padStart(2, '0');
    const jour = String(date.getUTCDate()).padStart(2, '0');

    return `${annee}-${mois}-${jour}`;
  }
}
