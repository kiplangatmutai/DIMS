export const counties = [
  'Mombasa',
  'Kwale',
  'Kilifi',
  'Tana River',
  'Lamu',
  'Taita Taveta',
  'Garissa',
  'Wajir',
  'Mandera',
  'Marsabit',
  'Isiolo',
  'Meru',
  'Tharaka-Nithi',
  'Embu',
  'Kitui',
  'Machakos',
  'Makueni',
  'Nyandarua',
  'Nyeri',
  'Kirinyaga',
  "Murang'a",
  'Kiambu',
  'Turkana',
  'West Pokot',
  'Samburu',
  'Trans Nzoia',
  'Uasin Gishu',
  'Elgeyo-Marakwet',
  'Nandi',
  'Baringo',
  'Laikipia',
  'Nakuru',
  'Narok',
  'Kajiado',
  'Kericho',
  'Bomet',
  'Kakamega',
  'Vihiga',
  'Bungoma',
  'Busia',
  'Siaya',
  'Kisumu',
  'Homa Bay',
  'Migori',
  'Kisii',
  'Nyamira',
  'Nairobi'
];

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
    routes: routesFor(['/dashboard', '/users', '/roles']),
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
    county: null,
    mobileNo: null,
    status: 'Active'
  }
];

export const inventory = [];

export const requisitions = [];

export const handovers = [];

export const maintenanceTickets = [];

export const stolenReports = [];

export const notifications = [];
