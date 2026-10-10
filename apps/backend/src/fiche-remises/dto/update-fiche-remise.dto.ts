import { PartialType } from '@nestjs/swagger';
import { CreateFicheRemiseDto } from './create-fiche-remise.dto';

export class UpdateFicheRemiseDto extends PartialType(CreateFicheRemiseDto) {}
