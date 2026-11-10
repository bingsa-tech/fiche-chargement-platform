
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  DataSource,
  EntityManager,
  Repository,
} from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';

import { Passager } from './entities/passager.entity';
import { CreatePassagerDto } from './dto/create-passager.dto';
import { UpdatePassagerDto } from './dto/update-passager.dto';

import { AuditService } from '../audit/audit.service';

@Injectable()
export class PassagersService {
  constructor(
    @InjectRepository(Passager)
    private readonly passagerRepository: Repository<Passager>,

    private readonly dataSource: DataSource,

    private readonly auditService: AuditService,
  ) {}

  /**
   * CREATE
   */
  async create(
    createPassagerDto: CreatePassagerDto,
    utilisateurId: number,
    appareilId: string | null,
  ): Promise<Passager> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Passager);

      const numeroCni = createPassagerDto.numeroCni.trim();

      const existing = await repository.findOne({
        where: { numeroCni },
      });

      if (existing) {
        throw new ConflictException(
          'Un passager avec ce numéro de CNI existe déjà',
        );
      }

      const passager = repository.create({
        nom: createPassagerDto.nom.trim(),
        prenom: createPassagerDto.prenom.trim(),
        numeroCni,
        telephone: createPassagerDto.telephone?.trim() || null,
      });

      const savedPassager = await repository.save(passager);

      await this.auditService.createLog(
        {
          utilisateurId,
          action: 'CREATE',
          entite: 'PASSAGER',
          entiteId: savedPassager.id,
          ancienneValeur: null,
nouvelleValeur: this.createSnapshot(savedPassager),
          appareilId,
        },
        manager,
      );

      return savedPassager;
    });
  }

  /**
   * READ ALL
   */
  async findAll(): Promise<Passager[]> {
    return this.passagerRepository.find({
      order: {
        nom: 'ASC',
        prenom: 'ASC',
      },
    });
  }

  /**
   * READ ONE
   */
  async findOne(id: string): Promise<Passager> {
    const passager = await this.passagerRepository.findOne({
      where: { id },
    });

    if (!passager) {
      throw new NotFoundException(
        `Passager avec l'identifiant ${id} introuvable`,
      );
    }

    return passager;
  }

  /**
   * UPDATE
   */
  async update(
    id: string,
    updatePassagerDto: UpdatePassagerDto,
    utilisateurId: number,
    appareilId: string | null,
  ): Promise<Passager> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Passager);

      const passager = await this.findOneWithManager(
        id,
        manager,
      );

      const anciennesValeurs = this.createSnapshot(passager);

      if (updatePassagerDto.numeroCni !== undefined) {
        const numeroCni = updatePassagerDto.numeroCni.trim();

        if (numeroCni !== passager.numeroCni) {
          const existing = await repository.findOne({
            where: { numeroCni },
          });

          if (existing && existing.id !== id) {
            throw new ConflictException(
              'Un autre passager utilise déjà ce numéro de CNI',
            );
          }

          passager.numeroCni = numeroCni;
        }
      }

      if (updatePassagerDto.nom !== undefined) {
        passager.nom = updatePassagerDto.nom.trim();
      }

      if (updatePassagerDto.prenom !== undefined) {
        passager.prenom = updatePassagerDto.prenom.trim();
      }

      if (updatePassagerDto.telephone !== undefined) {
        passager.telephone =
          updatePassagerDto.telephone?.trim() || null;
      }

      const updatedPassager = await repository.save(passager);

      await this.auditService.createLog(
        {
          utilisateurId,
          action: 'UPDATE',
          entite: 'PASSAGER',
          entiteId: updatedPassager.id,
          ancienneValeur: anciennesValeurs,
nouvelleValeur: this.createSnapshot(updatedPassager),
          appareilId,
        },
        manager,
      );

      return updatedPassager;
    });
  }

  /**
   * DELETE
   */
  async remove(
    id: string,
    utilisateurId: number,
    appareilId: string | null,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Passager);

      const passager = await this.findOneWithManager(
        id,
        manager,
      );

      const anciennesValeurs = this.createSnapshot(passager);

      await repository.remove(passager);

      await this.auditService.createLog(
        {
          utilisateurId,
          action: 'DELETE',
          entite: 'PASSAGER',
          entiteId: id,
          ancienneValeur: anciennesValeurs,
nouvelleValeur: null,
          appareilId,
        },
        manager,
      );
    });
  }

  /**
   * Recherche dans la transaction courante.
   */
  private async findOneWithManager(
    id: string,
    manager: EntityManager,
  ): Promise<Passager> {
    const passager = await manager
      .getRepository(Passager)
      .findOne({
        where: { id },
      });

    if (!passager) {
      throw new NotFoundException(
        `Passager avec l'identifiant ${id} introuvable`,
      );
    }

    return passager;
  }

  /**
   * Snapshot des données métier du passager.
   * On exclut volontairement la relation fichePassagers.
   */
  private createSnapshot(passager: Passager) {
    return {
      id: passager.id,
      nom: passager.nom,
      prenom: passager.prenom,
      numeroCni: passager.numeroCni,
      telephone: passager.telephone,
      createdAt: passager.createdAt,
      updatedAt: passager.updatedAt,
    };
  }
}
