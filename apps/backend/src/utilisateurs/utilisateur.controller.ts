import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';

import { UtilisateursService } from './utilisateur.service';

@Controller('utilisateurs')
export class UtilisateursController {
  constructor(
    private readonly utilisateursService: UtilisateursService,
  ) {}

  // =========================
  // CREATE
  // =========================

  @Post()
  create(
    @Body()
    createUtilisateurDto: CreateUtilisateurDto,
  ) {
    return this.utilisateursService.create(
      createUtilisateurDto,
    );
  }

  // =========================
  // READ ALL
  // =========================

  @Get()
  findAll() {
    return this.utilisateursService.findAll();
  }

  // =========================
  // READ ONE
  // =========================

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.utilisateursService.findOne(id);
  }

  // =========================
  // UPDATE
  // =========================

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateUtilisateurDto: UpdateUtilisateurDto,
  ) {
    return this.utilisateursService.update(
      id,
      updateUtilisateurDto,
    );
  }

  // =========================
  // DELETE
  // =========================

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<void> {
    await this.utilisateursService.remove(id);
  }
}