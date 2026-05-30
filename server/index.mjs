import http from 'node:http';
import { randomUUID } from 'node:crypto';
import {
  counties,
  deviceTypes,
  facilities,
  inventory,
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
