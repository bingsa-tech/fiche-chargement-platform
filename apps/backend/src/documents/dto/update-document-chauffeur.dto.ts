import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateDocumentChauffeurDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  typeDocument?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  numeroDocument?: string;

  @IsDateString()
  @IsOptional()
  dateDelivrance?: string;

  @IsDateString()
  @IsOptional()
  @IsNotEmpty()
  dateExpiration?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(20)
  statut?: string;

  @IsString()
  @IsOptional()
  observations?: string;
}