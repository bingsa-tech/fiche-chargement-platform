import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateDocumentVehiculeDto {
  @ApiProperty({
    example: 'bfb47b50-6000-42c8-8220-8985ae27f12f',
    description: 'Identifiant UUID du véhicule',
  })
  @IsUUID()
  @IsNotEmpty()
  vehiculeId!: string;

  @ApiProperty({
    example: 'ASSURANCE',
    description: 'Type du document',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  typeDocument!: string;

  @ApiPropertyOptional({
    example: 'ASS-2026-00123',
    description: 'Numéro du document',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  numeroDocument?: string;

  @ApiPropertyOptional({
    example: '2026-01-15',
    description: 'Date de délivrance du document',
  })
  @IsOptional()
  @IsDateString()
  dateDelivrance?: string;

  @ApiProperty({
    example: '2027-01-15',
    description: 'Date d’expiration du document',
  })
  @IsDateString()
  @IsNotEmpty()
  dateExpiration!: string;

  @ApiProperty({
    example: 'VALIDE',
    description: 'Statut du document',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  statut!: string;

  @ApiPropertyOptional({
    example: 'Document vérifié lors de l’enregistrement du véhicule.',
    description: 'Observations',
  })
  @IsOptional()
  @IsString()
  observations?: string;
}