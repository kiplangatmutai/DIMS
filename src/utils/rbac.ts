import { Role } from '../data/roles';

export const isSuperAdmin = (role: Pick<Role, 'id'> | null | undefined) =>
  role?.id === 'super-admin';

const normalizePath = (path: string) => {
  const cleanPath = path.split('?')[0].replace(/\/+$/, '') || '/dashboard';

  if (cleanPath.startsWith('/requisitions/') && cleanPath !== '/requisitions/create') {
    return '/requisitions';
  }

  return cleanPath;
};

export const canAccessPath = (
  role: Pick<Role, 'id' | 'routes'> | null | undefined,
  path: string
) => {
  if (!role) {
    return false;
  }

  if (isSuperAdmin(role)) {
    return true;
  }

  const normalizedPath = normalizePath(path);
  return role.routes.some((route) => route.path === normalizedPath);
};

export const firstAllowedPath = (role: Pick<Role, 'routes'> | null | undefined) =>
  role?.routes[0]?.path || '/dashboard';
