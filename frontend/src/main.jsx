import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/root.layout.jsx';
import Home from './pages/Home/Home.jsx';
import WarehouseManagement from './pages/WarehouseManagement/WarehouseManagement.jsx';
import VehicleFleetManagement from './pages/DeliveryAndVehicleFleet/VehicleFleetManagement.jsx';
import DeliveryManagement from './pages/DeliveryAndVehicleFleet/DeliveryManagement.jsx';
import InventoryManagement from './pages/InventoryManagement/InventoryManagement.jsx';
import StaffManagement from './pages/StaffManagement/StaffManagement.jsx';
import SupplierManagement from './pages/SupplierManagement/SupplierManagement.jsx';
import ReturnDamageHandling from './pages/Return&DamageHandling/ReturnDamageHandling.jsx';
import Help from './pages/Help/Help.jsx';
import DashboardLayout from './component/DashBoard1.jsx';
import AddSupplier from './pages/SupplierManagement/AddSupplier.jsx';
import ItemsList from './pages/Return&DamageHandling/ItemList.jsx';
import ReturnForm from './pages/Return&DamageHandling/ReturnList.jsx';
import DamageForm from './pages/Return&DamageHandling/DamageForm.jsx';
import ManageStaff from './pages/StaffManagement/SubPages/ManageStaff.jsx';
import AddStaff from './pages/StaffManagement/SubPages/AddStaff.jsx';
import AssignTask from './pages/StaffManagement/SubPages/AssignTask.jsx';
import LeaveReq from './pages/StaffManagement/SubPages/LeaveReq.jsx';
import ManageSalary from './pages/StaffManagement/SubPages/ManageSalary.jsx';
import Concerns from './pages/StaffManagement/SubPages/Concerns.jsx';
import AttendanceTracking from './pages/StaffManagement/SubPages/AttendanceTracking.jsx';
import Login from './pages/login/login.jsx';
import Unauthorized from './pages/login/Unauthorized.jsx';
import StaffLayout from './layouts/staff.layout.jsx';
import Dashboard from './pages/StaffMember/Dashboard.jsx';
import Profile from './pages/StaffMember/Profile.jsx';
import ProtectedRoute from './component/ProtectedRoute.jsx';
import DamageHandling from './pages/Return&DamageHandling/DamageHandling.jsx';
import AddDamage from './pages/Return&DamageHandling/AddDamage.jsx';
import Items from './pages/Return&DamageHandling/items.jsx';
import QRCode from './pages/StaffMember/QRCode.jsx';
import StaffAttendance from './pages/StaffManagement/SubPages/StaffAttendanceTracking.jsx';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                <Home />
              </ProtectedRoute>
            ),
          },
          {
            path: "warehouse",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                <WarehouseManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: "fleet",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                <VehicleFleetManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: "delivery",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                <DeliveryManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: "inventory",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                <InventoryManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: "staff/",
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
                    <StaffAttendance/>
                  </ProtectedRoute>
                ),
              }
            ],
          },
          {
            path: "Suppliers",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager"]}>
                <SupplierManagement />
              </ProtectedRoute>
            ),
            children: [
              {
                path: "Add-Supplier",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                    <AddSupplier />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          {
            path: "returns/",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager"]}>
                <DamageHandling/>
              </ProtectedRoute>
            ),
            children: [
              {
                path: "add-damage",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager"]}>
                    <AddDamage/>
                  </ProtectedRoute>
                ),
              },
              {
                path: "view-damage-reports",
                element: (
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager", "Inventory Manager"]}>
                  <Items/>
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
            ),
          },
        ],
      },
      {
        element: <StaffLayout />,
        children: [
          {
            path: "dashboard/",
            element: (
              <ProtectedRoute allowedRoles={["Driver", "Maintenance Staff", "Other Staff"]}>
                <Dashboard />
              </ProtectedRoute>
            ),
            children: [
              {
                path: "my-qr",
                element:(
                  <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager","Inventory Manager", "Driver", "Maintenance Staff", "Other Staff"]}>
                    <QRCode/>
                  </ProtectedRoute>
                ),
              },
              
            ],
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute allowedRoles={["Business Owner", "Warehouse Manager","Inventory Manager", "Driver", "Maintenance Staff" , "Other Staff"]}>
                <Profile />
              </ProtectedRoute>
            ),
          }  
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);