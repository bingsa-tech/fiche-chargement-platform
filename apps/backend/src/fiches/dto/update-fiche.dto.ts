import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateFicheDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  reference?: string;

  @IsOptional()
  @IsUUID()
  vehiculeId?: string;

  @IsOptional()
  @IsUUID()
  chauffeurId?: string;

  @IsOptional()
  @IsUUID()
  destinationId?: string;

  @IsOptional()
  @IsUUID()
  itineraireId?: string | null;
}
