
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Destination } from './entities/destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

import { AuditService } from '../audit/audit.service';

type UtilisateurAuthentifie = {
  sub: number;
  username: string;
  role: string;
  gareId: string | null;
};

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,

    private readonly dataSource: DataSource,

    private readonly auditService: AuditService,
  ) {}

  /**
   * Construit un snapshot simple de la destination.
   */
  private createDestinationSnapshot(
    destination: Destination,
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(destination).filter(
        ([, value]) => typeof value !== 'function',
      ),
    );
  }

  // =====================================================
  // CREATE
  // =====================================================

  async create(
    createDestinationDto: CreateDestinationDto,
    user: UtilisateurAuthentifie,
    appareilId: string | null = null,
  ): Promise<Destination> {
    return this.dataSource.transaction(async (manager) => {
      const existingDestination = await manager.findOne(
        Destination,
        {
          where: {
            code: createDestinationDto.code,
          },
        },
      );

      if (existingDestination) {
        throw new ConflictException(
          `Une destination avec le code "${createDestinationDto.code}" existe déjà.`,
        );
      }

      const destination = manager.create(
        Destination,
        createDestinationDto,
      );

      const savedDestination = await manager.save(
        Destination,
        destination,
      );

      // AUDIT CREATE
      await this.auditService.createLog(
        {
          utilisateurId: user.sub,
          action: 'CREATE',
          entite: 'DESTINATION',
          entiteId: savedDestination.id,
          ancienneValeur: null,
          nouvelleValeur:
            this.createDestinationSnapshot(savedDestination),
          appareilId,
        },
        manager,
      );

      return savedDestination;
    });
  }

  // =====================================================
  // FIND ALL
  // =====================================================

  async findAll(): Promise<Destination[]> {
    return this.destinationRepository.find({
      order: {
        nom: 'ASC',
      },
    });
  }

  // =====================================================
  // FIND ONE
  // =====================================================

  async findOne(id: string): Promise<Destination> {
    const destination = await this.destinationRepository.findOne({
      where: { id },
    });

    if (!destination) {
      throw new NotFoundException(
        `Destination avec l'identifiant "${id}" introuvable.`,
      );
    }

    return destination;
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async update(
    id: string,
    updateDestinationDto: UpdateDestinationDto,
    user: UtilisateurAuthentifie,
    appareilId: string | null = null,
  ): Promise<Destination> {
    return this.dataSource.transaction(async (manager) => {
      const destination = await manager.findOne(Destination, {
        where: { id },
      });

      if (!destination) {
        throw new NotFoundException(
          `Destination avec l'identifiant "${id}" introuvable.`,
        );
      }

      // Snapshot avant modification.
      const ancienneValeur =
        this.createDestinationSnapshot(destination);

      // Vérification de l'unicité du code.
      if (
        updateDestinationDto.code &&
        updateDestinationDto.code !== destination.code
      ) {
        const existingDestination = await manager.findOne(
          Destination,
          {
            where: {
              code: updateDestinationDto.code,
            },
          },
        );

        if (existingDestination) {
          throw new ConflictException(
            `Une destination avec le code "${updateDestinationDto.code}" existe déjà.`,
          );
        }
      }

      Object.assign(destination, updateDestinationDto);

      const destinationModifiee = await manager.save(
        Destination,
        destination,
      );

      // AUDIT UPDATE
      await this.auditService.createLog(
        {
          utilisateurId: user.sub,
          action: 'UPDATE',
          entite: 'DESTINATION',
          entiteId: destinationModifiee.id,
          ancienneValeur,
          nouvelleValeur:
            this.createDestinationSnapshot(destinationModifiee),
          appareilId,
        },
        manager,
      );

      return destinationModifiee;
    });
  }

  // =====================================================
  // DELETE
  // =====================================================

  async remove(
    id: string,
    user: UtilisateurAuthentifie,
    appareilId: string | null = null,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const destination = await manager.findOne(Destination, {
        where: { id },
      });

      if (!destination) {
        throw new NotFoundException(
          `Destination avec l'identifiant "${id}" introuvable.`,
        );
      }

      // Snapshot avant suppression.
      const ancienneValeur =
        this.createDestinationSnapshot(destination);

      await manager.remove(Destination, destination);

      // AUDIT DELETE
      await this.auditService.createLog(
        {
          utilisateurId: user.sub,
          action: 'DELETE',
          entite: 'DESTINATION',
          entiteId: id,
          ancienneValeur,
          nouvelleValeur: null,
          appareilId,
        },
        manager,
      );
    });
  }
}
