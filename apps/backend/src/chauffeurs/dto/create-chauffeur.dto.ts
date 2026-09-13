import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ChauffeurStatut } from '../enums/chauffeur-statut.enum';
export class CreateChauffeurDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  prenom: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  telephone?: string;

  @IsEnum(ChauffeurStatut)
  statut: ChauffeurStatut;
}