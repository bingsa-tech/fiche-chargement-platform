import {
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateFicheImpressionDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  numeroExemplaire?: number;

  @IsOptional()
  @IsString()
  motifReimpression?: string;
}