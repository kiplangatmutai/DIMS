import { randomUUID } from 'node:crypto';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { handleRequest as handleCurrentApiRequest } from './server/index.mjs';
import {
  counties,
  deviceTypes,
  facilities,
  handovers,
  inventory,
  maintenanceTickets,
  modules,
  requisitions,
  roles,
  stolenReports,
  users
} from './server/data.mjs';

const port = Number(process.env.PORT || 3000);
const basePath = '/dha-device-hub';
const rootDir = fileURLToPath(new URL('./dist', import.meta.url));
const indexFile = join(rootDir, 'index.html');
const sessions = new Map();

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Content-Type': 'application/json; charset=utf-8'
  });

  response.end(JSON.stringify(payload));
}

function notFound(response) {
  return sendJson(response, 404, {
    error: {
      code: 'NOT_FOUND',
      message: 'The requested API route does not exist.'
    }
  });
}

function badRequest(response, message) {
  return sendJson(response, 400, {
    error: {
      code: 'BAD_REQUEST',
      message
    }
  });
}

async function readBody(request) {
  let raw = '';

  for await (const chunk of request) {
    raw += chunk;
  }

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('Request body must be valid JSON.');
  }
}

function stripPassword({ password, ...user }) {
  return user;
}

function enrichUser(user) {
  return {
    ...stripPassword(user),
    role: roles.find((role) => role.id === user.roleId) || null,
    facility: facilities.find((facility) => facility.id === user.facilityId) || null
  };
}

function getBearerToken(request) {
  const header = request.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
}

function getRequestUser(request) {
  const token = getBearerToken(request);
  const userId = token ? sessions.get(token) : null;
  return userId ? users.find((user) => user.id === userId && user.status === 'Active') || null : null;
}

function getUserRole(user) {
  return roles.find((role) => role.id === user?.roleId) || null;
}

function isSuperAdmin(user) {
  return user?.roleId === 'super-admin';
}

function getUserTier(user) {
  return getUserRole(user)?.tier || null;
}

function isFacilityScoped(user) {
  return getUserTier(user) === 'Facility';
}

function filterFacilityScopedRecords(user, records) {
  if (!isFacilityScoped(user)) {
    return records;
  }

  if (!user.facilityId) {
    return [];
  }

  return records.filter((record) => record.facilityId === user.facilityId);
}

function hasRouteAccess(user, routePaths) {
  if (isSuperAdmin(user)) {
    return true;
  }

  const role = getUserRole(user);
  const allowedRoutes = role?.routes?.map((route) => route.path) || [];
  return routePaths.some((routePath) => allowedRoutes.includes(routePath));
}

function requireUser(response, user) {
  if (!user) {
    unauthorized(response);
    return false;
  }

  return true;
}

function requireRoute(response, user, routePaths) {
  if (!requireUser(response, user)) {
    return false;
  }

  if (!hasRouteAccess(user, routePaths)) {
    forbidden(response);
    return false;
  }

  return true;
}

function canManageRole(user, roleId) {
  if (isSuperAdmin(user)) {
    return true;
  }

  const role = getUserRole(user);
  return Boolean(role?.canOnboardRoleIds?.includes(roleId));
}

function canManageUser(actor, targetUser) {
  if (!targetUser) {
    return false;
  }

  if (isSuperAdmin(actor)) {
    return true;
  }

  return canManageRole(actor, targetUser.roleId);
}

function getVisibleRoles(user) {
  if (isSuperAdmin(user)) {
    return roles;
  }

  const role = getUserRole(user);
  const visibleRoleIds = new Set([user.roleId, ...(role?.canOnboardRoleIds || [])]);
  return roles.filter((candidate) => visibleRoleIds.has(candidate.id));
}

