import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ImprimerFicheDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  motifReimpression?: string;
}