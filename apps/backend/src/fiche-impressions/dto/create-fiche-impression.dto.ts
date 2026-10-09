import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateFicheImpressionDto {
  @IsUUID()
  ficheId!: string;

  @IsInt()
  @Min(1)
  numeroExemplaire!: number;

  @IsOptional()
  @IsString()
  motifReimpression?: string;
}