function getVisibleUsers(user) {
  if (isSuperAdmin(user)) {
    return users;
  }

  return users.filter((candidate) => candidate.id === user.id || canManageUser(user, candidate));
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getAllowedOnboardingRoleIds() {
  const customRoleIds = roles.filter((role) => role.isCustom).map((role) => role.id);
  const mappedRoleIds = roles.flatMap((role) => role.canOnboardRoleIds || []);

  return [...new Set([...mappedRoleIds, ...customRoleIds])];
}

function createRole(body) {
  const requiredFields = ['name', 'tier', 'modulePaths'];
  const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === '');

  if (missing.length > 0) {
    return {
      error: `Missing required field(s): ${missing.join(', ')}`
    };
  }

  const validTiers = ['Facility', 'Sub-County', 'County', 'DHA', 'Vendor', 'Admin'];

  if (!validTiers.includes(body.tier)) {
    return {
      error: 'Selected tier is not supported.'
    };
  }

  if (!Array.isArray(body.modulePaths) || body.modulePaths.length === 0) {
    return {
      error: 'Select at least one module for this profile.'
    };
  }

  const selectedRoutes = body.modulePaths.map((path) =>
    modules.find((module) => module.path === path)
  );

  if (selectedRoutes.some((route) => !route)) {
    return {
      error: 'One or more selected modules do not exist.'
    };
  }

  const id = slugify(body.id || body.name);

  if (!id) {
    return {
      error: 'Profile name must contain letters or numbers.'
    };
  }

  if (roles.some((role) => role.id === id)) {
    return {
      error: 'A profile with this name already exists.'
    };
  }

  const created = {
    id,
    name: String(body.name),
    tier: String(body.tier),
    description: body.description || 'Custom access profile.',
    routes: selectedRoutes,
    canOnboardRoleIds: Array.isArray(body.canOnboardRoleIds) ? body.canOnboardRoleIds : [],
    isCustom: true
  };

  roles.push(created);

  const superAdmin = roles.find((role) => role.id === 'super-admin');

  if (superAdmin && !superAdmin.canOnboardRoleIds.includes(created.id)) {
    superAdmin.canOnboardRoleIds.push(created.id);
  }

  return { created };
}

function createUser(body, actor) {
  const requiredFields = ['name', 'username', 'email', 'password', 'roleId'];
  const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === '');

  if (missing.length > 0) {
    return {
      error: `Missing required field(s): ${missing.join(', ')}`
    };
  }

  if (users.some((user) => user.username.toLowerCase() === String(body.username).toLowerCase())) {
    return {
      error: 'Username is already in use.'
    };
  }

  if (users.some((user) => user.email.toLowerCase() === String(body.email).toLowerCase())) {
    return {
      error: 'Email is already in use.'
    };
  }

  if (!roles.some((role) => role.id === body.roleId)) {
    return {
      error: 'Selected role does not exist.'
    };
  }

  if (!canManageRole(actor, body.roleId) || !getAllowedOnboardingRoleIds().includes(body.roleId)) {
    return {
      error: 'Users cannot be onboarded into this profile.'
    };
  }

  if (body.facilityId && !facilities.some((facility) => facility.id === body.facilityId)) {
    return {
      error: 'Selected facility does not exist.'
    };
  }

  const created = {
    id: `USR-${String(users.length + 1).padStart(3, '0')}`,
    name: String(body.name),
    username: String(body.username),
    email: String(body.email),
    password: String(body.password),
    roleId: String(body.roleId),
    facilityId: body.facilityId || null,
    status: 'Active'
  };

  users.push(created);

  return { created };
}

function getDashboardSummary() {
  const totalDevices = inventory.length;
  const activeDevices = inventory.filter((item) => item.status === 'Device Accepted').length;
  const maintenanceDevices = inventory.filter((item) => item.status === 'Awaiting Support').length;
  const stolenDevices = inventory.filter((item) => item.status === 'Stolen').length;
  const openTickets = maintenanceTickets.filter((item) => item.status !== 'Closed').length;
  const stolenIncidents = stolenReports.filter((item) => item.status === 'Stolen').length;
  const pendingRequests = requisitions.filter((item) => item.status.startsWith('Pending')).length;
  const approvedRequests = requisitions.filter((item) => item.status === 'Approved').length;

  return {
    totalDevices,
    activeDevices,
    maintenanceDevices,
    stolenDevices,
    openTickets,
    stolenIncidents,
    pendingRequests,
    approvedRequests,
    totalFacilities: facilities.length,
    totalCounties: counties.length
  };
}

