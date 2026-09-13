import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { ItineraireStatut } from '../enums/itineraire-statut.enum';

export class CreateItineraireDto {
  @IsUUID()
  @IsNotEmpty()
  destinationId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  libelle: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ItineraireStatut)
  statut: ItineraireStatut;
}