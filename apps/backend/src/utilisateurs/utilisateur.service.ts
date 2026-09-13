import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Utilisateur } from './entities/utilisateur.entity';

@Injectable()
export class UtilisateursService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly utilisateursRepository: Repository<Utilisateur>,
  ) {}

  // =====================================================
  // CREATE
  // =====================================================

  async create(data: Partial<Utilisateur>): Promise<Utilisateur> {
    // Vérification username
    if (data.username) {
      const existingUsername =
        await this.utilisateursRepository.findOne({
          where: {
            username: data.username,
          },
        });

      if (existingUsername) {
        throw new ConflictException(
          `Le nom d'utilisateur "${data.username}" existe déjà`,
        );
      }
    }

    // Vérification email
    if (data.email) {
      const existingEmail =
        await this.utilisateursRepository.findOne({
          where: {
            email: data.email,
          },
        });

      if (existingEmail) {
        throw new ConflictException(
          `L'adresse email "${data.email}" existe déjà`,
        );
      }
    }

    const utilisateur =
      this.utilisateursRepository.create(data);

    return this.utilisateursRepository.save(utilisateur);
  }

  // =====================================================
  // FIND ALL
  // =====================================================

  async findAll(): Promise<Utilisateur[]> {
    return this.utilisateursRepository.find({
      relations: {
        role: true,
        gare: true,
      },
      order: {
        id: 'ASC',
      },
    });
  }

  // =====================================================
  // FIND ONE
  // =====================================================

  async findOne(id: number): Promise<Utilisateur> {
    const utilisateur =
      await this.utilisateursRepository.findOne({
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
  // FIND BY USERNAME
  // =====================================================

  async findByUsername(
    username: string,
  ): Promise<Utilisateur | null> {
    return this.utilisateursRepository.findOne({
      where: {
        username,
      },
    });
  }

  // =====================================================
  // FIND BY USERNAME + ROLE + GARE
  // Utilisé par AuthService
  // =====================================================

  async findByUsernameWithRole(
    username: string,
  ): Promise<Utilisateur | null> {
    return this.utilisateursRepository.findOne({
      where: {
        username,
      },
      relations: {
        role: true,
        gare: true,
      },
    });
  }

  // =====================================================
  // FIND BY EMAIL
  // =====================================================

  async findByEmail(
    email: string,
  ): Promise<Utilisateur | null> {
    return this.utilisateursRepository.findOne({
      where: {
        email,
      },
    });
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async update(
    id: number,
    data: Partial<Utilisateur>,
  ): Promise<Utilisateur> {
    const utilisateur = await this.findOne(id);

    // Vérifier username si modification
    if (
      data.username &&
      data.username !== utilisateur.username
    ) {
      const existingUsername =
        await this.utilisateursRepository.findOne({
          where: {
            username: data.username,
          },
        });

      if (
        existingUsername &&
        existingUsername.id !== id
      ) {
        throw new ConflictException(
          `Le nom d'utilisateur "${data.username}" existe déjà`,
        );
      }
    }

    // Vérifier email si modification
    if (
      data.email &&
      data.email !== utilisateur.email
    ) {
      const existingEmail =
        await this.utilisateursRepository.findOne({
          where: {
            email: data.email,
          },
        });

      if (
        existingEmail &&
        existingEmail.id !== id
      ) {
        throw new ConflictException(
          `L'adresse email "${data.email}" existe déjà`,
        );
      }
    }

    Object.assign(utilisateur, data);

    return this.utilisateursRepository.save(
      utilisateur,
    );
  }

  // =====================================================
  // UPDATE LAST LOGIN
  // Utilisé par AuthService
  // =====================================================

  async updateLastLogin(id: number): Promise<void> {
    const utilisateur =
      await this.utilisateursRepository.findOne({
        where: { id },
      });

    if (!utilisateur) {
      throw new NotFoundException(
        `Utilisateur avec l'identifiant ${id} introuvable`,
      );
    }

    utilisateur.lastLoginAt = new Date();

    await this.utilisateursRepository.save(
      utilisateur,
    );
  }

  // =====================================================
  // ACTIVER
  // =====================================================

  async activate(id: number): Promise<Utilisateur> {
    const utilisateur = await this.findOne(id);

    utilisateur.actif = true;
    utilisateur.bloque = false;

    return this.utilisateursRepository.save(
      utilisateur,
    );
  }

  // =====================================================
  // DÉSACTIVER
  // =====================================================

  async deactivate(id: number): Promise<Utilisateur> {
    const utilisateur = await this.findOne(id);

    utilisateur.actif = false;

    return this.utilisateursRepository.save(
      utilisateur,
    );
  }

  // =====================================================
  // BLOQUER
  // =====================================================

  async block(id: number): Promise<Utilisateur> {
    const utilisateur = await this.findOne(id);

    utilisateur.bloque = true;

    return this.utilisateursRepository.save(
      utilisateur,
    );
  }

  // =====================================================
  // DÉBLOQUER
  // =====================================================

  async unblock(id: number): Promise<Utilisateur> {
    const utilisateur = await this.findOne(id);

    utilisateur.bloque = false;

    return this.utilisateursRepository.save(
      utilisateur,
    );
  }

  // =====================================================
  // DELETE
  // =====================================================

  async remove(id: number): Promise<void> {
    const utilisateur = await this.findOne(id);

    await this.utilisateursRepository.remove(
      utilisateur,
    );
  }
}