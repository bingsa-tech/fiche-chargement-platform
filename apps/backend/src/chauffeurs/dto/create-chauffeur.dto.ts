import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ChauffeurStatut } from '../enums/chauffeur-statut.enum';

import { CreateDocumentChauffeurInitialDto } from '../../documents/dto/create-document-chauffeur-initial.dto';
export class CreateChauffeurDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  prenom!: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  telephone?: string;

  @IsEnum(ChauffeurStatut)
  statut!: ChauffeurStatut;

  /**
   * Document obligatoire lors de l'enregistrement
   * initial du chauffeur.
   */
  @IsObject()
  @ValidateNested()
  @Type(() => CreateDocumentChauffeurInitialDto)
  document!: CreateDocumentChauffeurInitialDto;
}