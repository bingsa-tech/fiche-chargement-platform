
import { AuditResponseDto } from './audit-response.dto';

export class AuditPaginatedResponseDto {
  data!: AuditResponseDto[];

  total!: number;

  page!: number;

  limit!: number;

  totalPages!: number;
}
