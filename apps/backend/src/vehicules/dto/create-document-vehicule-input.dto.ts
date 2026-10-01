import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateDocumentVehiculeInputDto {
  @ApiProperty({
    example: 'ASSURANCE',
    description: 'Type du document du véhicule',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  typeDocument!: string;

  @ApiPropertyOptional({
    example: 'ASS-2026-001',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  numeroDocument?: string;

  @ApiPropertyOptional({
    example: '2026-01-15',
  })
  @IsOptional()
  @IsDateString()
  dateDelivrance?: string;

  @ApiProperty({
    example: '2027-01-15',
  })
  @IsDateString()
  @IsNotEmpty()
  dateExpiration!: string;

  @ApiProperty({
    example: 'VALIDE',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  statut!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observations?: string;
}