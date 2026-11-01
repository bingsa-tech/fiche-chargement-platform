
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DocumentChauffeur } from '../documents/entities/document-chauffeur.entity';
import { DocumentVehicule } from '../documents/entities/document-vehicule.entity';
import { AlerteDocument } from './entities/alerte-document.entity';
import { CreateAlerteDto } from './dto/create-alerte.dto';
import { UpdateAlerteDto } from './dto/update-alerte.dto';
import { AlerteStatut } from './enums/alerte-statut.enum';


@Injectable()
export class AlertesService {
 constructor(
    @InjectRepository(AlerteDocument)
    private readonly alerteRepository: Repository<AlerteDocument>,

    @InjectRepository(DocumentChauffeur)
    private readonly documentChauffeurRepository:
      Repository<DocumentChauffeur>,

    @InjectRepository(DocumentVehicule)
    private readonly documentVehiculeRepository:
      Repository<DocumentVehicule>,
  ) {}

  async create(
    createAlerteDto: CreateAlerteDto,
  ): Promise<AlerteDocument> {
    this.verifierCoherenceDates(
      createAlerteDto.dateDeclenchement,
      createAlerteDto.dateExpiration,
    );

    const alerte = this.alerteRepository.create({
      ...createAlerteDto,
      statut: AlerteStatut.NON_LUE,
      dateLecture: null,
      utilisateurLecture: null,
    });

    return this.alerteRepository.save(alerte);
  }

 
async findAll() {
  const alertes = await this.alerteRepository.find({
    order: {
      dateExpiration: 'ASC',
    },
  });

  const idsChauffeurs = alertes
    .filter((a) => a.proprietaireType === 'CHAUFFEUR')
    .map((a) => a.documentId);

  const idsVehicules = alertes
    .filter((a) => a.proprietaireType === 'VEHICULE')
    .map((a) => a.documentId);

  const documentsChauffeurs = idsChauffeurs.length
    ? await this.documentChauffeurRepository.find({
        where: { id: In(idsChauffeurs) },
        relations: { chauffeur: true },
      })
    : [];

  const documentsVehicules = idsVehicules.length
    ? await this.documentVehiculeRepository.find({
        where: { id: In(idsVehicules) },
        relations: { vehicule: true },
      })
    : [];

  const chauffeursParId = new Map(
    documentsChauffeurs.map((doc) => [doc.id, doc]),
  );

  const vehiculesParId = new Map(
    documentsVehicules.map((doc) => [doc.id, doc]),
  );

  return alertes.map((alerte) => {
    if (alerte.proprietaireType === 'CHAUFFEUR') {
      const document = chauffeursParId.get(alerte.documentId);

      return {
        ...alerte,
        document: document
          ? {
              id: document.id,
              typeDocument: document.typeDocument,
              numeroDocument: document.numeroDocument,
              dateExpiration: document.dateExpiration,
              statut: document.statut,
            }
          : null,
        proprietaire: document?.chauffeur
          ? {
              id: document.chauffeur.id,
              nom: document.chauffeur.nom,
              prenom: document.chauffeur.prenom,
            }
          : null,
      };
    }

    if (alerte.proprietaireType === 'VEHICULE') {
      const document = vehiculesParId.get(alerte.documentId);

      return {
        ...alerte,
        document: document
          ? {
              id: document.id,
              typeDocument: document.typeDocument,
              numeroDocument: document.numeroDocument,
              dateExpiration: document.dateExpiration,
              statut: document.statut,
            }
          : null,
        proprietaire: document?.vehicule
          ? {
              id: document.vehicule.id,
              plaqueImmatriculation:
                document.vehicule.plaqueImmatriculation,
              marque: document.vehicule.marque,
              modele: document.vehicule.modele,
            }
          : null,
      };
    }

    return {
      ...alerte,
      document: null,
      proprietaire: null,
    };
  });
}


  async findOne(id: string): Promise<AlerteDocument> {
    const alerte = await this.alerteRepository.findOne({
      where: { id },
    });

    if (!alerte) {
      throw new NotFoundException(
        `Alerte avec l'identifiant ${id} introuvable`,
      );
    }

    return alerte;
  }

  async update(
    id: string,
    updateAlerteDto: UpdateAlerteDto,
  ): Promise<AlerteDocument> {
    const alerte = await this.findOne(id);

    const dateDeclenchement =
      updateAlerteDto.dateDeclenchement ??
      alerte.dateDeclenchement;

    const dateExpiration =
      updateAlerteDto.dateExpiration ??
      alerte.dateExpiration;

    this.verifierCoherenceDates(
      dateDeclenchement,
      dateExpiration,
    );

    Object.assign(alerte, updateAlerteDto);

    return this.alerteRepository.save(alerte);
  }

  async marquerCommeLue(
    id: string,
    utilisateurLecture: number,
  ): Promise<AlerteDocument> {
    const alerte = await this.findOne(id);

    // Ne pas écraser la première date ni l'utilisateur de lecture.
    if (alerte.statut !== AlerteStatut.NON_LUE) {
      return alerte;
    }

    alerte.statut = AlerteStatut.LUE;
    alerte.dateLecture = new Date();
    alerte.utilisateurLecture = utilisateurLecture;

    return this.alerteRepository.save(alerte);
  }

  async remove(id: string): Promise<void> {
    const alerte = await this.findOne(id);

    await this.alerteRepository.remove(alerte);
  }

  private verifierCoherenceDates(
    dateDeclenchement: string | Date,
    dateExpiration: string | Date,
  ): void {
    const debut = new Date(dateDeclenchement).getTime();
    const expiration = new Date(dateExpiration).getTime();

    if (expiration < debut) {
      throw new ConflictException(
        'La date d’expiration ne peut pas précéder la date de déclenchement.',
      );
    }
  }
}
