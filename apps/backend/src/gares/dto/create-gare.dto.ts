import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { GareStatut } from '../enums/gare-statut.enum';

export class CreateGareDto {
  @IsOptional()
  @IsUUID()
  id?: string;
  
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
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;
  @IsEnum(GareStatut)
  statut: GareStatut;
}