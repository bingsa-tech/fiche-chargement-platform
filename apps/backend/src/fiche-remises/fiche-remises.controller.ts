import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FicheRemisesService } from './fiche-remises.service';
import { CreateFicheRemiseDto } from './dto/create-fiche-remise.dto';
import { UpdateFicheRemiseDto } from './dto/update-fiche-remise.dto';

@Controller('fiche-remises')
export class FicheRemisesController {
  constructor(private readonly ficheRemisesService: FicheRemisesService) {}

  @Post()
  create(@Body() createFicheRemiseDto: CreateFicheRemiseDto) {
    return this.ficheRemisesService.create(createFicheRemiseDto);
  }

  @Get()
  findAll() {
    return this.ficheRemisesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ficheRemisesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFicheRemiseDto: UpdateFicheRemiseDto) {
    return this.ficheRemisesService.update(+id, updateFicheRemiseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ficheRemisesService.remove(+id);
  }
}
