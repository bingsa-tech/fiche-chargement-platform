import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { AlerteProprietaireType } from '../enums/alerte-proprietaire-type.enum';
import { AlerteType } from '../enums/alerte-type.enum';
import { AlerteStatut } from '../enums/alerte-statut.enum';

export class CreateAlerteDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  typeDocument: string;

  @IsNotEmpty()
  @IsUUID()
  documentId: string;

  @IsEnum(AlerteProprietaireType)
  proprietaireType: AlerteProprietaireType;

  @IsNotEmpty()
  @IsUUID()
  proprietaireId: string;

  @IsNotEmpty()
  @IsDateString()
  dateDeclenchement: string;

  @IsNotEmpty()
  @IsDateString()
  dateExpiration: string;



  @IsEnum(AlerteType)
  typeAlerte: AlerteType;

  @IsEnum(AlerteStatut)
  statut: AlerteStatut;

  @IsOptional()
  @IsDateString()
  dateLecture?: string;

  @IsOptional()
  @IsInt()
  utilisateurLecture?: number;
}