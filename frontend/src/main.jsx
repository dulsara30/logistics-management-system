import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './layouts/root.layout.jsx'
import Home from './pages/Home/Home.jsx'
import WarehouseManagement from './pages/WarehouseManagement/WarehouseManagement.jsx'
import VehicleFleetManagement from './pages/DeliveryAndVehicleFleet/VehicleFleetManagement.jsx'
import DeliveryManagement from './pages/DeliveryAndVehicleFleet/DeliveryManagement.jsx'
import InventoryManagement from './pages/InventoryManagement/InventoryManagement.jsx'
import StaffManagement from './pages/StaffManagement/StaffManagement.jsx'
import SupplierManagement from './pages/SupplierManagement/SupplierManagement.jsx'
import ReturnDamageHandling from './pages/Return&DamageHandling/ReturnDamageHandling.jsx'
import Help from './pages/Help/Help.jsx'
import DashboardLayout from './component/DashBoard1.jsx'
import reportgenarate from './pages/WarehouseManagement/Report.jsx'

import WarehouseForm from './pages/WarehouseManagement/WarehouseProfile.jsx'
//import MaintenanceForm from './pages/maintainance/MaintenanceForm.jsx'


import Maintainance from './pages/WarehouseManagement/Mantainance.jsx'
import CorrectiveForm from './pages/WarehouseManagement/CorrectiveForm.jsx'
import SubmitPage from './pages/WarehouseManagement/CorrectiveSubmit.jsx'
import RoutingMaintenanceForm from './pages/WarehouseManagement/RoutingForm.jsx'
import RoutingSubmit from './pages/WarehouseManagement/RoutingSubmit.jsx'
import MaintenanceDetails from './pages/WarehouseManagement/CorrectiveDetails.jsx'


//import WarehouseForm from './pages/WarehouseManagement/WarehouseForm.jsx'
import CreateWarehouse from './pages/WarehouseManagement/CreateWarehouse.jsx'
//import MaintenanceForm from './pages/WarehouseManagement/MaintenanceForm.jsx'
import MaintenanceForm from './pages/WarehouseManagement/CreateMaintenance.jsx'
import MaintenanceFormTwo from './pages/WarehouseManagement/MaintenanceProfile.jsx'

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children:[
      {
        element: <DashboardLayout/>,
        children:[
          {path:"/*", element:<Home/>, },
          {path:"warehouse", element:<WarehouseManagement/>, },
          {path:"warehouse/Addwarehouse", element:<CreateWarehouse/>, },
          {path:"warehouse/WarehouseDetails/:WarehouseID", element:<WarehouseForm/>, },

        //  {path:"warehouse/warehouse-form/WarehouseSubmit", element:<WarehouseSubmit/>, },
        
          {path:"warehouse/Maintainance", element:<Maintainance/>, }, 
          {path:"warehouse/Maintainance/Report", element:<Maintainance/>, }, 
          {path:"warehouse/Maintainance/AddMaintenance", element:<MaintenanceForm/>, },
          {path:"warehouse/Maintainance/AddMaintenance/:requestId", element:<MaintenanceFormTwo/>, },

          
          {path:"warehouse/Maintainance/CorrectiveDetails", element:<MaintenanceDetails/>, },
          {path:"warehouse/Maintainance/Corrective-Form", element:<CorrectiveForm/>, },
          {path:"warehouse/Maintainance/Corrective-Form/CorrectiveSubmit", element:<SubmitPage/>, },
          {path:"warehouse/Maintainance/Routing-Form", element:<RoutingMaintenanceForm/>, },
          {path:"warehouse/Maintainance/Routing-Form/RoutingSubmit", element:<RoutingSubmit/>, },
          {path:"fleet", element:<VehicleFleetManagement/>,},
          {path:"delivery", element:<DeliveryManagement/>,},
          {path:"inventory", element:<InventoryManagement/>,},
          {path:"staff", element:<StaffManagement/>,},
          {path:"suppliers", element:<SupplierManagement/>,},
          {path:"return&damage", element:<ReturnDamageHandling/>,},
          {path:"help", element:<Help/>,},
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
