import api from './axios';

import type {
  AuditFilters,
  AuditLog,
  AuditPaginatedResponse,
} from '../features/audit/types/audit.types';

const AUDIT_ENDPOINT = '/api/audit';

export const auditApi = {
  /**
   * Récupérer les journaux d'audit
   * avec filtres et pagination.
   */
  async findAll(
    filters: AuditFilters = {},
  ): Promise<AuditPaginatedResponse> {
    const response =
      await api.get<AuditPaginatedResponse>(
        AUDIT_ENDPOINT,
        {
          params: filters,
        },
      );

    return response.data;
  },

  /**
   * Récupérer le détail d'un journal.
   */
  async findOne(
    id: string,
  ): Promise<AuditLog> {
    const response =
      await api.get<AuditLog>(
        `${AUDIT_ENDPOINT}/${id}`,
      );

    return response.data;
  },
};