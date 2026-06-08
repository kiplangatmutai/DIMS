import type { AuthUser } from '../context/RoleContext';

export const getFacilityScopeId = (user: AuthUser | null) =>
  user?.facility?.id || user?.facilityId || user?.id || null;
