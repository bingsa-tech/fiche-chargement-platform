import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

import { DestinationStatut } from '../enums/destination-statut.enum';

export class CreateDestinationDto {
  @ApiProperty({
    example: 'DST-MTL',
    description: 'Code unique de la destination',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  code: string;

  @ApiProperty({
    example: 'Montréal',
    description: 'Nom de la destination',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nom: string;

  @ApiProperty({
    example: 'Montréal',
    description: 'Ville de la destination',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ville: string;

  @ApiProperty({
    example: 'Canada',
    description: 'Pays de la destination',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  pays: string;

  @ApiProperty({
    enum: DestinationStatut,
    example: DestinationStatut.ACTIF,
  })
  @IsEnum(DestinationStatut)
  statut: DestinationStatut;
}