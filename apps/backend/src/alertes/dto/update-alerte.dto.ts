import { PartialType } from '@nestjs/swagger';
import { CreateAlerteDto } from './create-alerte.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAlerteDto extends PartialType(CreateAlerteDto) {
  @ApiPropertyOptional()
  dateLecture?: string;
}
