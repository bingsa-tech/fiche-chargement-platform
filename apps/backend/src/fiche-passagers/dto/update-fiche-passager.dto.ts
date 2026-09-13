import {
  IsInt,
  IsOptional,
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
}