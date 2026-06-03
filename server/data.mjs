export const counties = [];

export const facilities = [];

export const deviceTypes = ['Tablet', 'Desktop', 'Laptop', 'Biometric'];

export const modules = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/users', label: 'User Onboarding', icon: 'Users' },
  { path: '/roles', label: 'Profile Management', icon: 'Shield' },
  { path: '/migration', label: 'Bulk Migration', icon: 'Database' },
  { path: '/requests', label: 'Requests Queue', icon: 'Inbox' },
  { path: '/inventory', label: 'Inventory', icon: 'Boxes' },
  { path: '/reports', label: 'Reports', icon: 'BarChart3' },
  { path: '/incidents', label: 'Incidents & Maintenance', icon: 'AlertTriangle' },
  { path: '/pod', label: 'Proof of Delivery', icon: 'Truck' },
  { path: '/transfers', label: 'Asset Transfers', icon: 'ArrowRightLeft' },
  { path: '/maintenance', label: 'Repair / Theft Queue', icon: 'Wrench' },
  { path: '/orders', label: 'Order Summary', icon: 'ShoppingCart' },
  { path: '/serialization', label: 'Serialization', icon: 'Barcode' },
  { path: '/review', label: 'Dispatch Review', icon: 'CheckSquare' },
  { path: '/tickets', label: 'Support Tickets', icon: 'Ticket' },
  { path: '/requisitions/create', label: 'Create Requisition', icon: 'PlusCircle' },
  { path: '/requisitions', label: 'My Requests', icon: 'ClipboardList' },
  { path: '/faulty', label: 'Faulty Devices', icon: 'Wrench' },
  { path: '/stolen', label: 'Stolen Reports', icon: 'ShieldAlert' },
  { path: '/handover', label: 'S11/S13 Handover', icon: 'FileCheck' }
];

const moduleByPath = new Map(modules.map((module) => [module.path, module]));

const routesFor = (paths) => paths.map((path) => moduleByPath.get(path)).filter(Boolean);

export const roles = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    tier: 'Admin',
    description: 'Root administrator that onboards top-level administrators and creates custom profiles.',
    routes: modules,
    canOnboardRoleIds: ['dha-admin', 'county-onboarding-officer', 'admin', 'vendor-admin']
  },
  {
    id: 'admin',
    name: 'Admin',
    tier: 'Admin',
    description: 'Sub-level administrator capable of provisioning standard users and executing general administrative tasks.',
    routes: routesFor(['/dashboard', '/users']),
    canOnboardRoleIds: ['facility-user']
  },
  {
    id: 'vendor-admin',
    name: 'Vendor Admin',
    tier: 'Vendor',
    description: 'Creates and manages internal vendor operational profiles.',
    routes: routesFor(['/dashboard', '/users', '/orders', '/serialization', '/review', '/tickets']),
    canOnboardRoleIds: [
      'vendor-order-accepter',
      'vendor-service-delivery',
      'vendor-warehouse-dispatcher',
      'vendor-after-sales'
    ]
  },
  {
    id: 'vendor-order-accepter',
    name: 'Order Accepter',
    tier: 'Vendor',
    description: 'Views approved DHA orders, accepts incoming requests, and routes them to Service Delivery for processing.',
    routes: routesFor(['/dashboard', '/orders'])
  },
  {
    id: 'vendor-service-delivery',
    name: 'Service Delivery',
    tier: 'Vendor',
    description: 'Reviews hardware-to-facility mapping schemas submitted by the warehouse and gives final dispatch approval.',
    routes: routesFor(['/dashboard', '/review'])
  },
  {
    id: 'vendor-warehouse-dispatcher',
    name: 'Warehouse Dispatcher',
    tier: 'Vendor',
    description: 'Maps unique hardware identifiers to order line-items before physical dispatch.',
    routes: routesFor(['/dashboard', '/serialization'])
  },
  {
    id: 'vendor-after-sales',
    name: 'After Sales Support',
    tier: 'Vendor',
    description: 'Receives downstream faulty or broken device notifications and initiates repair or replacement loops.',
    routes: routesFor(['/dashboard', '/tickets'])
  },
  {
    id: 'dha-admin',
    name: 'DHA Admin',
    tier: 'DHA',
    description: 'Provisions internal DHA operational roles and executes verified bulk legacy data migrations.',
    routes: routesFor(['/dashboard', '/users', '/migration', '/roles']),
    canOnboardRoleIds: ['dha-onboarding-officer', 'dha-approval-officer', 'dha-inventory-officer']
  },
  {
    id: 'dha-onboarding-officer',
    name: 'DHA Onboarding Officer',
    tier: 'DHA',
    description: 'Manages high-level creation, activation, and suspension of County-level administrative teams.',
    routes: routesFor(['/dashboard', '/users']),
    canOnboardRoleIds: ['county-admin']
  },
  {
    id: 'dha-approval-officer',
    name: 'DHA Approval Officer',
    tier: 'DHA',
    description: 'Performs final validation of merged County requests, quantity changes, approvals, vendor routing, and rejections.',
    routes: routesFor(['/dashboard', '/requests'])
  },
  {
    id: 'dha-inventory-officer',
    name: 'DHA Inventory Officer',
    tier: 'DHA',
    description: 'Has cross-cutting visibility into nationwide inventory, transfers, theft incidents, and maintenance metrics.',
    routes: routesFor(['/dashboard', '/inventory', '/incidents', '/reports'])
  },
  {
    id: 'county-admin',
    name: 'County Admin',
    tier: 'County',
    description: 'Local tenant administrator for intra-county inventory monitoring and County user provisioning.',
    routes: routesFor(['/dashboard', '/users', '/inventory']),
    canOnboardRoleIds: [
      'county-onboarding-officer',
      'county-request-approver',
      'county-inventory-officer',
      'sub-county-approver',
      'facility-user'
    ]
  },
  {
    id: 'county-onboarding-officer',
    name: 'County Onboarding Officer',
    tier: 'County',
    description: 'Onboards County, Sub-County, and manual Facility user accounts.',
    routes: routesFor(['/dashboard', '/users']),
    canOnboardRoleIds: [
      'county-request-approver',
      'county-inventory-officer',
      'sub-county-approver',
      'facility-user'
    ]
  },
  {
    id: 'county-request-approver',
    name: 'County Request Approver',
    tier: 'County',
    description: 'Consolidates Sub-County requests into County orders, validates deliveries, uploads PoD, and routes requests to DHA.',
    routes: routesFor(['/dashboard', '/requests', '/pod'])
  },
  {
    id: 'county-inventory-officer',
    name: 'County Inventory Officer',
    tier: 'County',
    description: 'Manages stock, intra-county transfer tickets, and local repair or theft queues.',
    routes: routesFor(['/dashboard', '/inventory', '/transfers', '/maintenance'])
  },
  {
    id: 'sub-county-approver',
    name: 'Sub-County Approver',
    tier: 'Sub-County',
    description: 'Aggregates multi-facility demand into Sub-County orders, modifies quantities, or rejects facility requests.',
    routes: routesFor(['/dashboard', '/requests', '/inventory'])
  },
  {
    id: 'facility-user',
    name: 'Facility User',
    tier: 'Facility',
    description: 'Executes supply requests, logs device loss or damage, uploads S11/S13 forms, and confirms unit acceptance.',
    routes: routesFor([
      '/dashboard',
      '/requisitions/create',
      '/requisitions',
      '/inventory',
      '/faulty',
      '/stolen',
      '/handover'
    ])
  }
];

