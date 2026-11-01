import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAlerteDto } from './create-alerte.dto';

export class UpdateAlerteDto extends PartialType(
  OmitType(
    CreateAlerteDto,
    [
      'documentId',
      'proprietaireType',
      'proprietaireId',
    ] as const,
  ),
) {}
