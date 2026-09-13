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

import { CreateGareDto } from './dto/create-gare.dto';
import { UpdateGareDto } from './dto/update-gare.dto';
import { GaresService } from './gares.service';

@Controller('gares')
export class GaresController {
  constructor(
    private readonly garesService: GaresService,
  ) {}

  // POST /gares
  @Post()
  create(@Body() createGareDto: CreateGareDto) {
    return this.garesService.create(createGareDto);
  }

  // GET /gares
  @Get()
  findAll() {
    return this.garesService.findAll();
  }

  // GET /gares/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.garesService.findOne(id);
  }

  // PATCH /gares/:id
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGareDto: UpdateGareDto,
  ) {
    return this.garesService.update(
      id,
      updateGareDto,
    );
  }

  // DELETE /gares/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.garesService.remove(id);
  }
}