export const users = [
  {
    id: 'USR-001',
    name: 'Super Admin',
    username: 'admin',
    email: 'admin@health.go.ke',
    password: 'admin123',
    roleId: 'super-admin',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-002',
    name: 'Admin User',
    username: 'system-admin',
    email: 'system-admin@health.go.ke',
    password: 'admin123',
    roleId: 'admin',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-003',
    name: 'Vendor Admin',
    username: 'vendor-admin',
    email: 'vendor-admin@health.go.ke',
    password: 'admin123',
    roleId: 'vendor-admin',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-004',
    name: 'Vendor Order Accepter',
    username: 'vendor-orders',
    email: 'vendor-orders@health.go.ke',
    password: 'admin123',
    roleId: 'vendor-order-accepter',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-005',
    name: 'Vendor Service Delivery',
    username: 'vendor-service',
    email: 'vendor-service@health.go.ke',
    password: 'admin123',
    roleId: 'vendor-service-delivery',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-006',
    name: 'Vendor Warehouse Dispatcher',
    username: 'vendor-warehouse',
    email: 'vendor-warehouse@health.go.ke',
    password: 'admin123',
    roleId: 'vendor-warehouse-dispatcher',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-007',
    name: 'Vendor After Sales',
    username: 'vendor-support',
    email: 'vendor-support@health.go.ke',
    password: 'admin123',
    roleId: 'vendor-after-sales',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-008',
    name: 'DHA Admin',
    username: 'dha-admin',
    email: 'dha-admin@health.go.ke',
    password: 'admin123',
    roleId: 'dha-admin',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-009',
    name: 'DHA Onboarding Officer',
    username: 'dha-onboarding',
    email: 'dha-onboarding@health.go.ke',
    password: 'admin123',
    roleId: 'dha-onboarding-officer',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-010',
    name: 'DHA Approval Officer',
    username: 'dha-approval',
    email: 'dha-approval@health.go.ke',
    password: 'admin123',
    roleId: 'dha-approval-officer',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-011',
    name: 'DHA Inventory Officer',
    username: 'dha-inventory',
    email: 'dha-inventory@health.go.ke',
    password: 'admin123',
    roleId: 'dha-inventory-officer',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-012',
    name: 'County Admin',
    username: 'county-admin',
    email: 'county-admin@health.go.ke',
    password: 'admin123',
    roleId: 'county-admin',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-013',
    name: 'County Onboarding Officer',
    username: 'county-onboarding',
    email: 'county-onboarding@health.go.ke',
    password: 'admin123',
    roleId: 'county-onboarding-officer',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-014',
    name: 'County Request Approver',
    username: 'county-requests',
    email: 'county-requests@health.go.ke',
    password: 'admin123',
    roleId: 'county-request-approver',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-015',
    name: 'County Inventory Officer',
    username: 'county-inventory',
    email: 'county-inventory@health.go.ke',
    password: 'admin123',
    roleId: 'county-inventory-officer',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-016',
    name: 'Sub-County Approver',
    username: 'subcounty-approver',
    email: 'subcounty-approver@health.go.ke',
    password: 'admin123',
    roleId: 'sub-county-approver',
    facilityId: null,
    status: 'Active'
  },
  {
    id: 'USR-017',
    name: 'Facility User',
    username: 'facility-user',
    email: 'facility-user@health.go.ke',
    password: 'admin123',
    roleId: 'facility-user',
    facilityId: null,
    status: 'Active'
  }
];

export const inventory = [];

export const requisitions = [];

export const handovers = [];

export const maintenanceTickets = [];

export const stolenReports = [];
