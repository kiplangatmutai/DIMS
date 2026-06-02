import React from 'react';
import { useRole } from '../../context/RoleContext';
import { FacilityDashboard } from '../../pages/facility/Dashboard';
import { SubCountyDashboard } from '../../pages/subcounty/Dashboard';
import { CountyDashboard } from '../../pages/county/Dashboard';
import { DHADashboard } from '../../pages/dha/Dashboard';
import { VendorDashboard } from '../../pages/vendor/Dashboard';
import { AdminDashboard } from '../../pages/admin/Dashboard';
import { ActiveInventory as FacilityInventory } from '../../pages/facility/ActiveInventory';
import { SubCountyInventory } from '../../pages/subcounty/SubCountyInventory';
import { FacilityRequests } from '../../pages/subcounty/FacilityRequests';
import { CountyRequestsQueue } from '../../pages/county/CountyRequestsQueue';
import { DHACountyRequestsQueue } from '../../pages/dha/CountyRequestsQueue';
import { GlobalUsers } from '../../pages/admin/GlobalUsers';
const ComingSoon = () =>
<div className="flex flex-col items-center justify-center h-full py-20 text-neutral-500">
    <div className="text-6xl mb-4">🚧</div>
    <h2 className="text-xl font-semibold text-neutral-700 mb-2">
      Page Under Construction
    </h2>
    <p>
      This view is part of the prototype but hasn't been fully implemented yet.
    </p>
  </div>;

export function DashboardRouter() {
  const { currentRole } = useRole();
  switch (currentRole.tier) {
    case 'Facility':
      return <FacilityDashboard />;
    case 'Sub-County':
      return <SubCountyDashboard />;
    case 'County':
      return <CountyDashboard />;
    case 'DHA':
      return <DHADashboard />;
    case 'Vendor':
      return <VendorDashboard />;
    case 'Admin':
      return <AdminDashboard />;
    default:
      return <ComingSoon />;
  }
}
export function InventoryRouter() {
  const { currentRole } = useRole();
  switch (currentRole.tier) {
    case 'Facility':
      return <FacilityInventory />;
    case 'Sub-County':
      return <SubCountyInventory />;
    case 'County':
      return <SubCountyInventory />;
    case 'DHA':
      return <SubCountyInventory />;
    default:
      return <ComingSoon />;
  }
}
export function RequestsRouter() {
  const { currentRole } = useRole();
  switch (currentRole.tier) {
    case 'Sub-County':
      return <FacilityRequests />;
    case 'County':
      return <CountyRequestsQueue />;
    case 'DHA':
      return <DHACountyRequestsQueue />;
    default:
      return <ComingSoon />;
  }
}

export function UsersRouter() {
  const { currentRole } = useRole();

  if (currentRole.routes.some((route) => route.path === '/users')) {
    return <GlobalUsers />;
  }

  return <ComingSoon />;
}
