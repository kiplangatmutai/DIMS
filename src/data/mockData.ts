export const COUNTIES = [
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
'Kilifi'];


export const FACILITIES = [
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
}];


export const DEVICE_TYPES = ['Tablet', 'Desktop', 'Laptop', 'Biometric'];

export const MOCK_INVENTORY = [
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
}];


export const MOCK_REQUISITIONS = [
{
  id: 'REQ-2026-041',
  sdpName: 'Comprehensive Care Center',
  hrCount: 12,
  deviceType: 'Tablet',
  existingQty: 2,
  requestedQty: 10,
  status: 'Pending Sub-County',
  timestamp: '2026-05-26 09:14:22.104'
},
{
  id: 'REQ-2026-038',
  sdpName: 'Maternity Wing',
  hrCount: 8,
  deviceType: 'Desktop',
  existingQty: 1,
  requestedQty: 3,
  status: 'Approved',
  timestamp: '2026-05-20 14:30:00.000'
},
{
  id: 'REQ-2026-035',
  sdpName: 'Outpatient Dept',
  hrCount: 20,
  deviceType: 'Biometric',
  existingQty: 0,
  requestedQty: 5,
  status: 'Rejected',
  timestamp: '2026-05-15 11:05:12.441'
}];