import {
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateFicheRemiseDto {
  @IsUUID()
  ficheId!: string;

  @IsOptional()
  @IsString()
  observation?: string;
}