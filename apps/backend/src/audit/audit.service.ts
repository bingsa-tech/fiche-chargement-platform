
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager,   SelectQueryBuilder, } from 'typeorm';

import { AuditLog } from './entities/audit-log.entity';
import { FilterAuditDto } from './dto/filter-audit.dto';

interface AuditCurrentUser {
  sub: number;
  role: string;
  gareId: string | null;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async createLog(
    data: Partial<AuditLog>,
    manager?: EntityManager,
  ): Promise<AuditLog> {
    const repository = manager
      ? manager.getRepository(AuditLog)
      : this.auditLogRepository;

    const log = repository.create(data);

    return repository.save(log);
  }

  /**
   * Vérifie le rôle et applique le périmètre de consultation.
   */
 private applyAccessScope(
  query: SelectQueryBuilder<AuditLog>,
  currentUser: AuditCurrentUser,
): void {
    if (currentUser.role === 'ADMIN') {
      return;
    }

    if (currentUser.role !== 'RESPONSABLE_GARE') {
      throw new ForbiddenException(
        'Vous ne disposez pas des droits pour consulter le journal d’audit.',
      );
    }

    if (!currentUser.gareId) {
      throw new ForbiddenException(
        'Aucune gare associée à votre compte.',
      );
    }

    // Le responsable ne voit que les événements de sa gare.
    query.andWhere(
      `COALESCE(
        audit.nouvelleValeur->>'gareId',
        audit.ancienneValeur->>'gareId'
      ) = :gareId`,
      { gareId: currentUser.gareId },
    );
  }

  async findAll(
    filters: FilterAuditDto,
    currentUser: AuditCurrentUser,
  ) {
    const query =
      this.auditLogRepository.createQueryBuilder('audit');

    this.applyAccessScope(query, currentUser);

    if (filters.utilisateurId !== undefined) {
      query.andWhere(
        'audit.utilisateurId = :utilisateurId',
        { utilisateurId: filters.utilisateurId },
      );
    }

    if (filters.action) {
      query.andWhere('audit.action = :action', {
        action: filters.action,
      });
    }

    if (filters.entite) {
      query.andWhere('audit.entite = :entite', {
        entite: filters.entite,
      });
    }

    if (filters.entiteId) {
      query.andWhere('audit.entiteId = :entiteId', {
        entiteId: filters.entiteId,
      });
    }

    if (filters.appareilId) {
      query.andWhere('audit.appareilId = :appareilId', {
        appareilId: filters.appareilId,
      });
    }

    if (filters.dateDebut) {
      query.andWhere('audit.dateHeure >= :dateDebut', {
        dateDebut: filters.dateDebut,
      });
    }

    if (filters.dateFin) {
      query.andWhere('audit.dateHeure <= :dateFin', {
        dateFin: filters.dateFin,
      });
    }

    if (filters.search) {
      query.andWhere(
        '(audit.action ILIKE :search OR audit.entite ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));

    query
      .orderBy('audit.dateHeure', 'DESC')
      .addOrderBy('audit.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(
    id: string,
    currentUser: AuditCurrentUser,
  ): Promise<AuditLog> {
    const query = this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.id = :id', { id });

    this.applyAccessScope(query, currentUser);

    const log = await query.getOne();

    if (!log) {
      throw new NotFoundException(
        `Événement d'audit ${id} introuvable.`,
      );
    }

    return log;
  }
}
