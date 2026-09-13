import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFichePassagerDto {
  @ApiProperty({
    description: 'Identifiant de la fiche',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  ficheId: string;

  @ApiProperty({
    description: 'Identifiant du passager',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  passagerId: string;

  @ApiPropertyOptional({
    description: 'Numéro de place du passager',
    example: 12,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  numeroPlace?: number;
}