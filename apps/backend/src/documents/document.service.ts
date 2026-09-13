import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DataSource } from 'typeorm';

import { DocumentVehicule } from './entities/document-vehicule.entity';
import { DocumentChauffeur } from './entities/document-chauffeur.entity';

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
    data: Partial<DocumentVehicule>,
  ): Promise<DocumentVehicule> {
    const repository =
      this.dataSource.getRepository(DocumentVehicule);

    const document = repository.create(data);

    return repository.save(document);
  }

  async updateVehicule(
    id: string,
    data: Partial<DocumentVehicule>,
  ): Promise<DocumentVehicule> {
    const repository =
      this.dataSource.getRepository(DocumentVehicule);

    const document = await this.findOneVehicule(id);

    Object.assign(document, data);

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