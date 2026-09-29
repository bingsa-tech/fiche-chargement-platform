import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DataSource } from 'typeorm';

import { DocumentVehicule } from './entities/document-vehicule.entity';
import { DocumentChauffeur } from './entities/document-chauffeur.entity';
import { CreateDocumentVehiculeDto } from './dto/create-document-vehicule.dto';
import { UpdateDocumentVehiculeDto } from './dto/update-document-vehicule.dto';
@Injectable()
export class DocumentsService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  // =====================================================
  // DOCUMENTS VEHICULE
  // =====================================================

  async findAllVehicule(): Promise<DocumentVehicule[]> {
    return this.dataSource
      .getRepository(DocumentVehicule)
      .find({
        relations: {
          vehicule: true,
        },
        order: {
          dateExpiration: 'ASC',
        },
      });
  }

  async findOneVehicule(id: string): Promise<DocumentVehicule> {
    const document = await this.dataSource
      .getRepository(DocumentVehicule)
      .findOne({
        where: { id },
        relations: {
          vehicule: true,
        },
      });

    if (!document) {
      throw new NotFoundException(
        `Document véhicule ${id} introuvable`,
      );
    }

    return document;
  }

  async createVehicule(
  data: CreateDocumentVehiculeDto,
): Promise<DocumentVehicule> {
  const repository =
    this.dataSource.getRepository(DocumentVehicule);

  const document = repository.create({
    vehiculeId: data.vehiculeId,
    typeDocument: data.typeDocument,
    numeroDocument: data.numeroDocument ?? null,
    dateDelivrance: data.dateDelivrance
      ? new Date(data.dateDelivrance)
      : null,
    dateExpiration: new Date(data.dateExpiration),
    statut: data.statut,
    observations: data.observations ?? null,
  });

  return repository.save(document);
}

async updateVehicule(
  id: string,
  data: UpdateDocumentVehiculeDto,
): Promise<DocumentVehicule> {
  const repository =
    this.dataSource.getRepository(DocumentVehicule);

  const document = await this.findOneVehicule(id);

  if (data.vehiculeId !== undefined) {
    document.vehiculeId = data.vehiculeId;
  }

  if (data.typeDocument !== undefined) {
    document.typeDocument = data.typeDocument;
  }

  if (data.numeroDocument !== undefined) {
    document.numeroDocument = data.numeroDocument;
  }

  if (data.dateDelivrance !== undefined) {
    document.dateDelivrance = data.dateDelivrance
      ? new Date(data.dateDelivrance)
      : null;
  }

  if (data.dateExpiration !== undefined) {
    document.dateExpiration = new Date(data.dateExpiration);
  }

  if (data.statut !== undefined) {
    document.statut = data.statut;
  }

  if (data.observations !== undefined) {
    document.observations = data.observations;
  }

  return repository.save(document);
}

  async removeVehicule(id: string): Promise<void> {
    const repository =
      this.dataSource.getRepository(DocumentVehicule);

    const document = await this.findOneVehicule(id);

    await repository.remove(document);
  }

  // =====================================================
  // DOCUMENTS CHAUFFEUR
  // =====================================================

  async findAllChauffeur(): Promise<DocumentChauffeur[]> {
    return this.dataSource
      .getRepository(DocumentChauffeur)
      .find({
        relations: {
          chauffeur: true,
        },
        order: {
          dateExpiration: 'ASC',
        },
      });
  }

  async findOneChauffeur(id: string): Promise<DocumentChauffeur> {
    const document = await this.dataSource
      .getRepository(DocumentChauffeur)
      .findOne({
        where: { id },
        relations: {
          chauffeur: true,
        },
      });

    if (!document) {
      throw new NotFoundException(
        `Document chauffeur ${id} introuvable`,
      );
    }

    return document;
  }

  async createChauffeur(
    data: Partial<DocumentChauffeur>,
  ): Promise<DocumentChauffeur> {
    const repository =
      this.dataSource.getRepository(DocumentChauffeur);

    const document = repository.create(data);

    return repository.save(document);
  }

  async updateChauffeur(
    id: string,
    data: Partial<DocumentChauffeur>,
  ): Promise<DocumentChauffeur> {
    const repository =
      this.dataSource.getRepository(DocumentChauffeur);

    const document = await this.findOneChauffeur(id);

    Object.assign(document, data);

    return repository.save(document);
  }

  async removeChauffeur(id: string): Promise<void> {
    const repository =
      this.dataSource.getRepository(DocumentChauffeur);

    const document = await this.findOneChauffeur(id);

    await repository.remove(document);
  }
}