function createRequisition(body) {
  const requiredFields = ['sdpName', 'hrCount', 'deviceType', 'existingQty', 'requestedQty'];
  const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === '');

  if (missing.length > 0) {
    return {
      error: `Missing required field(s): ${missing.join(', ')}`
    };
  }

  const created = {
    id: `REQ-${new Date().getUTCFullYear()}-${String(requisitions.length + 1).padStart(3, '0')}`,
    sdpName: String(body.sdpName),
    hrCount: Number(body.hrCount),
    deviceType: String(body.deviceType),
    existingQty: Number(body.existingQty),
    requestedQty: Number(body.requestedQty),
    status: body.status === 'Draft' ? 'Draft' : 'Pending Sub-County',
    facilityId: body.facilityId || null,
    timestamp: new Date().toISOString()
  };

  requisitions.unshift(created);

  return { created };
}

function createInventoryItem(body) {
  if (!body.deviceType) {
    return {
      error: 'deviceType is required.'
    };
  }

  const created = {
    id: body.id || `INV-${String(inventory.length + 1).padStart(3, '0')}`,
    deviceType: String(body.deviceType),
    imei: body.imei || null,
    serial: body.serial || null,
    status: body.status || 'Device Accepted',
    dateReceived: body.dateReceived || new Date().toISOString().slice(0, 10),
    facilityId: body.facilityId ? String(body.facilityId) : null
  };

  inventory.unshift(created);

  return { created };
}

function validateInventoryItem(body, rowNumber = null) {
  const prefix = rowNumber ? `Row ${rowNumber}: ` : '';

  if (!body.id) {
    return `${prefix}id is required.`;
  }

  if (!body.deviceType) {
    return `${prefix}deviceType is required.`;
  }

  if (!deviceTypes.includes(body.deviceType)) {
    return `${prefix}deviceType must be one of ${deviceTypes.join(', ')}.`;
  }

  if (!body.imei && !body.serial) {
    return `${prefix}imei or serial is required.`;
  }

  if (inventory.some((item) => item.id === body.id)) {
    return `${prefix}duplicate inventory id ${body.id}.`;
  }

  if (body.imei && inventory.some((item) => item.imei === body.imei)) {
    return `${prefix}duplicate IMEI ${body.imei}.`;
  }

  if (body.serial && inventory.some((item) => item.serial === body.serial)) {
    return `${prefix}duplicate serial ${body.serial}.`;
  }

  return null;
}

function bulkCreateInventory(body) {
  if (!Array.isArray(body.items)) {
    return {
      error: 'items must be an array.'
    };
  }

  const errors = [];
  const validItems = [];
  const seenIds = new Set();
  const seenImeis = new Set();
  const seenSerials = new Set();

  body.items.forEach((item, index) => {
    const rowNumber = item.rowNumber || index + 2;
    const duplicateInFile =
      seenIds.has(item.id) ||
      (item.imei && seenImeis.has(item.imei)) ||
      (item.serial && seenSerials.has(item.serial));
    const error = duplicateInFile
      ? `Row ${rowNumber}: duplicate id, IMEI, or serial inside uploaded CSV.`
      : validateInventoryItem(item, rowNumber);

    if (error) {
      errors.push({ row: rowNumber, message: error.replace(`Row ${rowNumber}: `, '') });
      return;
    }

    seenIds.add(item.id);

    if (item.imei) {
      seenImeis.add(item.imei);
    }

    if (item.serial) {
      seenSerials.add(item.serial);
    }

    validItems.push(item);
  });

  const saved = validItems.map((item) => {
    const result = createInventoryItem(item);
    return result.created;
  });

  return {
    saved,
    errors
  };
}

function createMaintenanceTicket(body) {
  if (!body.deviceType || !body.identifier || !body.issue) {
    return {
      error: 'deviceType, identifier, and issue are required.'
    };
  }

  const created = {
    id: `TKT-${String(maintenanceTickets.length + 1).padStart(3, '0')}`,
    deviceType: body.deviceType,
    identifier: body.identifier,
    issue: body.issue,
    status: body.status || 'Awaiting Support',
    date: body.date || new Date().toISOString().slice(0, 10),
    facilityId: body.facilityId || null
  };

  maintenanceTickets.unshift(created);
  return { created };
}

function createStolenReport(body) {
  if (!body.deviceType || !body.identifier || !body.obNumber) {
    return {
      error: 'deviceType, identifier, and obNumber are required.'
    };
  }

  const created = {
    id: `INC-${String(stolenReports.length + 1).padStart(3, '0')}`,
    deviceType: body.deviceType,
    identifier: body.identifier,
    obNumber: body.obNumber,
    status: body.status || 'Stolen',
    date: body.date || new Date().toISOString().slice(0, 10),
    mdmLocked: body.mdmLocked !== false,
    facilityId: body.facilityId || null
  };

  stolenReports.unshift(created);
  return { created };
}

