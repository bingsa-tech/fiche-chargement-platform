import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFichePassagerDto {
  @ApiPropertyOptional({
    description: 'Numéro de place du passager',
    example: 15,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  numeroPlace?: number;

  @ApiPropertyOptional({
    description: 'Tarif payé par le passager en FCFA',
    example: 5000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  tarif?: number;

  @ApiPropertyOptional({
    description: 'Observations concernant le trajet',
    example: 'Bagage supplémentaire',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observations?: string;
}
