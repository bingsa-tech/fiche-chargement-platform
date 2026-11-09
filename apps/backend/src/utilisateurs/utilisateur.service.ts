import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Utilisateur } from './entities/utilisateur.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { AuditService } from '../audit/audit.service';

interface CurrentUser {
  sub: number;
  username: string;
  role: string;
  gareId: string | null;
}

@Injectable()
export class UtilisateursService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly utilisateursRepository: Repository<Utilisateur>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    private readonly auditService: AuditService,
    private readonly dataSource: DataSource,
  ) {}

  // =====================================================
  // HELPERS
  // =====================================================

  private validateCurrentUser(currentUser: CurrentUser): void {
    if (
      !currentUser ||
      !Number.isInteger(currentUser.sub) ||
      currentUser.sub <= 0
    ) {
      throw new ForbiddenException(
        'Identité de l’utilisateur authentifié invalide.',
      );
    }
  }

  /**
   * Snapshot limité aux données non sensibles.
   * Ne jamais inclure passwordHash, même sous forme de hash.
   */
  private createUtilisateurSnapshot(utilisateur: Utilisateur) {
    return {
      id: utilisateur.id,
      username: utilisateur.username,
      email: utilisateur.email,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      telephone: utilisateur.telephone,
      actif: utilisateur.actif,
      bloque: utilisateur.bloque,
      role: utilisateur.role?.code ?? null,
      gareId: utilisateur.gareId ?? null,
    };
  }

  private sanitizeUtilisateur(
    utilisateur: Utilisateur,
  ): Omit<Utilisateur, 'passwordHash'> {
    const {
      passwordHash: _passwordHash,
      ...safeUtilisateur
    } = utilisateur;

    return safeUtilisateur;
  }

  private async findUtilisateurForMutation(
    id: number,
    manager?: EntityManager,
  ): Promise<Utilisateur> {
    const repository = manager
      ? manager.getRepository(Utilisateur)
      : this.utilisateursRepository;

    const utilisateur = await repository.findOne({
      where: { id },
      relations: {
        role: true,
        gare: true,
      },
    });

    if (!utilisateur) {
      throw new NotFoundException(
        `Utilisateur avec l'identifiant ${id} introuvable`,
      );
    }

    return utilisateur;
  }

  // =====================================================
  // CREATE
  // =====================================================

  async create(
    data: CreateUtilisateurDto,
    currentUser: CurrentUser,
    appareilId: string | null = null,
  ): Promise<Omit<Utilisateur, 'passwordHash'>> {
    this.validateCurrentUser(currentUser);

    // 1. Vérification du username
    const existingUsername = await this.utilisateursRepository.findOne({
      where: { username: data.username },
    });

    if (existingUsername) {
      throw new ConflictException(
        `Le nom d'utilisateur "${data.username}" existe déjà`,
      );
    }

    // 2. Vérification de l'email
    const existingEmail = await this.utilisateursRepository.findOne({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new ConflictException(
        `L'adresse email "${data.email}" existe déjà`,
      );
    }

    // 3. Vérification du rôle demandé
    if (!data.roleId) {
      throw new ConflictException(
        "Le rôle de l'utilisateur est obligatoire",
      );
    }

    const role = await this.rolesRepository.findOne({
      where: { id: data.roleId },
    });

    if (!role) {
      throw new NotFoundException(
        `Rôle avec l'identifiant ${data.roleId} introuvable`,
      );
    }

    if (!role.actif) {
      throw new ForbiddenException(
        `Le rôle "${role.code}" est désactivé`,
      );
    }

    // 4. Règles métier de création
    if (currentUser.role === 'RESPONSABLE_GARE') {
      const allowedRoles = ['AGENT', 'CONTROLEUR'];

      if (!allowedRoles.includes(role.code)) {
        throw new ForbiddenException(
          'Un responsable de gare peut uniquement créer un AGENT ou un CONTROLEUR',
        );
      }

      if (!currentUser.gareId) {
        throw new ForbiddenException(
          "Le responsable de gare n'est associé à aucune gare",
        );
      }

      if (!data.gareId) {
        throw new ForbiddenException(
          'La gare est obligatoire pour la création de cet utilisateur',
        );
      }

      if (data.gareId !== currentUser.gareId) {
        throw new ForbiddenException(
          'Vous ne pouvez créer un utilisateur que dans votre propre gare',
        );
      }
    }

    // 5. Vérification de la gare demandée
    if (data.gareId) {
      const gareExists = await this.utilisateursRepository.manager
        .createQueryBuilder()
        .select('gare.id')
        .from('gare', 'gare')
        .where('gare.id = :gareId', { gareId: data.gareId })
        .getRawOne();

      if (!gareExists) {
        throw new NotFoundException(
          `Gare avec l'identifiant ${data.gareId} introuvable`,
        );
      }
    }

    // 6. Hash du mot de passe
    const passwordHash = await bcrypt.hash(data.password, 10);

    // 7. Création et audit dans la même transaction
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Utilisateur);

      const utilisateur = repository.create({
        username: data.username,
        email: data.email,
        passwordHash,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone ?? null,
        actif: data.actif ?? true,
        bloque: data.bloque ?? false,
        gareId: data.gareId ?? null,
        role,
      });

      const savedUtilisateur = await repository.save(utilisateur);

      const utilisateurAvecRelations = await repository.findOne({
        where: { id: savedUtilisateur.id },
        relations: { role: true, gare: true },
      });

      if (!utilisateurAvecRelations) {
        throw new NotFoundException(
          "L'utilisateur créé est introuvable après sauvegarde",
        );
      }

      await this.auditService.createLog(
        {
          utilisateurId: currentUser.sub,
          action: 'CREATE',
          entite: 'UTILISATEUR',
          entiteId: String(utilisateurAvecRelations.id),
          ancienneValeur: null,
          nouvelleValeur: this.createUtilisateurSnapshot(
            utilisateurAvecRelations,
          ),
          appareilId,
        },
        manager,
      );

      return this.sanitizeUtilisateur(utilisateurAvecRelations);
    });
  }

  // =====================================================
  // FIND ALL
  // =====================================================

  async findAll(): Promise<Array<Omit<Utilisateur, 'passwordHash'>>> {
    const utilisateurs = await this.utilisateursRepository.find({
      relations: {
        role: true,
        gare: true,
      },
      order: { id: 'ASC' },
    });

    return utilisateurs.map((utilisateur) =>
      this.sanitizeUtilisateur(utilisateur),
    );
  }

  // =====================================================
  // FIND ONE
  // =====================================================

  async findOne(
    id: number,
  ): Promise<Omit<Utilisateur, 'passwordHash'>> {
    const utilisateur = await this.utilisateursRepository.findOne({
      where: { id },
      relations: {
        role: true,
        gare: true,
      },
    });

    if (!utilisateur) {
      throw new NotFoundException(
        `Utilisateur avec l'identifiant ${id} introuvable`,
      );
    }

    return this.sanitizeUtilisateur(utilisateur);
  }

  // =====================================================
  // FIND BY USERNAME
  // Utilisé notamment par l'authentification
  // =====================================================

  async findByUsername(username: string): Promise<Utilisateur | null> {
    return this.utilisateursRepository.findOne({
      where: { username },
      relations: {
        role: true,
        gare: true,
      },
    });
  }

  // =====================================================
  // FIND BY USERNAME + ROLE + GARE
  // Utilisé par AuthService.
  // passwordHash reste disponible pour bcrypt.compare().
  // =====================================================

  async findByUsernameWithRole(
    username: string,
  ): Promise<Utilisateur | null> {
    return this.utilisateursRepository.findOne({
      where: { username },
      relations: {
        role: true,
        gare: true,
      },
    });
  }

  // =====================================================
  // FIND BY EMAIL
  // =====================================================

  async findByEmail(email: string): Promise<Utilisateur | null> {
    return this.utilisateursRepository.findOne({
      where: { email },
      relations: {
        role: true,
        gare: true,
      },
    });
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async update(
    id: number,
    data: Partial<Utilisateur>,
    currentUser: CurrentUser,
    appareilId: string | null = null,
  ): Promise<Omit<Utilisateur, 'passwordHash'>> {
    this.validateCurrentUser(currentUser);

    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Utilisateur);

      const utilisateur = await this.findUtilisateurForMutation(
        id,
        manager,
      );

      const ancienneValeur =
        this.createUtilisateurSnapshot(utilisateur);

      // Vérification username
      if (
        data.username &&
        data.username !== utilisateur.username
      ) {
        const existingUsername = await repository.findOne({
          where: { username: data.username },
        });

        if (existingUsername && existingUsername.id !== id) {
          throw new ConflictException(
            `Le nom d'utilisateur "${data.username}" existe déjà`,
          );
        }
      }

      // Vérification email
      if (data.email && data.email !== utilisateur.email) {
        const existingEmail = await repository.findOne({
          where: { email: data.email },
        });

        if (existingEmail && existingEmail.id !== id) {
          throw new ConflictException(
            `L'adresse email "${data.email}" existe déjà`,
          );
        }
      }

      // Compatibilité avec l'ancien comportement.
      // La valeur reçue est hashée avant d'être persistée.
      if ('passwordHash' in data && data.passwordHash) {
        utilisateur.passwordHash = await bcrypt.hash(
          data.passwordHash,
          10,
        );
      }

      // Mise à jour des champs autorisés
      if (data.username !== undefined) {
        utilisateur.username = data.username;
      }
      if (data.email !== undefined) {
        utilisateur.email = data.email;
      }
      if (data.nom !== undefined) {
        utilisateur.nom = data.nom;
      }
      if (data.prenom !== undefined) {
        utilisateur.prenom = data.prenom;
      }
      if (data.telephone !== undefined) {
        utilisateur.telephone = data.telephone;
      }
      if (data.actif !== undefined) {
        utilisateur.actif = data.actif;
      }
      if (data.bloque !== undefined) {
        utilisateur.bloque = data.bloque;
      }
      if (data.gareId !== undefined) {
        utilisateur.gareId = data.gareId;
      }
      if (data.role !== undefined) {
        utilisateur.role = data.role;
      }

      const savedUtilisateur = await repository.save(utilisateur);

      const utilisateurAvecRelations = await repository.findOne({
        where: { id: savedUtilisateur.id },
        relations: { role: true, gare: true },
      });

      if (!utilisateurAvecRelations) {
        throw new NotFoundException(
          `Utilisateur avec l'identifiant ${id} introuvable après modification`,
        );
      }

      await this.auditService.createLog(
        {
          utilisateurId: currentUser.sub,
          action: 'UPDATE',
          entite: 'UTILISATEUR',
          entiteId: String(id),
          ancienneValeur,
          nouvelleValeur: this.createUtilisateurSnapshot(
            utilisateurAvecRelations,
          ),
          appareilId,
        },
        manager,
      );

      return this.sanitizeUtilisateur(utilisateurAvecRelations);
    });
  }

  // =====================================================
  // UPDATE LAST LOGIN
  // Opération technique d'authentification, non auditée ici.
  // =====================================================

  async updateLastLogin(id: number): Promise<void> {
    const utilisateur = await this.utilisateursRepository.findOne({
      where: { id },
    });

    if (!utilisateur) {
      throw new NotFoundException(
        `Utilisateur avec l'identifiant ${id} introuvable`,
      );
    }

    utilisateur.lastLoginAt = new Date();
    await this.utilisateursRepository.save(utilisateur);
  }

  // =====================================================
  // ACTIVER
  // =====================================================

  async activate(
    id: number,
  ): Promise<Omit<Utilisateur, 'passwordHash'>> {
    const utilisateur = await this.findUtilisateurForMutation(id);
    utilisateur.actif = true;
    utilisateur.bloque = false;

    const saved = await this.utilisateursRepository.save(utilisateur);
    return this.sanitizeUtilisateur(saved);
  }

  // =====================================================
  // DÉSACTIVER
  // =====================================================

  async deactivate(
    id: number,
  ): Promise<Omit<Utilisateur, 'passwordHash'>> {
    const utilisateur = await this.findUtilisateurForMutation(id);
    utilisateur.actif = false;

    const saved = await this.utilisateursRepository.save(utilisateur);
    return this.sanitizeUtilisateur(saved);
  }

  // =====================================================
  // BLOQUER
  // =====================================================

  async block(
    id: number,
  ): Promise<Omit<Utilisateur, 'passwordHash'>> {
    const utilisateur = await this.findUtilisateurForMutation(id);
    utilisateur.bloque = true;

    const saved = await this.utilisateursRepository.save(utilisateur);
    return this.sanitizeUtilisateur(saved);
  }

  // =====================================================
  // DÉBLOQUER
  // =====================================================

  async unblock(
    id: number,
  ): Promise<Omit<Utilisateur, 'passwordHash'>> {
    const utilisateur = await this.findUtilisateurForMutation(id);
    utilisateur.bloque = false;

    const saved = await this.utilisateursRepository.save(utilisateur);
    return this.sanitizeUtilisateur(saved);
  }

  // =====================================================
  // DELETE
  // =====================================================

  async remove(
    id: number,
    currentUser: CurrentUser,
    appareilId: string | null = null,
  ): Promise<void> {
    this.validateCurrentUser(currentUser);

    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Utilisateur);

      const utilisateur = await this.findUtilisateurForMutation(
        id,
        manager,
      );

      const ancienneValeur =
        this.createUtilisateurSnapshot(utilisateur);

      await repository.remove(utilisateur);

      await this.auditService.createLog(
        {
          utilisateurId: currentUser.sub,
          action: 'DELETE',
          entite: 'UTILISATEUR',
          entiteId: String(id),
          ancienneValeur,
          nouvelleValeur: null,
          appareilId,
        },
        manager,
      );
    });
  }
}
