import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { VehiculeStatut } from '../enums/vehicule-statut.enum';

export class CreateVehiculeDto {
  @ApiProperty({
    example: 'CE-1234-AA',
    description: 'Plaque d’immatriculation du véhicule',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  plaqueImmatriculation!: string;

  @ApiProperty({
    example: 'BUS',
    description: 'Type de véhicule',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  type!: string;

  @ApiPropertyOptional({
    example: 'Toyota',
    description: 'Marque du véhicule',
    maxLength: 80,
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  marque?: string;

  @ApiPropertyOptional({
    example: 'Coaster',
    description: 'Modèle du véhicule',
    maxLength: 80,
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  modele?: string;

  @ApiProperty({
    example: 30,
    description: 'Nombre de places disponibles',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  capacite!: number;

  @ApiProperty({
    enum: VehiculeStatut,
    example: VehiculeStatut.ACTIF,
    description: 'Statut du véhicule',
  })
  @IsEnum(VehiculeStatut)
  statut!: VehiculeStatut;

  @ApiProperty({
    example: 'bfb47b50-6000-42c8-8220-8985ae27f12f',
    description: 'Identifiant UUID du propriétaire',
  })
  @IsUUID()
  @IsNotEmpty()
  proprietaireId!: string;
}