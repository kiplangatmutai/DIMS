-- DIMS database schema for a Node.js backend.
-- Target database: PostgreSQL 14+.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (
    tier IN ('Public', 'Facility', 'Sub-County', 'County', 'DHA', 'Vendor', 'Admin')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE role_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (role_id, path)
);

CREATE TABLE counties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sub_counties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county_id UUID NOT NULL REFERENCES counties(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (county_id, name)
);

CREATE TABLE facilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  county_id UUID NOT NULL REFERENCES counties(id) ON DELETE RESTRICT,
  sub_county_id UUID NOT NULL REFERENCES sub_counties(id) ON DELETE RESTRICT,
  facility_type TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  facility_id TEXT REFERENCES facilities(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended', 'Disabled')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE device_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  requires_imei BOOLEAN NOT NULL DEFAULT false,
  requires_serial BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE devices (
  id TEXT PRIMARY KEY,
  device_type_id TEXT NOT NULL REFERENCES device_types(id) ON DELETE RESTRICT,
  imei TEXT UNIQUE,
  serial TEXT UNIQUE,
  status TEXT NOT NULL CHECK (
    status IN (
      'Received',
      'Device Accepted',
      'Assigned',
      'Awaiting Support',
      'Under Repair',
      'Transferred',
      'Stolen',
      'Retired'
    )
  ),
  date_received DATE,
  facility_id TEXT REFERENCES facilities(id) ON DELETE SET NULL,
  assigned_to_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (imei IS NOT NULL OR serial IS NOT NULL)
);

CREATE TABLE requisitions (
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
  sdp_name TEXT NOT NULL,
  hr_count INTEGER NOT NULL CHECK (hr_count >= 0),
  status TEXT NOT NULL CHECK (
    status IN (
      'Draft',
      'Pending Sub-County',
      'Pending County',
      'Pending DHA',
      'Approved',
      'Rejected',
      'Fulfilled',
      'Cancelled'
    )
  ),
  requested_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE requisition_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisition_id TEXT NOT NULL REFERENCES requisitions(id) ON DELETE CASCADE,
  device_type_id TEXT NOT NULL REFERENCES device_types(id) ON DELETE RESTRICT,
  existing_qty INTEGER NOT NULL DEFAULT 0 CHECK (existing_qty >= 0),
  requested_qty INTEGER NOT NULL CHECK (requested_qty > 0),
  approved_qty INTEGER CHECK (approved_qty >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (requisition_id, device_type_id)
);

CREATE TABLE approval_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisition_id TEXT NOT NULL REFERENCES requisitions(id) ON DELETE CASCADE,
  actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  tier TEXT NOT NULL CHECK (tier IN ('Sub-County', 'County', 'DHA')),
  decision TEXT NOT NULL CHECK (decision IN ('Approved', 'Rejected', 'Returned')),
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vendor_orders (
  id TEXT PRIMARY KEY,
  requisition_id TEXT REFERENCES requisitions(id) ON DELETE SET NULL,
  vendor_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN ('Created', 'Accepted', 'Serialized', 'Dispatched', 'Delivered', 'Cancelled')
  ),
  accepted_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vendor_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES vendor_orders(id) ON DELETE CASCADE,
  device_type_id TEXT NOT NULL REFERENCES device_types(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (order_id, device_type_id)
);

CREATE TABLE dispatches (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES vendor_orders(id) ON DELETE CASCADE,
  destination_facility_id TEXT REFERENCES facilities(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('Pending Review', 'Approved', 'In Transit', 'Delivered')),
  reviewed_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  dispatched_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dispatch_devices (
  dispatch_id TEXT NOT NULL REFERENCES dispatches(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL REFERENCES devices(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (dispatch_id, device_id)
);

CREATE TABLE proof_of_deliveries (
  id TEXT PRIMARY KEY,
  dispatch_id TEXT NOT NULL REFERENCES dispatches(id) ON DELETE CASCADE,
  received_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  receiver_name TEXT NOT NULL,
  notes TEXT,
  signature_url TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE asset_transfers (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES devices(id) ON DELETE RESTRICT,
  from_facility_id TEXT REFERENCES facilities(id) ON DELETE SET NULL,
  to_facility_id TEXT NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('Requested', 'Approved', 'In Transit', 'Completed', 'Rejected')),
  requested_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE maintenance_tickets (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES devices(id) ON DELETE RESTRICT,
  facility_id TEXT REFERENCES facilities(id) ON DELETE SET NULL,
  issue_type TEXT NOT NULL CHECK (issue_type IN ('Faulty', 'Damaged', 'Software', 'Network', 'Other')),
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Open', 'Assigned', 'Awaiting Support', 'Under Repair', 'Resolved', 'Closed')),
  reported_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  assigned_to_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE stolen_reports (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES devices(id) ON DELETE RESTRICT,
  facility_id TEXT REFERENCES facilities(id) ON DELETE SET NULL,
  police_ob_number TEXT,
  incident_date DATE NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Reported', 'Under Review', 'Verified', 'Closed')),
  reported_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE handovers (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES devices(id) ON DELETE RESTRICT,
  from_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  to_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  facility_id TEXT REFERENCES facilities(id) ON DELETE SET NULL,
  form_type TEXT NOT NULL CHECK (form_type IN ('S11', 'S13')),
  notes TEXT,
  handed_over_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  from_facility_id TEXT REFERENCES facilities(id) ON DELETE SET NULL,
  to_facility_id TEXT REFERENCES facilities(id) ON DELETE SET NULL,
  movement_type TEXT NOT NULL CHECK (
    movement_type IN ('Received', 'Assigned', 'Transferred', 'Returned', 'Dispatched', 'Delivered', 'Retired')
  ),
  reference_type TEXT,
  reference_id TEXT,
  moved_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  moved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  role_id TEXT REFERENCES roles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  before_data JSONB,
  after_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_role_routes_role_id ON role_routes(role_id);
CREATE INDEX idx_sub_counties_county_id ON sub_counties(county_id);
CREATE INDEX idx_facilities_county_id ON facilities(county_id);
CREATE INDEX idx_facilities_sub_county_id ON facilities(sub_county_id);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_facility_id ON users(facility_id);
CREATE INDEX idx_devices_facility_id ON devices(facility_id);
CREATE INDEX idx_devices_device_type_id ON devices(device_type_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_requisitions_facility_id ON requisitions(facility_id);
CREATE INDEX idx_requisitions_status ON requisitions(status);
CREATE INDEX idx_requisition_items_requisition_id ON requisition_items(requisition_id);
CREATE INDEX idx_approval_events_requisition_id ON approval_events(requisition_id);
CREATE INDEX idx_vendor_orders_status ON vendor_orders(status);
CREATE INDEX idx_dispatches_order_id ON dispatches(order_id);
CREATE INDEX idx_maintenance_tickets_device_id ON maintenance_tickets(device_id);
CREATE INDEX idx_maintenance_tickets_status ON maintenance_tickets(status);
CREATE INDEX idx_stolen_reports_device_id ON stolen_reports(device_id);
CREATE INDEX idx_inventory_movements_device_id ON inventory_movements(device_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_role_id ON notifications(role_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
