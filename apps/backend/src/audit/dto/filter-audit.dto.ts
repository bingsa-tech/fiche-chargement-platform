
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsInt,
  IsUUID,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FilterAuditDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  utilisateurId?: number;

  @ApiPropertyOptional({ example: 'UPDATE' })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional({ example: 'VEHICULE' })
  @IsOptional()
  @IsString()
  entite?: string;

  @ApiPropertyOptional({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsOptional()
  @IsUUID()
  entiteId?: string;

  @ApiPropertyOptional({
    example: '2026-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @ApiPropertyOptional({
    example: '2026-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @ApiPropertyOptional({ example: 'device-mobile-01' })
  @IsOptional()
  @IsString()
  appareilId?: string;

  @ApiPropertyOptional({
    description: 'Recherche textuelle dans les actions et entités',
    example: 'UPDATE',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Numéro de page',
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Nombre de résultats par page',
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
