import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { AlerteProprietaireType } from '../enums/alerte-proprietaire-type.enum';
import { AlerteType } from '../enums/alerte-type.enum';

export class CreateAlerteDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  typeDocument!: string;

  @IsNotEmpty()
  @IsUUID()
  documentId!: string;

  @IsNotEmpty()
  @IsEnum(AlerteProprietaireType)
  proprietaireType!: AlerteProprietaireType;

  @IsNotEmpty()
  @IsUUID()
  proprietaireId!: string;

  @IsNotEmpty()
  @IsDateString()
  dateDeclenchement!: string;

  @IsNotEmpty()
  @IsDateString()
  dateExpiration!: string;

  @IsNotEmpty()
  @IsEnum(AlerteType)
  typeAlerte!: AlerteType;
}