function createHandover(body) {
  const requiredFields = ['formType', 'fileName'];
  const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === '');

  if (missing.length > 0) {
    return {
      error: `Missing required field(s): ${missing.join(', ')}`
    };
  }

  if (!['S11', 'S13'].includes(body.formType)) {
    return {
      error: 'formType must be S11 or S13.'
    };
  }

  const created = {
    id: `HND-${String(handovers.length + 1).padStart(3, '0')}`,
    consignmentId: body.consignmentId || null,
    formType: body.formType,
    fileName: body.fileName,
    fileType: body.fileType || null,
    fileSize: body.fileSize || null,
    fileContent: body.fileContent || null,
    facilityId: body.facilityId || null,
    confirmed: Boolean(body.confirmed),
    status: 'Accepted',
    uploadedAt: new Date().toISOString()
  };

  handovers.unshift(created);

  return { created };
}

function parseApiUrl(request) {
  const url = new URL(request.url || '/', `http://${request.headers.host || `127.0.0.1:${port}`}`);
  const pathname = url.pathname.startsWith(`${basePath}/api`)
    ? url.pathname.replace(basePath, '')
    : url.pathname;

  if (!pathname.startsWith('/api')) {
    return null;
  }

  return {
    pathname: pathname.replace(/^\/api/, '') || '/',
    searchParams: url.searchParams
  };
}

