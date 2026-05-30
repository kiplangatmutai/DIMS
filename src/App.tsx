import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import { PublicLanding } from './pages/PublicLanding';
import { Login } from './pages/Login';
import { AppShell } from './pages/AppShell';
import { FacilityDashboard } from './pages/facility/Dashboard';
import { CreateRequisition } from './pages/facility/CreateRequisition';
import { MyRequests } from './pages/facility/MyRequests';
import { ActiveInventory } from './pages/facility/ActiveInventory';
import { FaultyDevices } from './pages/facility/FaultyDevices';
import { StolenReports } from './pages/facility/StolenReports';
import { Handover } from './pages/facility/Handover';
import { SubCountyDashboard } from './pages/subcounty/Dashboard';
import { FacilityRequests } from './pages/subcounty/FacilityRequests';
import { SubCountyInventory } from './pages/subcounty/SubCountyInventory';
import { ProofOfDelivery } from './pages/county/ProofOfDelivery';
import { AssetTransfers } from './pages/county/AssetTransfers';
import { Reports } from './pages/dha/Reports';
import { BulkMigration } from './pages/dha/BulkMigration';
import { OrderSummary } from './pages/vendor/OrderSummary';
import { Serialization } from './pages/vendor/Serialization';
import { Notifications } from './pages/Notifications';
import { MaintenanceQueue } from './pages/county/MaintenanceQueue';
import { Incidents } from './pages/dha/Incidents';
import { RoleProvisioning } from './pages/dha/RoleProvisioning';
import { DispatchReview } from './pages/vendor/DispatchReview';
import { AfterSalesSupport } from './pages/vendor/AfterSalesSupport';
import { RequisitionDetail } from './pages/facility/RequisitionDetail';
import {
  DashboardRouter,
  InventoryRouter,
  RequestsRouter,
  UsersRouter } from
'./components/shell/RoleBasedRouter';
// Placeholder for unbuilt pages
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

export function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLanding />} />
          <Route path="/login" element={<Login />} />

          <Route element={<AppShell />}>
            {/* Shared Routes (Role Based) */}
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/inventory" element={<InventoryRouter />} />

            {/* Facility Tier */}
            <Route
              path="/requisitions/create"
              element={<CreateRequisition />} />
            
            <Route path="/requisitions" element={<MyRequests />} />
            <Route path="/requisitions/:id" element={<RequisitionDetail />} />
            <Route path="/faulty" element={<FaultyDevices />} />
            <Route path="/stolen" element={<StolenReports />} />
            <Route path="/handover" element={<Handover />} />

            {/* Shared: Requests (Role Based) */}
            <Route path="/requests" element={<RequestsRouter />} />

            {/* County Tier */}
            <Route path="/pod" element={<ProofOfDelivery />} />
            <Route path="/transfers" element={<AssetTransfers />} />
            <Route path="/users" element={<UsersRouter />} />

            {/* DHA Tier */}
            <Route path="/reports" element={<Reports />} />
            <Route path="/migration" element={<BulkMigration />} />

            {/* Vendor Tier */}
            <Route path="/orders" element={<OrderSummary />} />
            <Route path="/serialization" element={<Serialization />} />

            {/* Cross-cutting */}
            <Route path="/notifications" element={<Notifications />} />

            {/* County Tier - Additional */}
            <Route path="/maintenance" element={<MaintenanceQueue />} />

            {/* DHA Tier - Additional */}
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/roles" element={<RoleProvisioning />} />

            {/* Vendor Tier - Additional */}
            <Route path="/review" element={<DispatchReview />} />
            <Route path="/tickets" element={<AfterSalesSupport />} />



            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RoleProvider>);

}
