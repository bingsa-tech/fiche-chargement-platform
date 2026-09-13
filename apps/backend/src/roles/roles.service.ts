import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const roleExiste = await this.roleRepository.findOne({
      where: {
        code: createRoleDto.code,
      },
    });

    if (roleExiste) {
      throw new ConflictException(
        `Un rôle avec le code ${createRoleDto.code} existe déjà`,
      );
    }

    const role = this.roleRepository.create(createRoleDto);

    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });

    if (!role) {
      throw new NotFoundException(
        `Le rôle avec l'id ${id} est introuvable`,
      );
    }

    return role;
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    const role = await this.findOne(id);

    if (
      updateRoleDto.code &&
      updateRoleDto.code !== role.code
    ) {
      const roleExiste = await this.roleRepository.findOne({
        where: {
          code: updateRoleDto.code,
        },
      });

      if (roleExiste) {
        throw new ConflictException(
          `Le code ${updateRoleDto.code} est déjà utilisé`,
        );
      }
    }

    Object.assign(role, updateRoleDto);

    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);

    await this.roleRepository.remove(role);
  }
}