async function handleLegacyApiRequest(request, response) {
  if (request.method === 'OPTIONS') {
    return sendJson(response, 204, {});
  }

  const apiUrl = parseApiUrl(request);

  if (!apiUrl) {
    return false;
  }

  const { pathname, searchParams } = apiUrl;

  try {
    if (request.method === 'GET' && pathname === '/health') {
      return sendJson(response, 200, {
        status: 'ok',
        service: 'DHA Device Hub API',
        timestamp: new Date().toISOString()
      });
    }

    if (request.method === 'POST' && pathname === '/auth/login') {
      const body = await readBody(request);
      const identifier = String(body.username || body.email || '').trim().toLowerCase();
      const user = users.find(
        (candidate) =>
          [candidate.username, candidate.email]
            .filter(Boolean)
            .some((value) => value.toLowerCase() === identifier) &&
          candidate.password === body.password
      );

      if (!user) {
        return sendJson(response, 401, {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Email or password is incorrect.'
          }
        });
      }

      const token = randomUUID();
      sessions.set(token, user.id);

      return sendJson(response, 200, {
        token,
        user: enrichUser(user)
      });
    }

    const actor = getRequestUser(request);

    if (request.method === 'GET' && pathname === '/roles') {
      if (!requireUser(response, actor)) return;
      return sendJson(response, 200, { data: getVisibleRoles(actor) });
    }

    if (request.method === 'POST' && pathname === '/roles') {
      if (!requireRoute(response, actor, ['/roles'])) return;
      const result = createRole(await readBody(request));

      if (result.error) {
        return badRequest(response, result.error);
      }

      return sendJson(response, 201, { data: result.created });
    }

    if (request.method === 'GET' && pathname === '/modules') {
      if (!requireRoute(response, actor, ['/roles'])) return;
      return sendJson(response, 200, { data: modules });
    }

    if (request.method === 'GET' && pathname === '/users') {
      if (!requireRoute(response, actor, ['/users'])) return;
      return sendJson(response, 200, { data: getVisibleUsers(actor).map(enrichUser) });
    }

    if (request.method === 'POST' && pathname === '/users') {
      if (!requireRoute(response, actor, ['/users'])) return;
      const result = createUser(await readBody(request), actor);

      if (result.error) {
        return badRequest(response, result.error);
      }

      return sendJson(response, 201, { data: enrichUser(result.created) });
    }

    const userMatch = pathname.match(/^\/users\/([^/]+)$/);

    if (userMatch && request.method === 'PATCH') {
      if (!requireRoute(response, actor, ['/users'])) return;
      const user = users.find((candidate) => candidate.id === userMatch[1]);

      if (!user) {
        return notFound(response);
      }

      if (!canManageUser(actor, user)) {
        return forbidden(response);
      }

      const body = await readBody(request);

      if (body.status && !['Active', 'Suspended', 'Disabled'].includes(body.status)) {
        return badRequest(response, 'Unsupported user status.');
      }

      Object.assign(user, body);
      return sendJson(response, 200, { data: enrichUser(user) });
    }

    if (request.method === 'GET' && pathname === '/counties') {
      if (!requireUser(response, actor)) return;
      return sendJson(response, 200, { data: counties });
    }

    if (request.method === 'GET' && pathname === '/facilities') {
      if (!requireUser(response, actor)) return;
      const county = searchParams.get('county');
      const data = county
        ? facilities.filter((facility) => facility.county.toLowerCase() === county.toLowerCase())
        : facilities;

      return sendJson(response, 200, { data });
    }

    if (request.method === 'GET' && pathname === '/device-types') {
      if (!requireUser(response, actor)) return;
      return sendJson(response, 200, { data: deviceTypes });
    }

    if (request.method === 'GET' && pathname === '/dashboard/summary') {
      if (!requireRoute(response, actor, ['/dashboard'])) return;
      return sendJson(response, 200, { data: getDashboardSummary() });
    }

    if (request.method === 'GET' && pathname === '/inventory') {
      if (!requireRoute(response, actor, ['/inventory'])) return;
      const facilityId = searchParams.get('facilityId');
      const status = searchParams.get('status');
      let data = filterFacilityScopedRecords(actor, inventory);

      if (facilityId) {
        data = data.filter((item) => item.facilityId === facilityId);
      }

      if (status) {
        data = data.filter((item) => item.status.toLowerCase() === status.toLowerCase());
      }

      return sendJson(response, 200, { data });
    }

    if (request.method === 'POST' && pathname === '/inventory') {
      if (!requireRoute(response, actor, ['/inventory', '/migration'])) return;
      const body = await readBody(request);

      if (isFacilityScoped(actor)) {
        body.facilityId = actor.facilityId || null;
      }

      const result = createInventoryItem(body);

      if (result.error) {
        return badRequest(response, result.error);
      }

      return sendJson(response, 201, { data: result.created });
    }

    if (request.method === 'POST' && pathname === '/inventory/bulk') {
      if (!requireRoute(response, actor, ['/migration'])) return;
      const result = bulkCreateInventory(await readBody(request));

      if (result.error) {
        return badRequest(response, result.error);
      }

      return sendJson(response, 201, {
        data: {
          saved: result.saved,
          errors: result.errors,
          savedCount: result.saved.length,
          errorCount: result.errors.length
        }
      });
    }

    const inventoryMatch = pathname.match(/^\/inventory\/([^/]+)$/);

    if (inventoryMatch && request.method === 'PATCH') {
      if (!requireRoute(response, actor, ['/inventory'])) return;
      const item = inventory.find((candidate) => candidate.id === inventoryMatch[1]);

      if (!item) {
        return notFound(response);
      }

      Object.assign(item, await readBody(request));
      return sendJson(response, 200, { data: item });
    }

    if (request.method === 'GET' && pathname === '/requisitions') {
      if (!requireRoute(response, actor, ['/requisitions', '/requests'])) return;
      const status = searchParams.get('status');
      const facilityId = searchParams.get('facilityId');
      let data = filterFacilityScopedRecords(actor, requisitions);

      if (status) {
        data = data.filter((item) => item.status.toLowerCase() === status.toLowerCase());
      }

      if (facilityId) {
        data = data.filter((item) => item.facilityId === facilityId);
      }

      return sendJson(response, 200, { data });
    }

    if (request.method === 'POST' && pathname === '/requisitions') {
      if (!requireRoute(response, actor, ['/requisitions/create'])) return;
      const body = await readBody(request);

      if (isFacilityScoped(actor)) {
        body.facilityId = actor.facilityId || null;
      }

      const result = createRequisition(body);

      if (result.error) {
        return badRequest(response, result.error);
      }

      return sendJson(response, 201, { data: result.created });
    }

    if (request.method === 'GET' && pathname === '/handovers') {
      if (!requireRoute(response, actor, ['/handover'])) return;
      return sendJson(response, 200, { data: filterFacilityScopedRecords(actor, handovers) });
    }

    if (request.method === 'POST' && pathname === '/handovers') {
      if (!requireRoute(response, actor, ['/handover'])) return;
      const body = await readBody(request);

      if (isFacilityScoped(actor)) {
        body.facilityId = actor.facilityId || null;
      }

      const result = createHandover(body);

      if (result.error) {
        return badRequest(response, result.error);
      }

      return sendJson(response, 201, { data: result.created });
    }

    if (request.method === 'GET' && pathname === '/maintenance-tickets') {
      if (!requireRoute(response, actor, ['/faulty', '/maintenance', '/tickets', '/incidents'])) return;
      return sendJson(response, 200, { data: filterFacilityScopedRecords(actor, maintenanceTickets) });
    }

    if (request.method === 'POST' && pathname === '/maintenance-tickets') {
      if (!requireRoute(response, actor, ['/faulty', '/maintenance', '/tickets'])) return;
      const body = await readBody(request);

      if (isFacilityScoped(actor)) {
        body.facilityId = actor.facilityId || null;
      }

      const result = createMaintenanceTicket(body);

      if (result.error) {
        return badRequest(response, result.error);
      }

      return sendJson(response, 201, { data: result.created });
    }

    if (request.method === 'GET' && pathname === '/stolen-reports') {
      if (!requireRoute(response, actor, ['/stolen', '/incidents', '/maintenance'])) return;
      return sendJson(response, 200, { data: filterFacilityScopedRecords(actor, stolenReports) });
    }

    if (request.method === 'POST' && pathname === '/stolen-reports') {
      if (!requireRoute(response, actor, ['/stolen', '/incidents'])) return;
      const body = await readBody(request);

      if (isFacilityScoped(actor)) {
        body.facilityId = actor.facilityId || null;
      }

      const result = createStolenReport(body);

      if (result.error) {
        return badRequest(response, result.error);
      }

      return sendJson(response, 201, { data: result.created });
    }

    const requisitionMatch = pathname.match(/^\/requisitions\/([^/]+)$/);

    if (requisitionMatch && request.method === 'GET') {
      if (!requireRoute(response, actor, ['/requisitions', '/requests'])) return;
      const requisition = requisitions.find((item) => item.id === requisitionMatch[1]);

      if (!requisition) {
        return notFound(response);
      }

      return sendJson(response, 200, { data: requisition });
    }

    if (requisitionMatch && request.method === 'PATCH') {
      if (!requireRoute(response, actor, ['/requests'])) return;
      const requisition = requisitions.find((item) => item.id === requisitionMatch[1]);

      if (!requisition) {
        return notFound(response);
      }

      Object.assign(requisition, await readBody(request));
      return sendJson(response, 200, { data: requisition });
    }

    return notFound(response);
  } catch (error) {
    return sendJson(response, 500, {
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Unexpected API error.'
      }
    });
  }
}

