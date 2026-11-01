
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuditResponseDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  utilisateurId!: number | null;

  @ApiProperty()
  action!: string;

  @ApiProperty()
  entite!: string;

  @ApiProperty()
  entiteId!: string;

  @ApiProperty()
  dateHeure!: Date;

  @ApiPropertyOptional({ nullable: true, type: 'object' })
  ancienneValeur!: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true, type: 'object' })
  nouvelleValeur!: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true })
  appareilId!: string | null;
}
