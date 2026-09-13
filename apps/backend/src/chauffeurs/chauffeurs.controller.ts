import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateChauffeurDto } from './dto/create-chauffeur.dto';
import { UpdateChauffeurDto } from './dto/update-chauffeur.dto';
import { ChauffeursService } from './chauffeurs.service';

@Controller('chauffeurs')
export class ChauffeursController {
  constructor(
    private readonly chauffeursService: ChauffeursService,
  ) {}

  // POST /chauffeurs
  @Post()
  create(@Body() createChauffeurDto: CreateChauffeurDto) {
    return this.chauffeursService.create(createChauffeurDto);
  }

  // GET /chauffeurs
  @Get()
  findAll() {
    return this.chauffeursService.findAll();
  }

  // GET /chauffeurs/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chauffeursService.findOne(id);
  }

  // PATCH /chauffeurs/:id
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChauffeurDto: UpdateChauffeurDto,
  ) {
    return this.chauffeursService.update(
      id,
      updateChauffeurDto,
    );
  }

  // DELETE /chauffeurs/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.chauffeursService.remove(id);
  }
}