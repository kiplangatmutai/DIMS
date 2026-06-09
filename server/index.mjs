import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
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
const sessions = new Map();

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

const unauthorized = (res) =>
  sendJson(res, 401, {
    error: {
      code: 'UNAUTHORIZED',
      message: 'Sign in is required.'
    }
  });

const forbidden = (res) =>
  sendJson(res, 403, {
    error: {
      code: 'FORBIDDEN',
      message: 'Your profile is not allowed to perform this action.'
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
  county: user.county || null,
  subCounty: user.subCounty || null
});

const getBearerToken = (req) => {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');

  return scheme?.toLowerCase() === 'bearer' ? token : null;
};

const getCurrentUser = (req) => {
  const token = getBearerToken(req);
  const userId = token ? sessions.get(token) : null;

  return userId ? users.find((user) => user.id === userId) || null : null;
};

const getUserRole = (user) => roles.find((candidate) => candidate.id === user?.roleId) || null;

const getUserFacilityScopeId = (user) =>
  user?.facilityId || (getUserRole(user)?.tier === 'Facility' ? user?.id : null);

const isFacilityScopedUser = (user) => getUserRole(user)?.tier === 'Facility';

const isSubCountyScopedUser = (user) => getUserRole(user)?.tier === 'Sub-County';

const isCountyScopedUser = (user) => getUserRole(user)?.tier === 'County';

const isRecordInApprovalScope = (user, record) => {
  if (isSubCountyScopedUser(user)) {
    return Boolean(
      user?.county &&
      user?.subCounty &&
      record?.county === user.county &&
      record?.subCounty === user.subCounty
    );
  }

  if (isCountyScopedUser(user)) {
    return Boolean(user?.county && record?.county === user.county);
  }

  return true;
};

const filterRecordsForUser = (user, records) => {
  if (isFacilityScopedUser(user)) {
    const facilityId = getUserFacilityScopeId(user);
    return facilityId ? records.filter((record) => record.facilityId === facilityId) : [];
  }

  return records.filter((record) => isRecordInApprovalScope(user, record));
};

const canAccessRecord = (user, record) =>
  Boolean(record) &&
  (!isFacilityScopedUser(user) || record.facilityId === getUserFacilityScopeId(user)) &&
  isRecordInApprovalScope(user, record);

const hasRouteAccess = (user, routePaths) => {
  if (user?.roleId === 'super-admin') {
    return true;
  }

  const role = roles.find((candidate) => candidate.id === user?.roleId);
  const allowedPaths = role?.routes?.map((route) => route.path) || [];

  return routePaths.some((path) => allowedPaths.includes(path));
};

const requireUser = (res, user) => {
  if (!user || user.status !== 'Active') {
    unauthorized(res);
    return false;
  }

  return true;
};

const requireRoute = (res, user, routePaths) => {
  if (!requireUser(res, user)) {
    return false;
  }

  if (!hasRouteAccess(user, routePaths)) {
    forbidden(res);
    return false;
  }

  return true;
};

const canManageUser = (actor, targetUser) =>
  actor?.roleId === 'super-admin' || targetUser?.createdByUserId === actor?.id;

const canAssignRole = (actor, roleId) =>
  actor?.roleId === 'super-admin' ||
  Boolean(getUserRole(actor)?.canOnboardRoleIds?.includes(roleId));

const visibleUsersFor = (currentUser) => {
  if (!currentUser) {
    return [];
  }

  if (currentUser.roleId === 'super-admin') {
    return users;
  }

  return users.filter((user) => user.createdByUserId === currentUser.id);
};

const visibleRolesFor = (currentUser) => {
  if (currentUser?.roleId === 'super-admin') {
    return roles;
  }

  const currentRole = getUserRole(currentUser);
  const visibleIds = new Set([
    currentUser?.roleId,
    ...(currentRole?.canOnboardRoleIds || [])
  ]);

  return roles.filter((role) => visibleIds.has(role.id));
};

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
  const pathname = url.pathname.startsWith('/dha-device-hub/api')
    ? url.pathname.replace('/dha-device-hub', '')
    : url.pathname;

  if (!pathname.startsWith('/api')) {
    return null;
  }

  return {
    pathname: pathname.replace(/^\/api/, '') || '/',
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

const createUser = (body, currentUser = null) => {
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

  if (currentUser && !canAssignRole(currentUser, body.roleId)) {
    return { error: 'You cannot onboard users into the selected profile.' };
  }

  if (!getAllowedOnboardingRoleIds().includes(body.roleId)) {
    return { error: 'Users cannot be onboarded into this profile.' };
  }

  if (
    body.facilityId &&
    facilities.length > 0 &&
    !facilities.some((facility) => facility.id === body.facilityId)
  ) {
    return { error: 'Selected facility does not exist.' };
  }

  if (body.county && !counties.includes(body.county)) {
    return { error: 'Selected county does not exist.' };
  }

  const requiresCounty = ['County', 'Sub-County', 'Facility'].includes(selectedRole.tier);
  const requiresSubCounty = ['Sub-County', 'Facility'].includes(selectedRole.tier);

  if (requiresCounty && !body.county) {
    return { error: 'County is required for County, Sub-County, and Facility profiles.' };
  }

  if (requiresSubCounty && !String(body.subCounty || '').trim()) {
    return { error: 'Sub-county is required for Sub-County and Facility profiles.' };
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
    subCounty: String(body.subCounty || '').trim() || null,
    createdByUserId: currentUser?.id || null,
    status: 'Active'
  };

  users.push(created);
  return { created };
};

const createRequisition = (body, currentUser = null) => {
  const isDraft = body.status === 'Draft';
  const requiredFields = isDraft ? [] : ['sdpName', 'hrCount', 'deviceType', 'existingQty', 'requestedQty'];
  const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === '');

  if (missing.length > 0) {
    return { error: `Missing required field(s): ${missing.join(', ')}` };
  }

  if (!isDraft && !deviceTypes.includes(body.deviceType)) {
    return { error: `deviceType must be one of ${deviceTypes.join(', ')}.` };
  }

  const county = body.county || currentUser?.county || null;
  const subCounty = body.subCounty || currentUser?.subCounty || null;

  if (!isDraft && (!county || !subCounty)) {
    return { error: 'The facility user must be mapped to a county and sub-county before submitting.' };
  }

  const facilityId = body.facilityId || getUserFacilityScopeId(currentUser);
  const facility = facilities.find((candidate) => candidate.id === facilityId);
  const created = {
    id: `REQ-${new Date().getUTCFullYear()}-${String(requisitions.length + 1).padStart(3, '0')}`,
    sdpName: String(body.sdpName || 'Draft requisition'),
    hrCount: Number(body.hrCount || 0),
    deviceType: String(body.deviceType || 'Unspecified'),
    existingQty: Number(body.existingQty || 0),
    requestedQty: Number(body.requestedQty || 0),
    status: isDraft ? 'Draft' : 'Pending Sub-County',
    facilityId,
    facilityName: String(body.facilityName || facility?.name || currentUser?.name || body.sdpName || ''),
    county,
    subCounty,
    createdByUserId: currentUser?.id || null,
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

const validateFacility = (body, rowNumber = null, existingIds = new Set()) => {
  const prefix = rowNumber ? `Row ${rowNumber}: ` : '';
  const id = String(body.id || body.facilityId || '').trim();
  const name = String(body.name || body.facilityName || '').trim();
  const county = String(body.county || '').trim();

  if (!id) return `${prefix}Facility ID is required.`;
  if (!name) return `${prefix}Facility Name is required.`;
  if (!county) return `${prefix}County is required.`;
  if (!counties.includes(county)) return `${prefix}County must match an available onboarding county.`;
  if (facilities.some((facility) => facility.id.toLowerCase() === id.toLowerCase())) {
    return `${prefix}Facility ID ${id} already exists.`;
  }
  if (existingIds.has(id.toLowerCase())) return `${prefix}Duplicate Facility ID ${id} in upload.`;

  return null;
};

const createFacility = (body) => {
  const error = validateFacility(body);
  if (error) return { error };

  const created = {
    id: String(body.id || body.facilityId).trim(),
    name: String(body.name || body.facilityName).trim(),
    county: String(body.county).trim(),
    status: 'Active',
    createdAt: new Date().toISOString()
  };

  facilities.unshift(created);
  return { created };
};

const bulkCreateFacilities = (body) => {
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return { error: 'items must be a non-empty array.' };
  }

  const seenIds = new Set();
  const saved = [];
  const errors = [];

  body.items.forEach((item, index) => {
    const row = Number(item.rowNumber || index + 2);
    const error = validateFacility(item, row, seenIds);

    if (error) {
      errors.push({ row, message: error.replace(`Row ${row}: `, '') });
      return;
    }

    const id = String(item.id || item.facilityId).trim();
    seenIds.add(id.toLowerCase());
    const created = {
      id,
      name: String(item.name || item.facilityName).trim(),
      county: String(item.county).trim(),
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    facilities.unshift(created);
    saved.push(created);
  });

  return { saved, errors };
};

const createInventoryItem = (body) => {
  if (!body.deviceType) {
    return { error: 'deviceType is required.' };
  }

  if (!deviceTypes.includes(body.deviceType)) {
    return { error: `deviceType must be one of ${deviceTypes.join(', ')}.` };
  }

  const facilityRef = body.facilityId || body.fid;

  if (
    facilityRef &&
    facilities.length > 0 &&
    !facilities.some((facility) => facility.id === facilityRef)
  ) {
    return { error: 'Selected facility does not exist.' };
  }

  const created = {
    id: body.id || createId('INV', inventory),
    deviceType: String(body.deviceType),
    imei: body.imei || body.imei1 || null,
    imei1: body.imei1 || body.imei || null,
    serial: body.serial || null,
    status: body.status || 'Device Accepted',
    dateReceived: body.dateReceived || new Date().toISOString().slice(0, 10),
    facilityId: facilityRef ? String(facilityRef) : null,
    county: body.county || null,
    fid: body.fid || body.facilityId || null,
    facilityName: body.facilityName || null,
    kephLevel: body.kephLevel || null
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

  const imei = body.imei || body.imei1;

  if (!imei && !body.serial) {
    return `${prefix}imei or serial is required.`;
  }

  if (inventory.some((item) => item.id === body.id)) {
    return `${prefix}duplicate inventory id ${body.id}.`;
  }

  if (imei && inventory.some((item) => item.imei === imei)) {
    return `${prefix}duplicate IMEI ${imei}.`;
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
    const imei = item.imei || item.imei1;
    const duplicateInFile =
      seenIds.has(item.id) ||
      (imei && seenImeis.has(imei)) ||
      (item.serial && seenSerials.has(item.serial));
    const error = duplicateInFile
      ? `Row ${rowNumber}: duplicate id, IMEI, or serial inside uploaded CSV.`
      : validateInventoryItem(item, rowNumber);

    if (error) {
      errors.push({ row: rowNumber, message: error.replace(`Row ${rowNumber}: `, '') });
      return;
    }

    seenIds.add(item.id);

    if (imei) {
      seenImeis.add(imei);
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

  if (matchedInventory && body.facilityId && matchedInventory.facilityId !== body.facilityId) {
    return { error: 'The selected device does not belong to this facility.' };
  }

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

  if (matchedInventory && body.facilityId && matchedInventory.facilityId !== body.facilityId) {
    return { error: 'The selected device does not belong to this facility.' };
  }

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

export const handleRequest = async (req, res) => {
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
          candidate.password === body.password &&
          candidate.status === 'Active'
      );

      if (!user) {
        return sendJson(res, 401, {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Email or password is incorrect.'
          }
        });
      }

      const token = randomUUID();
      sessions.set(token, user.id);

      return sendJson(res, 200, {
        token,
        user: enrichUser(user)
      });
    }

    const currentUser = getCurrentUser(req);

    if (req.method === 'GET' && pathname === '/roles') {
      if (!requireUser(res, currentUser)) return;
      return sendJson(res, 200, { data: visibleRolesFor(currentUser) });
    }

    if (req.method === 'POST' && pathname === '/roles') {
      if (!requireRoute(res, currentUser, ['/roles'])) return;
      const result = createRole(await readBody(req));

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: result.created });
    }

    if (req.method === 'GET' && pathname === '/modules') {
      if (!requireRoute(res, currentUser, ['/roles'])) return;
      return sendJson(res, 200, { data: modules });
    }

    if (req.method === 'GET' && pathname === '/users') {
      if (!requireRoute(res, currentUser, ['/users'])) return;
      return sendJson(res, 200, { data: visibleUsersFor(currentUser).map(enrichUser) });
    }

    if (req.method === 'POST' && pathname === '/users') {
      if (!requireRoute(res, currentUser, ['/users'])) return;
      const body = await readBody(req);

      if (isCountyScopedUser(currentUser)) {
        body.county = currentUser.county || null;
      }

      const result = createUser(body, currentUser);

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: enrichUser(result.created) });
    }

    const userMatch = pathname.match(/^\/users\/([^/]+)$/);

    if (userMatch && req.method === 'PATCH') {
      if (!requireRoute(res, currentUser, ['/users'])) return;
      const user = users.find((candidate) => candidate.id === userMatch[1]);

      if (!user) {
        return notFound(res);
      }

      if (!canManageUser(currentUser, user)) {
        return forbidden(res);
      }

      const body = await readBody(req);

      if (isCountyScopedUser(currentUser)) {
        body.county = currentUser.county || null;
      }

      if (body.status && !['Active', 'Suspended', 'Disabled'].includes(body.status)) {
        return badRequest(res, 'Unsupported user status.');
      }

      if (body.roleId && !roles.some((role) => role.id === body.roleId)) {
        return badRequest(res, 'Selected role does not exist.');
      }

      if (body.roleId && !canAssignRole(currentUser, body.roleId)) {
        return forbidden(res);
      }

      if (body.county && !counties.includes(body.county)) {
        return badRequest(res, 'Selected county does not exist.');
      }

      if (body.mobileNo !== undefined && String(body.mobileNo).trim() === '') {
        return badRequest(res, 'Mobile number is required.');
      }

      const nextRole = roles.find((role) => role.id === (body.roleId || user.roleId));
      const requiresCounty = nextRole && ['County', 'Sub-County', 'Facility'].includes(nextRole.tier);
      const requiresSubCounty = nextRole && ['Sub-County', 'Facility'].includes(nextRole.tier);
      const nextCounty = body.county !== undefined ? body.county : user.county;
      const nextSubCounty = body.subCounty !== undefined ? body.subCounty : user.subCounty;

      if (requiresCounty && !nextCounty) {
        return badRequest(res, 'County is required for County, Sub-County, and Facility profiles.');
      }

      if (requiresSubCounty && !String(nextSubCounty || '').trim()) {
        return badRequest(res, 'Sub-county is required for Sub-County and Facility profiles.');
      }

      Object.assign(user, body, {
        mobileNo: body.mobileNo !== undefined ? String(body.mobileNo) : user.mobileNo,
        county: body.county !== undefined ? body.county || null : user.county || null,
        subCounty: body.subCounty !== undefined
          ? String(body.subCounty || '').trim() || null
          : user.subCounty || null
      });
      return sendJson(res, 200, { data: enrichUser(user) });
    }

    if (req.method === 'GET' && pathname === '/counties') {
      if (!requireUser(res, currentUser)) return;
      return sendJson(res, 200, { data: counties });
    }

    if (req.method === 'GET' && pathname === '/facilities') {
      if (!requireUser(res, currentUser)) return;
      const county = searchParams.get('county');
      const data = county
        ? facilities.filter((facility) => facility.county.toLowerCase() === county.toLowerCase())
        : facilities;

      return sendJson(res, 200, { data });
    }

    if (req.method === 'POST' && pathname === '/facilities') {
      if (!requireRoute(res, currentUser, ['/facilities'])) return;
      const result = createFacility(await readBody(req));

      if (result.error) return badRequest(res, result.error);
      return sendJson(res, 201, { data: result.created });
    }

    if (req.method === 'POST' && pathname === '/facilities/bulk') {
      if (!requireRoute(res, currentUser, ['/facilities'])) return;
      const result = bulkCreateFacilities(await readBody(req));

      if (result.error) return badRequest(res, result.error);
      return sendJson(res, 201, {
        data: {
          saved: result.saved,
          errors: result.errors,
          savedCount: result.saved.length,
          errorCount: result.errors.length
        }
      });
    }

    if (req.method === 'GET' && pathname === '/device-types') {
      if (!requireUser(res, currentUser)) return;
      return sendJson(res, 200, { data: deviceTypes });
    }

    if (req.method === 'GET' && pathname === '/dashboard/summary') {
      if (!requireRoute(res, currentUser, ['/dashboard'])) return;
      const facilityId = isFacilityScopedUser(currentUser)
        ? getUserFacilityScopeId(currentUser)
        : searchParams.get('facilityId');
      return sendJson(res, 200, { data: getDashboardSummary(facilityId) });
    }

    if (req.method === 'GET' && pathname === '/inventory') {
      if (!requireRoute(res, currentUser, ['/inventory'])) return;
      const facilityId = searchParams.get('facilityId');
      const status = searchParams.get('status');
      let data = filterRecordsForUser(currentUser, inventory);

      if (facilityId && !isFacilityScopedUser(currentUser)) {
        data = data.filter((item) => item.facilityId === facilityId);
      }

      if (status) {
        data = data.filter((item) => item.status.toLowerCase() === status.toLowerCase());
      }

      return sendJson(res, 200, { data });
    }

    if (req.method === 'POST' && pathname === '/inventory') {
      if (!requireRoute(res, currentUser, ['/inventory', '/migration'])) return;
      const body = await readBody(req);

      if (isFacilityScopedUser(currentUser)) {
        body.facilityId = getUserFacilityScopeId(currentUser);
        body.county = currentUser.county || null;
        body.subCounty = currentUser.subCounty || null;
      }

      const result = createInventoryItem(body);

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: result.created });
    }

    if (req.method === 'POST' && pathname === '/inventory/bulk') {
      if (!requireRoute(res, currentUser, ['/migration'])) return;
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
      if (!requireRoute(res, currentUser, ['/inventory'])) return;
      const item = inventory.find((candidate) => candidate.id === inventoryMatch[1]);

      if (!item) {
        return notFound(res);
      }

      if (!canAccessRecord(currentUser, item)) {
        return forbidden(res);
      }

      const body = await readBody(req);

      if (isFacilityScopedUser(currentUser)) {
        delete body.facilityId;
        delete body.fid;
      }

      Object.assign(item, body);
      return sendJson(res, 200, { data: item });
    }

    if (req.method === 'GET' && pathname === '/requisitions') {
      if (!requireRoute(res, currentUser, ['/requisitions', '/requests'])) return;
      const status = searchParams.get('status');
      const facilityId = searchParams.get('facilityId');
      let data = filterRecordsForUser(currentUser, requisitions);

      if (status) {
        data = data.filter((item) => item.status.toLowerCase() === status.toLowerCase());
      }

      if (facilityId) {
        data = data.filter(
          (item) =>
            (!isFacilityScopedUser(currentUser) && item.facilityId === facilityId) ||
            (currentUser && item.createdByUserId === currentUser.id)
        );
      } else if (currentUser?.roleId === 'facility-user') {
        const userFacilityId = getUserFacilityScopeId(currentUser);
        data = data.filter(
          (item) =>
            item.createdByUserId === currentUser.id ||
            (userFacilityId && item.facilityId === userFacilityId)
        );
      }

      return sendJson(res, 200, { data });
    }

    if (req.method === 'POST' && pathname === '/requisitions') {
      if (!requireRoute(res, currentUser, ['/requisitions/create'])) return;
      const body = await readBody(req);

      if (isFacilityScopedUser(currentUser)) {
        body.facilityId = getUserFacilityScopeId(currentUser);
        body.county = currentUser.county || null;
        body.subCounty = currentUser.subCounty || null;
      }

      const result = createRequisition(body, currentUser);

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: result.created });
    }

    const requisitionMatch = pathname.match(/^\/requisitions\/([^/]+)$/);

    if (requisitionMatch && req.method === 'GET') {
      if (!requireRoute(res, currentUser, ['/requisitions', '/requests'])) return;
      const requisition = requisitions.find((item) => item.id === requisitionMatch[1]);

      if (!requisition) {
        return notFound(res);
      }

      if (!canAccessRecord(currentUser, requisition)) {
        return forbidden(res);
      }

      return sendJson(res, 200, { data: requisition });
    }

    if (requisitionMatch && req.method === 'PATCH') {
      if (!requireRoute(res, currentUser, ['/requests'])) return;
      const requisition = requisitions.find((item) => item.id === requisitionMatch[1]);

      if (!requisition) {
        return notFound(res);
      }

      if (!canAccessRecord(currentUser, requisition)) {
        return forbidden(res);
      }

      const body = await readBody(req);

      if (isSubCountyScopedUser(currentUser) || isCountyScopedUser(currentUser)) {
        delete body.facilityId;
        delete body.county;
        delete body.subCounty;
        delete body.createdByUserId;
      }

      Object.assign(requisition, body);
      return sendJson(res, 200, { data: requisition });
    }

    if (req.method === 'GET' && pathname === '/maintenance-tickets') {
      if (!requireRoute(res, currentUser, ['/faulty', '/maintenance', '/tickets', '/incidents'])) return;
      const requestedFacilityId = searchParams.get('facilityId');
      const data = filterRecordsForUser(currentUser, maintenanceTickets);
      return sendJson(res, 200, {
        data: requestedFacilityId && !isFacilityScopedUser(currentUser)
          ? filterByFacility(data, requestedFacilityId)
          : data
      });
    }

    if (req.method === 'POST' && pathname === '/maintenance-tickets') {
      if (!requireRoute(res, currentUser, ['/faulty', '/maintenance', '/tickets'])) return;
      const body = await readBody(req);

      if (isFacilityScopedUser(currentUser)) {
        body.facilityId = getUserFacilityScopeId(currentUser);
      }

      const result = createMaintenanceTicket(body);

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: result.created });
    }

    if (req.method === 'GET' && pathname === '/stolen-reports') {
      if (!requireRoute(res, currentUser, ['/stolen', '/incidents', '/maintenance'])) return;
      const requestedFacilityId = searchParams.get('facilityId');
      const data = filterRecordsForUser(currentUser, stolenReports);
      return sendJson(res, 200, {
        data: requestedFacilityId && !isFacilityScopedUser(currentUser)
          ? filterByFacility(data, requestedFacilityId)
          : data
      });
    }

    if (req.method === 'POST' && pathname === '/stolen-reports') {
      if (!requireRoute(res, currentUser, ['/stolen', '/incidents'])) return;
      const body = await readBody(req);

      if (isFacilityScopedUser(currentUser)) {
        body.facilityId = getUserFacilityScopeId(currentUser);
      }

      const result = createStolenReport(body);

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: result.created });
    }

    if (req.method === 'GET' && pathname === '/handovers') {
      if (!requireRoute(res, currentUser, ['/handover'])) return;
      const requestedFacilityId = searchParams.get('facilityId');
      const data = filterRecordsForUser(currentUser, handovers);
      return sendJson(res, 200, {
        data: requestedFacilityId && !isFacilityScopedUser(currentUser)
          ? filterByFacility(data, requestedFacilityId)
          : data
      });
    }

    if (req.method === 'POST' && pathname === '/handovers') {
      if (!requireRoute(res, currentUser, ['/handover'])) return;
      const body = await readBody(req);

      if (isFacilityScopedUser(currentUser)) {
        body.facilityId = getUserFacilityScopeId(currentUser);
      }

      const result = createHandover(body);

      if (result.error) {
        return badRequest(res, result.error);
      }

      return sendJson(res, 201, { data: result.created });
    }

    const handoverMatch = pathname.match(/^\/handovers\/([^/]+)$/);

    if (handoverMatch && req.method === 'PATCH') {
      if (!requireRoute(res, currentUser, ['/handover'])) return;
      const handover = handovers.find((candidate) => candidate.id === handoverMatch[1]);

      if (!handover) {
        return notFound(res);
      }

      if (!canAccessRecord(currentUser, handover)) {
        return forbidden(res);
      }

      const body = await readBody(req);

      if (isFacilityScopedUser(currentUser)) {
        delete body.facilityId;
      }

      Object.assign(handover, body);
      handover.status = getHandoverStatus(handover);
      return sendJson(res, 200, { data: handover });
    }

    if (req.method === 'GET' && pathname === '/notifications') {
      if (!requireUser(res, currentUser)) return;
      const requestedFacilityId = searchParams.get('facilityId');
      const data = filterRecordsForUser(currentUser, notifications);
      return sendJson(res, 200, {
        data: requestedFacilityId && !isFacilityScopedUser(currentUser)
          ? filterByFacility(data, requestedFacilityId)
          : data
      });
    }

    return notFound(res);
  } catch (error) {
    if (error.message === 'Request body must be valid JSON.') {
      return badRequest(res, error.message);
    }

    return sendJson(res, 500, {
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Unexpected API error.'
      }
    });
  }
};

const isDirectRun = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isDirectRun) {
  http.createServer(handleRequest).listen(PORT, HOST, () => {
    console.log(`DIMS API listening at http://${HOST}:${PORT}/api`);
  });
}
