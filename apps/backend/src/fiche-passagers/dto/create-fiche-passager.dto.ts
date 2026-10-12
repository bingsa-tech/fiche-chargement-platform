import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer'; // <--- Import indispensable

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateFichePassagerDto {
  @ApiProperty({
    description: 'Identifiant de la fiche',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  ficheId!: string;

  @ApiProperty({
    description: 'Identifiant du passager',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  passagerId!: string;

  @ApiPropertyOptional({
    description: 'Numéro de place du passager',
    example: 12,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number) // <--- Convertit la string en number
  @IsInt()
  @Min(1)
  numeroPlace?: number;

  @ApiPropertyOptional({ example: 5000, minimum: 0 })
  @IsOptional()
  @Type(() => Number) // <--- Convertit la string en number
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