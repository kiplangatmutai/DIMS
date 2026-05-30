export const counties = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Uasin Gishu',
  'Kiambu',
  'Machakos',
  'Garissa',
  'Kakamega',
  'Nyeri',
  'Meru',
  'Kilifi'
];

export const facilities = [
  {
    id: 'HF-10293',
    name: 'Mbagathi County Hospital',
    county: 'Nairobi',
    subCounty: 'Langata'
  },
  {
    id: 'HF-10294',
    name: 'Pumwani Maternity Hospital',
    county: 'Nairobi',
    subCounty: 'Kamukunji'
  },
  {
    id: 'HF-20192',
    name: 'Coast General Teaching Hospital',
    county: 'Mombasa',
    subCounty: 'Mvita'
  },
  {
    id: 'HF-30481',
    name: 'Jaramogi Oginga Odinga Teaching',
    county: 'Kisumu',
    subCounty: 'Kisumu Central'
  },
  {
    id: 'HF-40912',
    name: 'Nakuru Level 5 Hospital',
    county: 'Nakuru',
    subCounty: 'Nakuru Town West'
  },
  {
    id: 'HF-50123',
    name: 'Moi Teaching and Referral',
    county: 'Uasin Gishu',
    subCounty: 'Turbo'
  }
];

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
    name: 'Demo User',
    email: 'demo@health.go.ke',
    password: 'password123',
    roleId: 'facility-user',
    facilityId: 'HF-10293'
  },
  {
    id: 'USR-002',
    name: 'DHA Administrator',
    email: 'admin@health.go.ke',
    password: 'password123',
    roleId: 'dha-admin',
    facilityId: null
  }
];

export const inventory = [
  {
    id: 'INV-001',
    deviceType: 'Tablet',
    imei: '354920108472910',
    serial: null,
    status: 'Device Accepted',
    dateReceived: '2025-10-12',
    facilityId: 'HF-10293'
  },
  {
    id: 'INV-002',
    deviceType: 'Desktop',
    imei: null,
    serial: 'SN-99201A',
    status: 'Device Accepted',
    dateReceived: '2025-10-12',
    facilityId: 'HF-10293'
  },
  {
    id: 'INV-003',
    deviceType: 'Biometric',
    imei: null,
    serial: 'BIO-4492X',
    status: 'Awaiting Support',
    dateReceived: '2025-08-05',
    facilityId: 'HF-10293'
  },
  {
    id: 'INV-004',
    deviceType: 'Laptop',
    imei: null,
    serial: 'LT-88219B',
    status: 'Stolen',
    dateReceived: '2025-01-20',
    facilityId: 'HF-10293'
  }
];

export const requisitions = [
  {
    id: 'REQ-2026-041',
    sdpName: 'Comprehensive Care Center',
    hrCount: 12,
    deviceType: 'Tablet',
    existingQty: 2,
    requestedQty: 10,
    status: 'Pending Sub-County',
    facilityId: 'HF-10293',
    timestamp: '2026-05-26T09:14:22.104Z'
  },
  {
    id: 'REQ-2026-038',
    sdpName: 'Maternity Wing',
    hrCount: 8,
    deviceType: 'Desktop',
    existingQty: 1,
    requestedQty: 3,
    status: 'Approved',
    facilityId: 'HF-10293',
    timestamp: '2026-05-20T14:30:00.000Z'
  },
  {
    id: 'REQ-2026-035',
    sdpName: 'Outpatient Dept',
    hrCount: 20,
    deviceType: 'Biometric',
    existingQty: 0,
    requestedQty: 5,
    status: 'Rejected',
    facilityId: 'HF-10293',
    timestamp: '2026-05-15T11:05:12.441Z'
  }
];
