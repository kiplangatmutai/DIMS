import http from 'node:http';
import { randomUUID } from 'node:crypto';
import {
  counties,
  deviceTypes,
  facilities,
  handovers,
  inventory,
  maintenanceTickets,
  modules,
  notifications,
  requisitions,
  roles,
  stolenReports,
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
  facility: facilities.find((facility) => facility.id === user.facilityId) || null,
  county: user.county || null
});

const slugify = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const createId = (prefix, collection) =>
  `${prefix}-${String(collection.length + 1).padStart(3, '0')}`;

const getAllowedOnboardingRoleIds = () => {
  const customRoleIds = roles.filter((role) => role.isCustom).map((role) => role.id);
  const mappedRoleIds = roles.flatMap((role) => role.canOnboardRoleIds || []);

  return [...new Set([...mappedRoleIds, ...customRoleIds])];
};

const filterByFacility = (items, facilityId) =>
  facilityId ? items.filter((item) => item.facilityId === facilityId) : items;

const isPendingRequest = (status) =>
  ['Draft', 'Cancelled', 'Rejected', 'Fulfilled'].includes(status) === false;

const isOpenTicket = (status) => !['Closed', 'Resolved'].includes(status);

const getDashboardSummary = (facilityId = null) => {
  const scopedInventory = filterByFacility(inventory, facilityId);
  const scopedRequests = filterByFacility(requisitions, facilityId);
  const scopedTickets = filterByFacility(maintenanceTickets, facilityId);
  const scopedStolenReports = filterByFacility(stolenReports, facilityId);

  return {
    totalDevices: scopedInventory.length,
    activeDevices: scopedInventory.filter((item) => item.status === 'Device Accepted').length,
    pendingRequests: scopedRequests.filter((item) => isPendingRequest(item.status)).length,
    approvedRequests: scopedRequests.filter((item) => item.status === 'Approved').length,
    openTickets: scopedTickets.filter((item) => isOpenTicket(item.status)).length,
    stolenIncidents: scopedStolenReports.filter((item) => item.status === 'Stolen').length,
    maintenanceDevices: scopedInventory.filter((item) => item.status === 'Awaiting Support').length,
    stolenDevices: scopedInventory.filter((item) => item.status === 'Stolen').length,
    totalFacilities: facilityId ? 1 : facilities.length,
    totalCounties: facilityId
      ? Number(Boolean(facilities.find((facility) => facility.id === facilityId)?.county))
      : counties.length
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

const createRole = (body) => {
  const requiredFields = ['name', 'tier', 'modulePaths'];
  const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === '');

  if (missing.length > 0) {
    return { error: `Missing required field(s): ${missing.join(', ')}` };
  }

  const validTiers = ['Facility', 'Sub-County', 'County', 'DHA', 'Vendor', 'Admin'];

  if (!validTiers.includes(body.tier)) {
    return { error: 'Selected tier is not supported.' };
  }

  if (!Array.isArray(body.modulePaths) || body.modulePaths.length === 0) {
    return { error: 'Select at least one module for this profile.' };
  }

  const selectedRoutes = body.modulePaths.map((path) => modules.find((module) => module.path === path));

  if (selectedRoutes.some((route) => !route)) {
    return { error: 'One or more selected modules do not exist.' };
  }

  const id = slugify(body.id || body.name);

  if (!id) {
    return { error: 'Profile name must contain letters or numbers.' };
  }

  if (roles.some((role) => role.id === id)) {
    return { error: 'A profile with this name already exists.' };
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
  const requiredFields = ['name', 'username', 'email', 'mobileNo', 'password', 'roleId'];
  const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === '');

  if (missing.length > 0) {
    return { error: `Missing required field(s): ${missing.join(', ')}` };
  }

  if (users.some((user) => user.username.toLowerCase() === String(body.username).toLowerCase())) {
    return { error: 'Username is already in use.' };
  }

  if (users.some((user) => user.email.toLowerCase() === String(body.email).toLowerCase())) {
    return { error: 'Email is already in use.' };
  }

  const selectedRole = roles.find((role) => role.id === body.roleId);

  if (!selectedRole) {
    return { error: 'Selected role does not exist.' };
  }

  if (!getAllowedOnboardingRoleIds().includes(body.roleId)) {
    return { error: 'Users cannot be onboarded into this profile.' };
  }

  if (body.facilityId && !facilities.some((facility) => facility.id === body.facilityId)) {
    return { error: 'Selected facility does not exist.' };
  }

  if (body.county && !counties.includes(body.county)) {
    return { error: 'Selected county does not exist.' };
  }

  const requiresCounty = ['County', 'Sub-County', 'Facility'].includes(selectedRole.tier);

  if (requiresCounty && !body.county) {
    return { error: 'County is required for County, Sub-County, and Facility profiles.' };
  }

  const created = {
    id: createId('USR', users),
    name: String(body.name),
    username: String(body.username),
    email: String(body.email),
    mobileNo: String(body.mobileNo),
    password: String(body.password),
    roleId: String(body.roleId),
    facilityId: body.facilityId || null,
    county: body.county || null,
    status: 'Active'
  };

  users.push(created);
  return { created };
};

const createRequisition = (body) => {
  const requiredFields = ['sdpName', 'hrCount', 'deviceType', 'existingQty', 'requestedQty'];
  const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === '');

  if (missing.length > 0) {
    return { error: `Missing required field(s): ${missing.join(', ')}` };
  }

  if (!deviceTypes.includes(body.deviceType)) {
    return { error: `deviceType must be one of ${deviceTypes.join(', ')}.` };
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
  notifications.unshift({
    id: createId('NOT', notifications),
    title: created.status === 'Draft' ? 'Requisition draft saved' : 'Requisition submitted',
    message: `${created.id} for ${created.requestedQty} ${created.deviceType} device(s) was ${created.status === 'Draft' ? 'saved as draft' : 'submitted for Sub-County review'}.`,
    isRead: false,
    createdAt: new Date().toISOString(),
    facilityId: created.facilityId
  });

  return { created };
};

const createInventoryItem = (body) => {
  if (!body.deviceType) {
    return { error: 'deviceType is required.' };
  }

  if (!deviceTypes.includes(body.deviceType)) {
    return { error: `deviceType must be one of ${deviceTypes.join(', ')}.` };
  }

  if (body.facilityId && !facilities.some((facility) => facility.id === body.facilityId)) {
    return { error: 'Selected facility does not exist.' };
  }

  const created = {
    id: body.id || createId('INV', inventory),
    deviceType: String(body.deviceType),
    imei: body.imei || null,
    serial: body.serial || null,
    status: body.status || 'Device Accepted',
    dateReceived: body.dateReceived || new Date().toISOString().slice(0, 10),
    facilityId: body.facilityId ? String(body.facilityId) : null
  };

  inventory.unshift(created);
  return { created };
};

const validateInventoryItem = (body, rowNumber = null) => {
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
};

const bulkCreateInventory = (body) => {
  if (!Array.isArray(body.items)) {
    return { error: 'items must be an array.' };
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

  const saved = validItems.map((item) => createInventoryItem(item).created);
  return { saved, errors };
};

const findInventoryByIdentifier = (identifier) =>
  inventory.find((item) => [item.id, item.imei, item.serial].filter(Boolean).includes(identifier));

const createMaintenanceTicket = (body) => {
  if (!body.deviceType || !body.identifier || !body.issue) {
    return { error: 'deviceType, identifier, and issue are required.' };
  }

  const matchedInventory = findInventoryByIdentifier(body.identifier);
  const facilityId = body.facilityId || matchedInventory?.facilityId || null;
  const created = {
    id: createId('TKT', maintenanceTickets),
    deviceType: body.deviceType,
    identifier: body.identifier,
    issue: body.issue,
    status: body.status || 'Awaiting Support',
    date: body.date || new Date().toISOString().slice(0, 10),
    facilityId
  };

  if (matchedInventory) {
    matchedInventory.status = 'Awaiting Support';
  }

  maintenanceTickets.unshift(created);
  notifications.unshift({
    id: createId('NOT', notifications),
    title: 'Maintenance ticket opened',
    message: `${created.id} was opened for ${created.deviceType} ${created.identifier}.`,
    isRead: false,
    createdAt: new Date().toISOString(),
    facilityId
  });

  return { created };
};

const createStolenReport = (body) => {
  if (!body.deviceType || !body.identifier || !body.obNumber) {
    return { error: 'deviceType, identifier, and obNumber are required.' };
  }

  const matchedInventory = findInventoryByIdentifier(body.identifier);
  const facilityId = body.facilityId || matchedInventory?.facilityId || null;
  const created = {
    id: createId('INC', stolenReports),
    deviceType: body.deviceType,
    identifier: body.identifier,
    obNumber: body.obNumber,
    status: body.status || 'Stolen',
    date: body.date || new Date().toISOString().slice(0, 10),
    mdmLocked: body.mdmLocked !== false,
    facilityId
  };

  if (matchedInventory) {
    matchedInventory.status = 'Stolen';
  }

  stolenReports.unshift(created);
  notifications.unshift({
    id: createId('NOT', notifications),
    title: 'Stolen device reported',
    message: `${created.deviceType} ${created.identifier} was reported stolen under ${created.obNumber}.`,
    isRead: false,
    createdAt: new Date().toISOString(),
    facilityId
  });

  return { created };
};

const getHandoverStatus = (handover) => {
  if (!handover.fileName) {
    return 'Pending Upload';
  }

  if (!handover.physicalReceiptConfirmed && !handover.confirmed) {
    return 'Awaiting Physical Receipt';
  }

  return 'Accepted';
};

const createHandover = (body) => {
  if (!body.formType || !['S11', 'S13'].includes(body.formType)) {
    return { error: 'formType must be S11 or S13.' };
  }

  if (!body.consignmentId) {
    return { error: 'consignmentId is required.' };
  }

  const created = {
    id: createId('HND', handovers),
    consignmentId: body.consignmentId,
    formType: body.formType,
    fileName: body.fileName || null,
    fileType: body.fileType || null,
    fileSize: body.fileSize || null,
    fileContent: body.fileContent || null,
    confirmed: Boolean(body.confirmed),
    physicalReceiptConfirmed: Boolean(body.physicalReceiptConfirmed ?? body.confirmed),
    status: 'Pending Upload',
    uploadedAt: body.fileName ? new Date().toISOString() : null,
    facilityId: body.facilityId || null
  };

  created.status = getHandoverStatus(created);
  handovers.unshift(created);
  notifications.unshift({
    id: createId('NOT', notifications),
    title: 'Handover acceptance updated',
    message: `${created.formType} for ${created.consignmentId} is now ${created.status}.`,
    isRead: false,
    createdAt: new Date().toISOString(),
    facilityId: created.facilityId
  });

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

      if (body.roleId && !roles.some((role) => role.id === body.roleId)) {
        return badRequest(res, 'Selected role does not exist.');
      }

      if (body.county && !counties.includes(body.county)) {
        return badRequest(res, 'Selected county does not exist.');
      }

      if (body.mobileNo !== undefined && String(body.mobileNo).trim() === '') {
        return badRequest(res, 'Mobile number is required.');
      }

      const nextRole = roles.find((role) => role.id === (body.roleId || user.roleId));
      const requiresCounty = nextRole && ['County', 'Sub-County', 'Facility'].includes(nextRole.tier);
      const nextCounty = body.county !== undefined ? body.county : user.county;

      if (requiresCounty && !nextCounty) {
        return badRequest(res, 'County is required for County, Sub-County, and Facility profiles.');
      }

      Object.assign(user, body, {
        mobileNo: body.mobileNo !== undefined ? String(body.mobileNo) : user.mobileNo,
        county: body.county !== undefined ? body.county || null : user.county || null
      });
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
      return sendJson(res, 200, { data: getDashboardSummary(searchParams.get('facilityId')) });
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

    if (req.method === 'POST' && pathname === '/inventory/bulk') {
      const result = bulkCreateInventory(await readBody(req));

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, {
        data: {
          saved: result.saved,
          errors: result.errors,
          savedCount: result.saved.length,
          errorCount: result.errors.length
        }
      });
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

    if (req.method === 'GET' && pathname === '/maintenance-tickets') {
      return sendJson(res, 200, {
        data: filterByFacility(maintenanceTickets, searchParams.get('facilityId'))
      });
    }

    if (req.method === 'POST' && pathname === '/maintenance-tickets') {
      const result = createMaintenanceTicket(await readBody(req));

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: result.created });
    }

    if (req.method === 'GET' && pathname === '/stolen-reports') {
      return sendJson(res, 200, {
        data: filterByFacility(stolenReports, searchParams.get('facilityId'))
      });
    }

    if (req.method === 'POST' && pathname === '/stolen-reports') {
      const result = createStolenReport(await readBody(req));

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: result.created });
    }

    if (req.method === 'GET' && pathname === '/handovers') {
      return sendJson(res, 200, {
        data: filterByFacility(handovers, searchParams.get('facilityId'))
      });
    }

    if (req.method === 'POST' && pathname === '/handovers') {
      const result = createHandover(await readBody(req));

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: result.created });
    }

    const handoverMatch = pathname.match(/^\/handovers\/([^/]+)$/);

    if (handoverMatch && req.method === 'PATCH') {
      const handover = handovers.find((candidate) => candidate.id === handoverMatch[1]);

      if (!handover) {
        return notFound(res);
      }

      Object.assign(handover, await readBody(req));
      handover.status = getHandoverStatus(handover);
      return sendJson(res, 200, { data: handover });
    }

    if (req.method === 'GET' && pathname === '/notifications') {
      return sendJson(res, 200, {
        data: filterByFacility(notifications, searchParams.get('facilityId'))
      });
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
