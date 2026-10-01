import {
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { CreateVehiculeDto } from './create-vehicule.dto';
import { CreateDocumentVehiculeInputDto } from '../../documents/dto/create-document-vehicule-input.dto';

export class CreateVehiculeCompletDto extends CreateVehiculeDto {
  @ApiProperty({
    type: [CreateDocumentVehiculeInputDto],
    description: 'Documents obligatoires associés au véhicule.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentVehiculeInputDto)
  documents!: CreateDocumentVehiculeInputDto[];
}