
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CreateVehiculeDto } from './create-vehicule.dto';
import { CreateDocumentVehiculeInputDto } from '../../documents/dto/create-document-vehicule-input.dto';

export class CreateVehiculeCompletDto extends CreateVehiculeDto {

  @ApiPropertyOptional({
    description:
      'Identifiant UUID de la gare. Obligatoire pour ADMIN. Pour les autres rôles, la gare provient du JWT.',
    example: 'd3b94ae9-279e-43c1-81d7-67d6960734a9',
  })
  @IsOptional()
  @IsUUID()
  gareId?: string;

  @ApiProperty({
    type: [CreateDocumentVehiculeInputDto],
    description: 'Au moins un document doit être associé au véhicule.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentVehiculeInputDto)
  documents!: CreateDocumentVehiculeInputDto[];
}
