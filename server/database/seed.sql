-- Production bootstrap data.
-- Creates reference profiles, profile module access, onboarding permissions,
-- device types, and the first super administrator account.

INSERT INTO roles (id, name, tier, description, is_custom) VALUES
  ('super-admin', 'Super Admin', 'Admin', 'Root administrator that onboards top-level administrators and creates custom profiles.', false),
  ('admin', 'Admin', 'Admin', 'Sub-level administrator capable of provisioning standard users and executing general administrative tasks.', false),
  ('vendor-admin', 'Vendor Admin', 'Vendor', 'Creates and manages internal vendor operational profiles.', false),
  ('vendor-order-accepter', 'Order Accepter', 'Vendor', 'Views approved DHA orders, accepts incoming requests, and routes them to Service Delivery for processing.', false),
  ('vendor-service-delivery', 'Service Delivery', 'Vendor', 'Reviews hardware-to-facility mapping schemas submitted by the warehouse and gives final dispatch approval.', false),
  ('vendor-warehouse-dispatcher', 'Warehouse Dispatcher', 'Vendor', 'Maps unique hardware identifiers to order line-items before physical dispatch.', false),
  ('vendor-after-sales', 'After Sales Support', 'Vendor', 'Receives downstream faulty or broken device notifications and initiates repair or replacement loops.', false),
  ('dha-admin', 'DHA Admin', 'DHA', 'Provisions internal DHA operational roles and executes verified bulk legacy data migrations.', false),
  ('dha-onboarding-officer', 'DHA Onboarding Officer', 'DHA', 'Manages high-level creation, activation, and suspension of County-level administrative teams.', false),
  ('dha-approval-officer', 'DHA Approval Officer', 'DHA', 'Performs final validation of merged County requests, quantity changes, approvals, vendor routing, and rejections.', false),
  ('dha-inventory-officer', 'DHA Inventory Officer', 'DHA', 'Has cross-cutting visibility into nationwide inventory, transfers, theft incidents, and maintenance metrics.', false),
  ('county-admin', 'County Admin', 'County', 'Local tenant administrator for intra-county inventory monitoring and County user provisioning.', false),
  ('county-onboarding-officer', 'County Onboarding Officer', 'County', 'Onboards County, Sub-County, and manual Facility user accounts.', false),
  ('county-request-approver', 'County Request Approver', 'County', 'Consolidates Sub-County requests into County orders, validates deliveries, uploads PoD, and routes requests to DHA.', false),
  ('county-inventory-officer', 'County Inventory Officer', 'County', 'Manages stock, intra-county transfer tickets, and local repair or theft queues.', false),
  ('sub-county-approver', 'Sub-County Approver', 'Sub-County', 'Aggregates multi-facility demand into Sub-County orders, modifies quantities, or rejects facility requests.', false),
  ('facility-user', 'Facility User', 'Facility', 'Executes supply requests, logs device loss or damage, uploads S11/S13 forms, and confirms unit acceptance.', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  description = EXCLUDED.description,
  is_custom = EXCLUDED.is_custom;

INSERT INTO role_routes (role_id, path, label, icon, sort_order) VALUES
  ('super-admin', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('super-admin', '/users', 'User Onboarding', 'Users', 20),
  ('super-admin', '/roles', 'Profile Management', 'Shield', 30),
  ('admin', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('admin', '/users', 'User Onboarding', 'Users', 20),
  ('vendor-admin', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('vendor-admin', '/users', 'User Onboarding', 'Users', 20),
  ('vendor-admin', '/orders', 'Order Summary', 'ShoppingCart', 30),
  ('vendor-admin', '/serialization', 'Serialization', 'Barcode', 40),
  ('vendor-admin', '/review', 'Dispatch Review', 'CheckSquare', 50),
  ('vendor-admin', '/tickets', 'Support Tickets', 'Ticket', 60),
  ('vendor-order-accepter', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('vendor-order-accepter', '/orders', 'Order Summary', 'ShoppingCart', 20),
  ('vendor-service-delivery', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('vendor-service-delivery', '/review', 'Dispatch Review', 'CheckSquare', 20),
  ('vendor-warehouse-dispatcher', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('vendor-warehouse-dispatcher', '/serialization', 'Serialization', 'Barcode', 20),
  ('vendor-after-sales', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('vendor-after-sales', '/tickets', 'Support Tickets', 'Ticket', 20),
  ('dha-admin', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('dha-admin', '/users', 'User Onboarding', 'Users', 20),
  ('dha-admin', '/migration', 'Bulk Migration', 'Database', 30),
  ('dha-admin', '/roles', 'Profile Management', 'Shield', 40),
  ('dha-onboarding-officer', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('dha-onboarding-officer', '/users', 'User Onboarding', 'Users', 20),
  ('dha-approval-officer', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('dha-approval-officer', '/requests', 'Requests Queue', 'Inbox', 20),
  ('dha-inventory-officer', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('dha-inventory-officer', '/inventory', 'Inventory', 'Boxes', 20),
  ('dha-inventory-officer', '/incidents', 'Incidents & Maintenance', 'AlertTriangle', 30),
  ('dha-inventory-officer', '/reports', 'Reports', 'BarChart3', 40),
  ('county-admin', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('county-admin', '/users', 'User Onboarding', 'Users', 20),
  ('county-admin', '/inventory', 'Inventory', 'Boxes', 30),
  ('county-onboarding-officer', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('county-onboarding-officer', '/users', 'User Onboarding', 'Users', 20),
  ('county-request-approver', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('county-request-approver', '/requests', 'Requests Queue', 'Inbox', 20),
  ('county-request-approver', '/pod', 'Proof of Delivery', 'Truck', 30),
  ('county-inventory-officer', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('county-inventory-officer', '/inventory', 'Inventory', 'Boxes', 20),
  ('county-inventory-officer', '/transfers', 'Asset Transfers', 'ArrowRightLeft', 30),
  ('county-inventory-officer', '/maintenance', 'Repair / Theft Queue', 'Wrench', 40),
  ('sub-county-approver', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('sub-county-approver', '/requests', 'Requests Queue', 'Inbox', 20),
  ('sub-county-approver', '/inventory', 'Inventory', 'Boxes', 30),
  ('facility-user', '/dashboard', 'Dashboard', 'LayoutDashboard', 10),
  ('facility-user', '/requisitions/create', 'Create Requisition', 'PlusCircle', 20),
  ('facility-user', '/requisitions', 'My Requests', 'ClipboardList', 30),
  ('facility-user', '/inventory', 'Inventory', 'Boxes', 40),
  ('facility-user', '/faulty', 'Faulty Devices', 'Wrench', 50),
  ('facility-user', '/stolen', 'Stolen Reports', 'ShieldAlert', 60),
  ('facility-user', '/handover', 'S11/S13 Handover', 'FileCheck', 70)
ON CONFLICT (role_id, path) DO UPDATE SET
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;

INSERT INTO role_onboarding_permissions (role_id, can_onboard_role_id) VALUES
  ('super-admin', 'dha-admin'),
  ('super-admin', 'county-onboarding-officer'),
  ('super-admin', 'admin'),
  ('super-admin', 'vendor-admin'),
  ('admin', 'facility-user'),
  ('vendor-admin', 'vendor-order-accepter'),
  ('vendor-admin', 'vendor-service-delivery'),
  ('vendor-admin', 'vendor-warehouse-dispatcher'),
  ('vendor-admin', 'vendor-after-sales'),
  ('dha-admin', 'dha-onboarding-officer'),
  ('dha-admin', 'dha-approval-officer'),
  ('dha-admin', 'dha-inventory-officer'),
  ('dha-onboarding-officer', 'county-admin'),
  ('county-admin', 'county-onboarding-officer'),
  ('county-admin', 'county-request-approver'),
  ('county-admin', 'county-inventory-officer'),
  ('county-admin', 'sub-county-approver'),
  ('county-admin', 'facility-user'),
  ('county-onboarding-officer', 'county-request-approver'),
  ('county-onboarding-officer', 'county-inventory-officer'),
  ('county-onboarding-officer', 'sub-county-approver'),
  ('county-onboarding-officer', 'facility-user')
ON CONFLICT (role_id, can_onboard_role_id) DO NOTHING;

INSERT INTO device_types (id, name, requires_imei, requires_serial) VALUES
  ('tablet', 'Tablet', true, false),
  ('desktop', 'Desktop', false, true),
  ('laptop', 'Laptop', false, true),
  ('biometric', 'Biometric', false, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, full_name, username, email, password_hash, role_id, facility_id) VALUES
  ('USR-001', 'Super Admin', 'admin', 'admin@health.go.ke', '$2b$10$replace-with-real-bcrypt-hash', 'super-admin', NULL)
ON CONFLICT (id) DO NOTHING;
