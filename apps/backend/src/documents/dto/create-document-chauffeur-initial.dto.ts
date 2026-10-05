import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDocumentChauffeurInitialDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  typeDocument!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  numeroDocument?: string;

  @IsDateString()
  @IsOptional()
  dateDelivrance?: string;

  @IsDateString()
  @IsNotEmpty()
  dateExpiration!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  statut!: string;

  @IsString()
  @IsOptional()
  observations?: string;
}