export const tables = {
  roles: 'roles',
  roleRoutes: 'role_routes',
  roleOnboardingPermissions: 'role_onboarding_permissions',
  counties: 'counties',
  subCounties: 'sub_counties',
  facilities: 'facilities',
  users: 'users',
  refreshTokens: 'refresh_tokens',
  deviceTypes: 'device_types',
  devices: 'devices',
  requisitions: 'requisitions',
  requisitionItems: 'requisition_items',
  approvalEvents: 'approval_events',
  vendorOrders: 'vendor_orders',
  vendorOrderItems: 'vendor_order_items',
  dispatches: 'dispatches',
  dispatchDevices: 'dispatch_devices',
  proofOfDeliveries: 'proof_of_deliveries',
  assetTransfers: 'asset_transfers',
  maintenanceTickets: 'maintenance_tickets',
  stolenReports: 'stolen_reports',
  handovers: 'handovers',
  inventoryMovements: 'inventory_movements',
  notifications: 'notifications',
  auditLogs: 'audit_logs'
};

export const deviceStatuses = [
  'Received',
  'Device Accepted',
  'Assigned',
  'Awaiting Support',
  'Under Repair',
  'Transferred',
  'Stolen',
  'Retired'
];

export const requisitionStatuses = [
  'Draft',
  'Pending Sub-County',
  'Pending County',
  'Pending DHA',
  'Approved',
  'Rejected',
  'Fulfilled',
  'Cancelled'
];

export const userStatuses = ['Active', 'Suspended', 'Disabled'];

export const publicUserColumns = [
  'id',
  'full_name',
  'username',
  'email',
  'role_id',
  'facility_id',
  'status',
  'last_login_at',
  'created_at',
  'updated_at'
];
