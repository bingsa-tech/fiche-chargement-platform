import { PartialType } from '@nestjs/swagger';
import { CreateItineraireDto } from './create-itineraire.dto';

export class UpdateItineraireDto extends PartialType(CreateItineraireDto) {}