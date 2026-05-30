export type Tier =
'Public' |
'Facility' |
'Sub-County' |
'County' |
'DHA' |
'Vendor' |
'Admin';

export interface RouteDef {
  path: string;
  label: string;
  icon: string;
}

export interface Role {
  id: string;
  name: string;
  tier: Tier;
  routes: RouteDef[];
}

export const ROLES: Role[] = [
{
  id: 'facility-user',
  name: 'Facility User',
  tier: 'Facility',
  routes: [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  {
    path: '/requisitions/create',
    label: 'Create Requisition',
    icon: 'PlusCircle'
  },
  { path: '/requisitions', label: 'My Requests', icon: 'ClipboardList' },
  { path: '/inventory', label: 'Active Inventory', icon: 'Box' },
  { path: '/faulty', label: 'Faulty Devices', icon: 'Wrench' },
  { path: '/stolen', label: 'Stolen Reports', icon: 'ShieldAlert' },
  { path: '/handover', label: 'S11/S13 Handover', icon: 'FileCheck' }]

},
{
  id: 'sub-county-approver',
  name: 'Sub-County Approver',
  tier: 'Sub-County',
  routes: [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/requests', label: 'Facility Requests', icon: 'Inbox' },
  { path: '/inventory', label: 'Sub-County Inventory', icon: 'Boxes' }]

},
{
  id: 'county-request-approver',
  name: 'County Request Approver',
  tier: 'County',
  routes: [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/requests', label: 'Sub-County Requests', icon: 'Inbox' },
  { path: '/pod', label: 'Proof of Delivery', icon: 'Truck' }]

},
{
  id: 'county-inventory-officer',
  name: 'County Inventory Officer',
  tier: 'County',
  routes: [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/inventory', label: 'County Inventory', icon: 'Boxes' },
  { path: '/transfers', label: 'Asset Transfers', icon: 'ArrowRightLeft' },
  { path: '/maintenance', label: 'Repair / Theft Queue', icon: 'Wrench' }]

},
{
  id: 'county-onboarding-officer',
  name: 'County Onboarding Officer',
  tier: 'County',
  routes: [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/users', label: 'User Management', icon: 'Users' }]

},
{
  id: 'dha-approval-officer',
  name: 'DHA Approval Officer',
  tier: 'DHA',
  routes: [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/requests', label: 'County Requests', icon: 'Inbox' }]

},
{
  id: 'dha-inventory-officer',
  name: 'DHA Inventory Officer',
  tier: 'DHA',
  routes: [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/inventory', label: 'Nationwide Inventory', icon: 'Globe' },
  {
    path: '/incidents',
    label: 'Incidents & Maintenance',
    icon: 'AlertTriangle'
  },
  { path: '/reports', label: 'Reports', icon: 'BarChart3' }]

},
{
  id: 'dha-admin',
  name: 'DHA Admin',
  tier: 'DHA',
  routes: [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/migration', label: 'Bulk Migration', icon: 'Database' },
  { path: '/roles', label: 'Role Provisioning', icon: 'Shield' }]

},
{
  id: 'vendor-order-accepter',
  name: 'Order Accepter',
  tier: 'Vendor',
  routes: [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/orders', label: 'Order Summary', icon: 'ShoppingCart' }]

},
{
  id: 'vendor-warehouse-dispatcher',
  name: 'Warehouse Dispatcher',
  tier: 'Vendor',
  routes: [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/serialization', label: 'Serialization', icon: 'Barcode' }]

},
{
  id: 'vendor-service-delivery',
  name: 'Service Delivery',
  tier: 'Vendor',
  routes: [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/review', label: 'Dispatch Review', icon: 'CheckSquare' }]

},
{
  id: 'vendor-after-sales',
  name: 'After Sales Support',
  tier: 'Vendor',
  routes: [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/tickets', label: 'Support Tickets', icon: 'Ticket' }]

},
{
  id: 'super-admin',
  name: 'Super Admin',
  tier: 'Admin',
  routes: [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/users', label: 'Global Users', icon: 'Users' }]

}];