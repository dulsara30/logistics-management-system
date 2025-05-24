import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layouts
import RootLayout from './layouts/root.layout.jsx';
import DashboardLayout from './component/DashBoard1.jsx';
import StaffLayout from './layouts/staff.layout.jsx';

// Pages
import Home from './pages/Home/Home.jsx';
import WarehouseManagement from './pages/WarehouseManagement/WarehouseManagement.jsx';
import VehicleFleetManagement from './pages/VehicleFleet/VehicleFleetManagement.jsx';
import DeliveryManagement from './pages/DeliveryScheduling/DeliveryManagement.jsx';
import InventoryManagement from './pages/InventoryManagement/InventoryManagement.jsx';
import StaffManagement from './pages/StaffManagement/StaffManagement.jsx';
import SupplierManagement from './pages/SupplierManagement/SupplierManagement.jsx';
import Help from './pages/Help/Help.jsx';
import VehicleRegistrationForm from './pages/VehicleFleet/VehicleRegistration.jsx';
import Vehicleprofile from './pages/VehicleFleet/VehicleProfile.jsx';
import NewDeliverySchedule from './pages/DeliveryScheduling/SchedulingForm.jsx';
import DeliveryScheduleProfile from './pages/DeliveryScheduling/ScheduleDetailProfile.jsx';
import VehicleMaintenanceForm from './pages/VehicleFleet/VehicleMaintainance.jsx';
import UpdateVehicleMaintenanceForm from './pages/VehicleFleet/VehicleMaintenanceUpdate.jsx';
import AddSupplier from './pages/SupplierManagement/AddSupplier.jsx';
import ReturnForm from './pages/Return&DamageHandling/ReturnForm.jsx';
import DamageHandling from './pages/Return&DamageHandling/DamageHandling.jsx';
import AddDamage from './pages/Return&DamageHandling/AddDamage.jsx';
import Items from './pages/Return&DamageHandling/items.jsx';
import ReturnReport from './pages/Return&DamageHandling/ReturnReport.jsx';
import DeliveryManagementEmployee from './component/DeliveryScheduling/DeliveryManagementEmployee.jsx'
import DeliveryScheduleUpdate from './component/DeliveryScheduling/DeliveryScheduleEmp.jsx'

// Staff Pages
import ManageStaff from './pages/StaffManagement/SubPages/ManageStaff.jsx';
import AddStaff from './pages/StaffManagement/SubPages/AddStaff.jsx';
import AssignTask from './pages/StaffManagement/SubPages/AssignTask.jsx';
import LeaveReq from './pages/StaffManagement/SubPages/LeaveReq.jsx';
import ManageSalary from './pages/StaffManagement/SubPages/ManageSalary.jsx';
import Concerns from './pages/StaffManagement/SubPages/Concerns.jsx';
import AttendanceTracking from './pages/StaffManagement/SubPages/AttendanceTracking.jsx';
import StaffAttendance from './pages/StaffManagement/SubPages/StaffAttendanceTracking.jsx';

// Authentication Pages
import Login from './pages/login/login.jsx';
import Unauthorized from './pages/login/Unauthorized.jsx';

// Staff Member Pages
import Dashboard from './pages/StaffMember/Dashboard.jsx';
import Profile from './pages/StaffMember/Profile.jsx';
import QRCode from './pages/StaffMember/QRCode.jsx';
import LeaveRequest from './pages/StaffMember/leaveRequest.jsx';

// Components
import ProtectedRoute from './component/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />
  },
  {
    element: <RootLayout />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                <Home />
              </ProtectedRoute>
            )
          },
          {
            path: "warehouse",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                <WarehouseManagement />
              </ProtectedRoute>
            )
          },
          {
            path: "fleet",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                <VehicleFleetManagement />
              </ProtectedRoute>
            )
          },
          {
            path: "fleet/vehicleRegistration",
            element: <VehicleRegistrationForm />
          },
          {
            path: "fleet/VehicleProfile/:VehicleNumber",
            element: <Vehicleprofile />
          },
          {
            path: "fleet/vehicleMaintenance",
            element: <VehicleMaintenanceForm />
          },
          {
            path: "fleet/VehicleProfile/:VehicleNumber/vehicleMaintenance",
            element: <VehicleMaintenanceForm />
          },
          {
            path: "fleet/VehicleProfile/:VehicleNumber/vehicleMaintenance/:MaintenanceID",
            element: <UpdateVehicleMaintenanceForm />
          },
          {
            path: "delivery",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager", "Driver"]}>
                <DeliveryManagement />
              </ProtectedRoute>
            )
          },
          {
            path: "delivery/NewDeliveryScheduling",
            element: <NewDeliverySchedule />
          },
          {
            path: "delivery/DeliveryProfile/:ScheduleID",
            element: <DeliveryScheduleProfile />
          },
          {
            path: "inventory",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                <InventoryManagement />
              </ProtectedRoute>
            )
          },
          {
            path: "staff",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                <StaffManagement />
              </ProtectedRoute>
            ),
            children: [
              {
                path: "manage-staff",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                    <ManageStaff />
                  </ProtectedRoute>
                ),
              },
              {
                path: "add-staff",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                    <AddStaff />
                  </ProtectedRoute>
                ),
              },
              {
                path: "assign-tasks",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                    <AssignTask />
                  </ProtectedRoute>
                ),
              },
              {
                path: "leave-requests",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                    <LeaveReq />
                  </ProtectedRoute>
                ),
              },
              {
                path: "manage-salary",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                    <ManageSalary />
                  </ProtectedRoute>
                ),
              },
              {
                path: "concerns",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                    <Concerns />
                  </ProtectedRoute>
                ),
              },
              {
                path: "Attendance-Tracking",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                    <AttendanceTracking />
                  </ProtectedRoute>
                ),
              },
              {
                path: "attendance",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                    <StaffAttendance />
                  </ProtectedRoute>
                ),
              }
            ],
          },
          {
            path: "suppliers",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager"]}>
                <SupplierManagement />
              </ProtectedRoute>
            ),
            children: [
              { path: "Add-Supplier", element: <AddSupplier /> }
            ]
          },
          {
            path: "returns",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager"]}>
                <DamageHandling />
              </ProtectedRoute>
            ),
            children: [
              {
                path: "add-damage",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager"]}>
                    <AddDamage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "view-damage-reports",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                    <Items />
                  </ProtectedRoute>
                ),
              },
              {
                path: "return-form",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                    <ReturnForm />
                  </ProtectedRoute>
                )
              },
              {
                path: "view-returned-items",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                    <ReturnReport />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          {
            path: "help",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager"]}>
                <Help />
              </ProtectedRoute>
            )
          }
        ]
      }
    ]
  },
  {
    element: <StaffLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={["Driver", "Maintenance Staff", "Other Staff"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "my-qr",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager", "Driver", "Maintenance Staff", "Other Staff"]}>
                <QRCode />
              </ProtectedRoute>
            ),
          },
          {
            path: "leave-request",
            element: (
              <ProtectedRoute allowedRoles={["Driver", "Maintenance Staff", "Other Staff"]}>
                <LeaveRequest />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager", "Driver", "Maintenance Staff", "Other Staff"]}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "deliveryEmp",
        element: (
          <ProtectedRoute allowedRoles={["Driver"]}>
            <DeliveryManagementEmployee />
          </ProtectedRoute>
        )
      },
      {
        path: "deliveryEmp/DeliveryProfile/:ScheduleID",
        element: (
          <ProtectedRoute allowedRoles={["Driver"]}>
            <DeliveryScheduleUpdate />
          </ProtectedRoute>
        )
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);