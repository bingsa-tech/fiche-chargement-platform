import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateGareDto } from './create-gare.dto';

export class UpdateGareDto extends PartialType(
  OmitType(CreateGareDto, ['id'] as const),
) {}