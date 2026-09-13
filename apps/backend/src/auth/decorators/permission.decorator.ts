import { SetMetadata } from '@nestjs/common';

import {
  PermissionAction,
  PermissionResource,
} from '../../config/permissions.config';

export const PERMISSION_KEY = 'permission';

export interface PermissionMetadata {
  resource: PermissionResource;
  action: PermissionAction;
}

export const Permission = (
  resource: PermissionResource,
  action: PermissionAction,
) =>
  SetMetadata(PERMISSION_KEY,
    {
      resource,
      action,
    },
  );