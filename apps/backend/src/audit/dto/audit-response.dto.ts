
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuditResponseDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ type: Number, nullable: true })
  utilisateurId!: number | null;

  @ApiProperty()
  action!: string;

  @ApiProperty()
  entite!: string;

  @ApiProperty()
  entiteId!: string;

  @ApiProperty()
  dateHeure!: Date;

  @ApiPropertyOptional({
    type: 'object',
    nullable: true,
    additionalProperties: true,
  })
  ancienneValeur!: Record<string, unknown> | null;

  @ApiPropertyOptional({
    type: 'object',
    nullable: true,
    additionalProperties: true,
  })
  nouvelleValeur!: Record<string, unknown> | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  appareilId!: string | null;
}
