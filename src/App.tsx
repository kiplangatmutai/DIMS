import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import { PublicLanding } from './pages/PublicLanding';
import { Login } from './pages/Login';
import { AppShell } from './pages/AppShell';
import { CreateRequisition } from './pages/facility/CreateRequisition';
import { MyRequests } from './pages/facility/MyRequests';
import { FaultyDevices } from './pages/facility/FaultyDevices';
import { StolenReports } from './pages/facility/StolenReports';
import { Handover } from './pages/facility/Handover';
import { ProofOfDelivery } from './pages/county/ProofOfDelivery';
import { AssetTransfers } from './pages/county/AssetTransfers';
import { Reports } from './pages/dha/Reports';
import { BulkMigration } from './pages/dha/BulkMigration';
import { FacilityManagement } from './pages/dha/FacilityManagement';
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
  UsersRouter
} from './components/shell/RoleBasedRouter';

export function App() {
  return (
    <RoleProvider>
      <BrowserRouter basename="/dha-device-hub">
        <Routes>
          <Route path="/" element={<PublicLanding />} />
          <Route path="/login" element={<Login />} />

          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/inventory" element={<InventoryRouter />} />
            <Route path="/requisitions/create" element={<CreateRequisition />} />
            <Route path="/requisitions" element={<MyRequests />} />
            <Route path="/requisitions/:id" element={<RequisitionDetail />} />
            <Route path="/faulty" element={<FaultyDevices />} />
            <Route path="/stolen" element={<StolenReports />} />
            <Route path="/handover" element={<Handover />} />
            <Route path="/requests" element={<RequestsRouter />} />
            <Route path="/pod" element={<ProofOfDelivery />} />
            <Route path="/transfers" element={<AssetTransfers />} />
            <Route path="/users" element={<UsersRouter />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/migration" element={<BulkMigration />} />
            <Route path="/facilities" element={<FacilityManagement />} />
            <Route path="/orders" element={<OrderSummary />} />
            <Route path="/serialization" element={<Serialization />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/maintenance" element={<MaintenanceQueue />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/roles" element={<RoleProvisioning />} />
            <Route path="/review" element={<DispatchReview />} />
            <Route path="/tickets" element={<AfterSalesSupport />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RoleProvider>
  );
}
