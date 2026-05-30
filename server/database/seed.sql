-- Development seed data matching the current in-memory API sample data.

INSERT INTO roles (id, name, tier) VALUES
  ('facility-user', 'Facility User', 'Facility'),
  ('sub-county-approver', 'Sub-County Approver', 'Sub-County'),
  ('county-request-approver', 'County Request Approver', 'County'),
  ('county-inventory-officer', 'County Inventory Officer', 'County'),
  ('county-onboarding-officer', 'County Onboarding Officer', 'County'),
  ('dha-approval-officer', 'DHA Approval Officer', 'DHA'),
  ('dha-inventory-officer', 'DHA Inventory Officer', 'DHA'),
  ('dha-admin', 'DHA Admin', 'DHA'),
  ('vendor-order-accepter', 'Order Accepter', 'Vendor'),
  ('vendor-warehouse-dispatcher', 'Warehouse Dispatcher', 'Vendor'),
  ('vendor-service-delivery', 'Service Delivery', 'Vendor'),
  ('vendor-after-sales', 'After Sales Support', 'Vendor'),
  ('super-admin', 'Super Admin', 'Admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO role_routes (role_id, path, label, icon, sort_order) VALUES
  ('facility-user', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('facility-user', '/requisitions/create', 'Create Requisition', 'PlusCircle', 20),
  ('facility-user', '/requisitions', 'My Requests', 'ClipboardList', 30),
  ('facility-user', '/inventory', 'Active Inventory', 'Box', 40),
  ('facility-user', '/faulty', 'Faulty Devices', 'Wrench', 50),
  ('facility-user', '/stolen', 'Stolen Reports', 'ShieldAlert', 60),
  ('facility-user', '/handover', 'S11/S13 Handover', 'FileCheck', 70),
  ('dha-admin', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('dha-admin', '/migration', 'Bulk Migration', 'Database', 20),
  ('dha-admin', '/roles', 'Role Provisioning', 'Shield', 30)
ON CONFLICT (role_id, path) DO NOTHING;

INSERT INTO counties (name) VALUES
  ('Nairobi'),
  ('Mombasa'),
  ('Kisumu'),
  ('Nakuru'),
  ('Uasin Gishu'),
  ('Kiambu'),
  ('Machakos'),
  ('Garissa'),
  ('Kakamega'),
  ('Nyeri'),
  ('Meru'),
  ('Kilifi')
ON CONFLICT (name) DO NOTHING;

INSERT INTO sub_counties (county_id, name)
SELECT counties.id, source.name
FROM (
  VALUES
    ('Nairobi', 'Langata'),
    ('Nairobi', 'Kamukunji'),
    ('Mombasa', 'Mvita'),
    ('Kisumu', 'Kisumu Central'),
    ('Nakuru', 'Nakuru Town West'),
    ('Uasin Gishu', 'Turbo')
) AS source(county_name, name)
JOIN counties ON counties.name = source.county_name
ON CONFLICT (county_id, name) DO NOTHING;

INSERT INTO facilities (id, name, county_id, sub_county_id)
SELECT source.id, source.name, counties.id, sub_counties.id
FROM (
  VALUES
    ('HF-10293', 'Mbagathi County Hospital', 'Nairobi', 'Langata'),
    ('HF-10294', 'Pumwani Maternity Hospital', 'Nairobi', 'Kamukunji'),
    ('HF-20192', 'Coast General Teaching Hospital', 'Mombasa', 'Mvita'),
    ('HF-30481', 'Jaramogi Oginga Odinga Teaching', 'Kisumu', 'Kisumu Central'),
    ('HF-40912', 'Nakuru Level 5 Hospital', 'Nakuru', 'Nakuru Town West'),
    ('HF-50123', 'Moi Teaching and Referral', 'Uasin Gishu', 'Turbo')
) AS source(id, name, county_name, sub_county_name)
JOIN counties ON counties.name = source.county_name
JOIN sub_counties
  ON sub_counties.name = source.sub_county_name
  AND sub_counties.county_id = counties.id
ON CONFLICT (id) DO NOTHING;

INSERT INTO device_types (id, name, requires_imei, requires_serial) VALUES
  ('tablet', 'Tablet', true, false),
  ('desktop', 'Desktop', false, true),
  ('laptop', 'Laptop', false, true),
  ('biometric', 'Biometric', false, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, full_name, username, email, password_hash, role_id, facility_id) VALUES
  ('USR-001', 'Facility Officer', 'facility', 'facility@health.go.ke', '$2b$10$replace-with-real-bcrypt-hash', 'facility-user', 'HF-10293'),
  ('USR-002', 'Super Admin', 'admin', 'admin@health.go.ke', '$2b$10$replace-with-real-bcrypt-hash', 'super-admin', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO devices (id, device_type_id, imei, serial, status, date_received, facility_id) VALUES
  ('INV-001', 'tablet', '354920108472910', NULL, 'Device Accepted', '2025-10-12', 'HF-10293'),
  ('INV-002', 'desktop', NULL, 'SN-99201A', 'Device Accepted', '2025-10-12', 'HF-10293'),
  ('INV-003', 'biometric', NULL, 'BIO-4492X', 'Awaiting Support', '2025-08-05', 'HF-10293'),
  ('INV-004', 'laptop', NULL, 'LT-88219B', 'Stolen', '2025-01-20', 'HF-10293')
ON CONFLICT (id) DO NOTHING;

INSERT INTO requisitions (
  id,
  facility_id,
  sdp_name,
  hr_count,
  status,
  requested_by_user_id,
  submitted_at
) VALUES
  ('REQ-2026-041', 'HF-10293', 'Comprehensive Care Center', 12, 'Pending Sub-County', 'USR-001', '2026-05-26T09:14:22.104Z'),
  ('REQ-2026-038', 'HF-10293', 'Maternity Wing', 8, 'Approved', 'USR-001', '2026-05-20T14:30:00.000Z'),
  ('REQ-2026-035', 'HF-10293', 'Outpatient Dept', 20, 'Rejected', 'USR-001', '2026-05-15T11:05:12.441Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO requisition_items (
  requisition_id,
  device_type_id,
  existing_qty,
  requested_qty,
  approved_qty
) VALUES
  ('REQ-2026-041', 'tablet', 2, 10, NULL),
  ('REQ-2026-038', 'desktop', 1, 3, 3),
  ('REQ-2026-035', 'biometric', 0, 5, 0)
ON CONFLICT (requisition_id, device_type_id) DO NOTHING;
