import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateFicheDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  reference: string;

  @IsUUID()
  @IsNotEmpty()
  gareId: string;

  @IsUUID()
  @IsNotEmpty()
  vehiculeId: string;

  @IsUUID()
  @IsNotEmpty()
  chauffeurId: string;

  @IsUUID()
  @IsNotEmpty()
  destinationId: string;

  @IsUUID()
  @IsOptional()
  itineraireId?: string;

  @IsNotEmpty()
  createurId: number;
}