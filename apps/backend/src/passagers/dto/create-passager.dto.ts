import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePassagerDto {
  @ApiProperty({
    example: 'Ndiaye',
    description: 'Nom du passager',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom: string;

  @ApiProperty({
    example: 'Moussa',
    description: 'Prénom du passager',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  prenom: string;

  @ApiProperty({
    example: '123456789',
    description: 'Numéro de CNI du passager',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  numeroCni: string;
}