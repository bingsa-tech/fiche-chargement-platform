import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class AnnulerFicheDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  motifAnnulation: string;

  @IsNotEmpty()
  annulateurId: number;
}