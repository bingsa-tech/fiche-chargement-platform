import { PartialType } from '@nestjs/mapped-types';

import { CreateDocumentVehiculeDto } from './create-document-vehicule.dto';

export class UpdateDocumentVehiculeDto extends PartialType(
  CreateDocumentVehiculeDto,
) {}