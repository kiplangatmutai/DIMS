export const counties = [];

export const facilities = [];

export const deviceTypes = ['Tablet', 'Desktop', 'Laptop', 'Biometric'];

export const roles = [
  { id: 'facility-user', name: 'Facility User', tier: 'Facility' },
  { id: 'sub-county-approver', name: 'Sub-County Approver', tier: 'Sub-County' },
  { id: 'county-request-approver', name: 'County Request Approver', tier: 'County' },
  { id: 'county-inventory-officer', name: 'County Inventory Officer', tier: 'County' },
  { id: 'county-onboarding-officer', name: 'County Onboarding Officer', tier: 'County' },
  { id: 'dha-approval-officer', name: 'DHA Approval Officer', tier: 'DHA' },
  { id: 'dha-inventory-officer', name: 'DHA Inventory Officer', tier: 'DHA' },
  { id: 'dha-admin', name: 'DHA Admin', tier: 'DHA' },
  { id: 'vendor-order-accepter', name: 'Order Accepter', tier: 'Vendor' },
  { id: 'vendor-warehouse-dispatcher', name: 'Warehouse Dispatcher', tier: 'Vendor' },
  { id: 'vendor-service-delivery', name: 'Service Delivery', tier: 'Vendor' },
  { id: 'vendor-after-sales', name: 'After Sales Support', tier: 'Vendor' },
  { id: 'super-admin', name: 'Super Admin', tier: 'Admin' }
];

export const users = [
  {
    id: 'USR-001',
    name: 'Super Admin',
    username: 'admin',
    email: 'admin@health.go.ke',
    password: 'admin123',
    roleId: 'super-admin',
    facilityId: null
  }
];

export const inventory = [];

export const requisitions = [];
