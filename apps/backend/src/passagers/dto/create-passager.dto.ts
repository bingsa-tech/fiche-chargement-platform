
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePassagerDto {
  @ApiProperty({
    example: 'assistant',
    description: 'Nom du passager',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom!: string;

  @ApiProperty({
    example: 'biloloo',
    description: 'Prénom du passager',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  prenom!: string;

  @ApiProperty({
    example: '123456789',
    description: 'Numéro de CNI du passager',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  numeroCni!: string;
  
  @ApiPropertyOptional({
    example: '+237699000000',
    description: 'Numéro de téléphone du passager',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  telephone?: string;
}
