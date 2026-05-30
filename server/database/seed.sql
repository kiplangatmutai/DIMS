-- Production bootstrap data.
-- This file intentionally avoids dummy facilities, inventory, requisitions,
-- dispatches, tickets, or public metrics. It creates only reference values
-- and the first super administrator account.

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
  ('super-admin', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('super-admin', '/users', 'Onboard Users', 'Users', 20)
ON CONFLICT (role_id, path) DO NOTHING;

INSERT INTO device_types (id, name, requires_imei, requires_serial) VALUES
  ('tablet', 'Tablet', true, false),
  ('desktop', 'Desktop', false, true),
  ('laptop', 'Laptop', false, true),
  ('biometric', 'Biometric', false, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, full_name, username, email, password_hash, role_id, facility_id) VALUES
  ('USR-001', 'Super Admin', 'admin', 'admin@health.go.ke', '$2b$10$replace-with-real-bcrypt-hash', 'super-admin', NULL)
ON CONFLICT (id) DO NOTHING;
