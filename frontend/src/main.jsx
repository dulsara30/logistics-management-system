import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './layouts/root.layout.jsx'
import Home from './pages/Home/Home.jsx'
import WarehouseManagement from './pages/WarehouseManagement/WarehouseManagement.jsx'
import VehicleFleetManagement from './pages/VehicleFleet/VehicleFleetManagement.jsx'
import DeliveryManagement from './pages/DeliveryScheduling/DeliveryManagement.jsx'
import InventoryManagement from './pages/InventoryManagement/InventoryManagement.jsx'
import StaffManagement from './pages/StaffManagement/StaffManagement.jsx'
import SupplierManagement from './pages/SupplierManagement/SupplierManagement.jsx'
import ReturnDamageHandling from './pages/Return&DamageHandling/ReturnDamageHandling.jsx'
import Help from './pages/Help/Help.jsx'
import DashboardLayout from './component/DashBoard1.jsx'
import VehicleRegistrationForm from './pages/VehicleFleet/VehicleRegistration.jsx'
import Vehicleprofile from './pages/VehicleFleet/VehicleProfile.jsx'
import NewDeliverySchedule from './pages/DeliveryScheduling/SchedulingForm.jsx'
import DeliveryScheduleProfile from './pages/DeliveryScheduling/ScheduleDetailProfile.jsx'

import VehicleMaintenanceForm from './pages/VehicleFleet/VehicleMaintainance.jsx'


const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children:[
      {
        element: <DashboardLayout/>,
        children:[
          {path:"/*", element:<Home/>, },
          {path:"warehouse", element:<WarehouseManagement/>, },
          {path:"fleet", element:<VehicleFleetManagement/>,},
          {path:"delivery", element:<DeliveryManagement/>,},
          {path:"inventory", element:<InventoryManagement/>,},
          {path:"staff", element:<StaffManagement/>,},
          {path:"suppliers", element:<SupplierManagement/>,},
          {path:"return&damage", element:<ReturnDamageHandling/>,},
          {path:"help", element:<Help/>,},
          {path:"fleet/vehicleRegistration", element:<VehicleRegistrationForm />,},
          {path:"fleet/VehicleProfile/:VehicleNumber", element:<Vehicleprofile />,},
          {path:"delivery/NewDeliveryScheduling", element:<NewDeliverySchedule />,},
          {path:"delivery/DeliveryProfile/:ScheduleID", element:<DeliveryScheduleProfile />,},
          {path:"fleet/vehicleMaintenance", element:<VehicleMaintenanceForm/>,},
          {path:"fleet/VehicleProfile/:VehicleNumber/vehicleMaintenance", element:<VehicleMaintenanceForm/>,},
        ]              
      }
    ]
      },
    ]
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