function resolveFilePath(urlPath) {
  const rawPath = decodeURIComponent(urlPath.split('?')[0] || '/');
  const decodedPath = rawPath.startsWith(basePath)
    ? rawPath.slice(basePath.length) || '/'
    : rawPath;
  const requestedPath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(rootDir, requestedPath);

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }

  return indexFile;
}

function createProductionServer() {
  return createServer(async (request, response) => {
    if (parseApiUrl(request)) {
      await handleCurrentApiRequest(request, response);
      return;
    }

    if (!existsSync(indexFile)) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Application build output was not found.');
      return;
    }

    const filePath = resolveFilePath(request.url || '/');
    const contentType = contentTypes[extname(filePath)] || 'application/octet-stream';

    response.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': filePath === indexFile
        ? 'no-cache'
        : 'public, max-age=31536000, immutable'
    });

    createReadStream(filePath).pipe(response);
  });
}

export const handleApiRequest = handleCurrentApiRequest;

function unauthorized(response) {
  return sendJson(response, 401, {
    error: {
      code: 'UNAUTHORIZED',
      message: 'Sign in is required.'
    }
  });
}

function forbidden(response) {
  return sendJson(response, 403, {
    error: {
      code: 'FORBIDDEN',
      message: 'Your profile is not allowed to perform this action.'
    }
  });
}

const isDirectRun = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isDirectRun) {
  createProductionServer().listen(port, '0.0.0.0', () => {
    console.log(`DHA Device Hub is listening on port ${port}`);
  });
}
