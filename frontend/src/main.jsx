import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/root.layout.jsx';
import DashboardLayout from './component/DashBoard1.jsx';
import StaffLayout from './layouts/staff.layout.jsx';
import ProtectedRoute from './component/ProtectedRoute.jsx';

// Pages
import Home from './pages/Home/Home.jsx';
import WarehouseManagement from './pages/WarehouseManagement/WarehouseManagement.jsx';
import VehicleFleetManagement from './pages/DeliveryAndVehicleFleet/VehicleFleetManagement.jsx';
import DeliveryManagement from './pages/DeliveryAndVehicleFleet/DeliveryManagement.jsx';
import InventoryManagement from './pages/InventoryManagement/InventoryManagement.jsx';
import StaffManagement from './pages/StaffManagement/StaffManagement.jsx';
import SupplierManagement from './pages/SupplierManagement/SupplierManagement.jsx';
import ReturnDamageHandling from './pages/Return&DamageHandling/ReturnDamageHandling.jsx';
import Help from './pages/Help/Help.jsx';
import Login from './pages/login/login.jsx';
import Unauthorized from './pages/login/Unauthorized.jsx';

// Warehouse Management
import CreateWarehouse from './pages/WarehouseManagement/CreateWarehouse.jsx';
import WarehouseForm from './pages/WarehouseManagement/WarehouseProfile.jsx';
import Maintainance from './pages/WarehouseManagement/Mantainance.jsx';
import MaintenanceForm from './pages/WarehouseManagement/CreateMaintenance.jsx';
import MaintenanceFormTwo from './pages/WarehouseManagement/MaintenanceProfile.jsx';
import CorrectiveForm from './pages/WarehouseManagement/CorrectiveForm.jsx';
import SubmitPage from './pages/WarehouseManagement/CorrectiveSubmit.jsx';
import RoutingMaintenanceForm from './pages/WarehouseManagement/RoutingForm.jsx';
import RoutingSubmit from './pages/WarehouseManagement/RoutingSubmit.jsx';
import MaintenanceDetails from './pages/WarehouseManagement/CorrectiveDetails.jsx';

// Staff Management
import ManageStaff from './pages/StaffManagement/SubPages/ManageStaff.jsx';
import AddStaff from './pages/StaffManagement/SubPages/AddStaff.jsx';
import AssignTask from './pages/StaffManagement/SubPages/AssignTask.jsx';
import LeaveReq from './pages/StaffManagement/SubPages/LeaveReq.jsx';
import ManageSalary from './pages/StaffManagement/SubPages/ManageSalary.jsx';
import Concerns from './pages/StaffManagement/SubPages/Concerns.jsx';
import AttendanceTracking from './pages/StaffManagement/SubPages/AttendanceTracking.jsx';
import StaffAttendance from './pages/StaffManagement/SubPages/StaffAttendanceTracking.jsx';

// Supplier Management
import AddSupplier from './pages/SupplierManagement/AddSupplier.jsx';

// Return & Damage Handling
import DamageHandling from './pages/Return&DamageHandling/DamageHandling.jsx';
import AddDamage from './pages/Return&DamageHandling/AddDamage.jsx';
import Items from './pages/Return&DamageHandling/items.jsx';

// Staff Member
import Dashboard from './pages/StaffMember/Dashboard.jsx';
import Profile from './pages/StaffMember/Profile.jsx';
import QRCode from './pages/StaffMember/QRCode.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/', element: <Home /> },
          { path: 'warehouse', element: <WarehouseManagement /> },
          { path: 'warehouse/Addwarehouse', element: <CreateWarehouse /> },
          { path: 'warehouse/WarehouseDetails/:WarehouseID', element: <WarehouseForm /> },
          { path: 'warehouse/Maintainance', element: <Maintainance /> },
          { path: 'warehouse/Maintainance/AddMaintenance', element: <MaintenanceForm /> },
          { path: 'warehouse/Maintainance/AddMaintenance/:requestId', element: <MaintenanceFormTwo /> },
          { path: 'warehouse/Maintainance/CorrectiveDetails', element: <MaintenanceDetails /> },
          { path: 'warehouse/Maintainance/Corrective-Form', element: <CorrectiveForm /> },
          { path: 'warehouse/Maintainance/Corrective-Form/CorrectiveSubmit', element: <SubmitPage /> },
          { path: 'warehouse/Maintainance/Routing-Form', element: <RoutingMaintenanceForm /> },
          { path: 'warehouse/Maintainance/Routing-Form/RoutingSubmit', element: <RoutingSubmit /> },
          { path: 'fleet', element: <VehicleFleetManagement /> },
          { path: 'delivery', element: <DeliveryManagement /> },
          { path: 'inventory', element: <InventoryManagement /> },
          { path: 'staff', element: <StaffManagement /> },
          { path: 'suppliers', element: <SupplierManagement /> },
          { path: 'return&damage', element: <ReturnDamageHandling /> },
          { path: 'help', element: <Help /> },
        ],
      },
      { path: 'login', element: <Login /> },
      { path: 'unauthorized', element: <Unauthorized /> },
      {
        path: 'staff/',
        element: <StaffLayout />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
            children: [
              { path: 'my-qr', element: <QRCode /> },
            ],
          },
        ],
      },
      {
        path: 'staff/manage-staff', element: <ManageStaff />
      },
      {
        path: 'staff/add-staff', element: <AddStaff />
      },
      {
        path: 'staff/assign-tasks', element: <AssignTask />
      },
      {
        path: 'staff/leave-requests', element: <LeaveReq />
      },
      {
        path: 'staff/manage-salary', element: <ManageSalary />
      },
      {
        path: 'staff/concerns', element: <Concerns />
      },
      {
        path: 'staff/Attendance-Tracking', element: <AttendanceTracking />
      },
      {
        path: 'staff/attendance', element: <StaffAttendance />
      },
      {
        path: 'returns/add-damage', element: <AddDamage />
      },
      {
        path: 'returns/view-damage-reports', element: <Items />
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
