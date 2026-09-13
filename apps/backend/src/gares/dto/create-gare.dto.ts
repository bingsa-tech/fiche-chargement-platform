import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { GareStatut } from '../enums/gare-statut.enum';

export class CreateGareDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nom: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ville: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  adresse?: string;

  @IsEnum(GareStatut)
  statut: GareStatut;
}