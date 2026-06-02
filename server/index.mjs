import http from 'node:http';
import { randomUUID } from 'node:crypto';
import {
  counties,
  deviceTypes,
  facilities,
  inventory,
  modules,
  requisitions,
  roles,
  users
} from './data.mjs';

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || '127.0.0.1';

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(payload));
};

const notFound = (res) =>
  sendJson(res, 404, {
    error: {
      code: 'NOT_FOUND',
      message: 'The requested API route does not exist.'
    }
  });

const badRequest = (res, message) =>
  sendJson(res, 400, {
    error: {
      code: 'BAD_REQUEST',
      message
    }
  });

const readBody = async (req) => {
  let raw = '';

  for await (const chunk of req) {
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
};

const stripPassword = ({ password, ...user }) => user;

const enrichUser = (user) => ({
  ...stripPassword(user),
  role: roles.find((role) => role.id === user.roleId) || null,
  facility: facilities.find((facility) => facility.id === user.facilityId) || null
});

const slugify = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getAllowedOnboardingRoleIds = () => {
  const customRoleIds = roles.filter((role) => role.isCustom).map((role) => role.id);
  const mappedRoleIds = roles.flatMap((role) => role.canOnboardRoleIds || []);

  return [...new Set([...mappedRoleIds, ...customRoleIds])];
};

const createRole = (body) => {
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

  const selectedRoutes = body.modulePaths.map((path) => modules.find((module) => module.path === path));

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
};

const createUser = (body) => {
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

  if (!getAllowedOnboardingRoleIds().includes(body.roleId)) {
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
};

const getDashboardSummary = () => {
  const totalDevices = inventory.length;
  const activeDevices = inventory.filter((item) => item.status === 'Device Accepted').length;
  const maintenanceDevices = inventory.filter((item) => item.status === 'Awaiting Support').length;
  const stolenDevices = inventory.filter((item) => item.status === 'Stolen').length;
  const pendingRequests = requisitions.filter((item) => item.status.startsWith('Pending')).length;
  const approvedRequests = requisitions.filter((item) => item.status === 'Approved').length;

  return {
    totalDevices,
    activeDevices,
    maintenanceDevices,
    stolenDevices,
    pendingRequests,
    approvedRequests,
    totalFacilities: facilities.length,
    totalCounties: counties.length
  };
};

const parseApiUrl = (req) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || `${HOST}:${PORT}`}`);

  if (!url.pathname.startsWith('/api')) {
    return null;
  }

  return {
    pathname: url.pathname.replace(/^\/api/, '') || '/',
    searchParams: url.searchParams
  };
};

const createRequisition = (body) => {
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
    status: 'Pending Sub-County',
    facilityId: body.facilityId || 'HF-10293',
    timestamp: new Date().toISOString()
  };

  requisitions.unshift(created);
  return { created };
};

const createInventoryItem = (body) => {
  if (!body.deviceType || !body.facilityId) {
    return {
      error: 'deviceType and facilityId are required.'
    };
  }

  const created = {
    id: `INV-${String(inventory.length + 1).padStart(3, '0')}`,
    deviceType: String(body.deviceType),
    imei: body.imei || null,
    serial: body.serial || null,
    status: body.status || 'Device Accepted',
    dateReceived: body.dateReceived || new Date().toISOString().slice(0, 10),
    facilityId: String(body.facilityId)
  };

  inventory.unshift(created);
  return { created };
};

const handleRequest = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  const apiUrl = parseApiUrl(req);

  if (!apiUrl) {
    return notFound(res);
  }

  const { pathname, searchParams } = apiUrl;

  try {
    if (req.method === 'GET' && pathname === '/health') {
      return sendJson(res, 200, {
        status: 'ok',
        service: 'DIMS API',
        timestamp: new Date().toISOString()
      });
    }

    if (req.method === 'POST' && pathname === '/auth/login') {
      const body = await readBody(req);
      const identifier = String(body.username || body.email || '').trim().toLowerCase();
      const user = users.find(
        (candidate) =>
          [candidate.username, candidate.email]
            .filter(Boolean)
            .some((value) => value.toLowerCase() === identifier) &&
          candidate.password === body.password
      );

      if (!user) {
        return sendJson(res, 401, {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Email or password is incorrect.'
          }
        });
      }

      return sendJson(res, 200, {
        token: randomUUID(),
        user: enrichUser(user)
      });
    }

    if (req.method === 'GET' && pathname === '/roles') {
      return sendJson(res, 200, { data: roles });
    }

    if (req.method === 'POST' && pathname === '/roles') {
      const result = createRole(await readBody(req));

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: result.created });
    }

    if (req.method === 'GET' && pathname === '/modules') {
      return sendJson(res, 200, { data: modules });
    }

    if (req.method === 'GET' && pathname === '/users') {
      return sendJson(res, 200, { data: users.map(enrichUser) });
    }

    if (req.method === 'POST' && pathname === '/users') {
      const result = createUser(await readBody(req));

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: enrichUser(result.created) });
    }

    const userMatch = pathname.match(/^\/users\/([^/]+)$/);

    if (userMatch && req.method === 'PATCH') {
      const user = users.find((candidate) => candidate.id === userMatch[1]);

      if (!user) {
        return notFound(res);
      }

      const body = await readBody(req);

      if (body.status && !['Active', 'Suspended', 'Disabled'].includes(body.status)) {
        return badRequest(res, 'Unsupported user status.');
      }

      Object.assign(user, body);
      return sendJson(res, 200, { data: enrichUser(user) });
    }

    if (req.method === 'GET' && pathname === '/counties') {
      return sendJson(res, 200, { data: counties });
    }

    if (req.method === 'GET' && pathname === '/facilities') {
      const county = searchParams.get('county');
      const data = county
        ? facilities.filter((facility) => facility.county.toLowerCase() === county.toLowerCase())
        : facilities;

      return sendJson(res, 200, { data });
    }

    if (req.method === 'GET' && pathname === '/device-types') {
      return sendJson(res, 200, { data: deviceTypes });
    }

    if (req.method === 'GET' && pathname === '/dashboard/summary') {
      return sendJson(res, 200, { data: getDashboardSummary() });
    }

    if (req.method === 'GET' && pathname === '/inventory') {
      const facilityId = searchParams.get('facilityId');
      const status = searchParams.get('status');
      let data = inventory;

      if (facilityId) {
        data = data.filter((item) => item.facilityId === facilityId);
      }

      if (status) {
        data = data.filter((item) => item.status.toLowerCase() === status.toLowerCase());
      }

      return sendJson(res, 200, { data });
    }

    if (req.method === 'POST' && pathname === '/inventory') {
      const result = createInventoryItem(await readBody(req));

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: result.created });
    }

    const inventoryMatch = pathname.match(/^\/inventory\/([^/]+)$/);

    if (inventoryMatch && req.method === 'PATCH') {
      const item = inventory.find((candidate) => candidate.id === inventoryMatch[1]);

      if (!item) {
        return notFound(res);
      }

      Object.assign(item, await readBody(req));
      return sendJson(res, 200, { data: item });
    }

    if (req.method === 'GET' && pathname === '/requisitions') {
      const status = searchParams.get('status');
      const facilityId = searchParams.get('facilityId');
      let data = requisitions;

      if (status) {
        data = data.filter((item) => item.status.toLowerCase() === status.toLowerCase());
      }

      if (facilityId) {
        data = data.filter((item) => item.facilityId === facilityId);
      }

      return sendJson(res, 200, { data });
    }

    if (req.method === 'POST' && pathname === '/requisitions') {
      const result = createRequisition(await readBody(req));

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: result.created });
    }

    const requisitionMatch = pathname.match(/^\/requisitions\/([^/]+)$/);

    if (requisitionMatch && req.method === 'GET') {
      const requisition = requisitions.find((item) => item.id === requisitionMatch[1]);

      if (!requisition) {
        return notFound(res);
      }

      return sendJson(res, 200, { data: requisition });
    }

    if (requisitionMatch && req.method === 'PATCH') {
      const requisition = requisitions.find((item) => item.id === requisitionMatch[1]);

      if (!requisition) {
        return notFound(res);
      }

      Object.assign(requisition, await readBody(req));
      return sendJson(res, 200, { data: requisition });
    }

    return notFound(res);
  } catch (error) {
    return sendJson(res, 500, {
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Unexpected API error.'
      }
    });
  }
};

http.createServer(handleRequest).listen(PORT, HOST, () => {
  console.log(`DIMS API listening at http://${HOST}:${PORT}/api`);
});
