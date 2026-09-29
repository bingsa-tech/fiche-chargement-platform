import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProprietaireDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  prenom!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telephone?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  numeroPieceIdentite?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  typePieceIdentite?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  statut!: string;
}