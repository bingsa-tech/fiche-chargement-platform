import { Injectable } from '@nestjs/common';
import { CreateFicheRemiseDto } from './dto/create-fiche-remise.dto';
import { UpdateFicheRemiseDto } from './dto/update-fiche-remise.dto';

@Injectable()
export class FicheRemisesService {
  create(createFicheRemiseDto: CreateFicheRemiseDto) {
    return 'This action adds a new ficheRemise';
  }

  findAll() {
    return `This action returns all ficheRemises`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ficheRemise`;
  }

  update(id: number, updateFicheRemiseDto: UpdateFicheRemiseDto) {
    return `This action updates a #${id} ficheRemise`;
  }

  remove(id: number) {
    return `This action removes a #${id} ficheRemise`;
  }
}
