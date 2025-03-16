import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './layouts/root.layout.jsx'
import MainLayout from './layouts/main.layout.jsx'
import Home from './pages/Home.jsx'
import WarehouseManagement from './pages/WarehouseManagement.jsx'
import VehicleFleetManagement from './pages/VehicleFleetManagement.jsx'
import DeliveryManagement from './pages/DeliveryManagement.jsx'
import InventoryManagement from './pages/InventoryManagement.jsx'
import StaffManagement from './pages/StaffManagement.jsx'
import SupplierManagement from './pages/SupplierManagement.jsx'
import ReturnDamageHandling from './pages/ReturnDamageHandling.jsx'
import Help from './pages/Help.jsx'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import DashboardLayoutBasic from './component/DashBoard.jsx'

const router = createBrowserRouter([


  {
    element: <RootLayout/>,
    children:[
      {
        element: <DashboardLayoutBasic/>,
        children:[
          {path:"/*", element:<Home/>, },
          {path:"warehouse-management", element:<WarehouseManagement/>, },
          {path:"fleet-management", element:<VehicleFleetManagement/>,},
          {path:"delivery", element:<DeliveryManagement/>,},
          {path:"inventory", element:<InventoryManagement/>,},
          {path:"staff", element:<StaffManagement/>,},
          {path:"suppliers", element:<SupplierManagement/>,},
          {path:"return&damage", element:<ReturnDamageHandling/>,},
          {path:"help", element:<Help/>,},
        ]

          /*element:<MainLayout/>,
          children:[
            {path:"", element:<Home/>, },
            {path:"warehouse-management", element:<WarehouseManagement/>, },
            {path:"fleet", element:<VehicleFleetManagement/>,},
            {path:"delivery", element:<DeliveryManagement/>,},
            {path:"inventory", element:<InventoryManagement/>,},
            {path:"staff", element:<StaffManagement/>,},
            {path:"suppliers", element:<SupplierManagement/>,},
            {path:"return&damage", element:<ReturnDamageHandling/>,},
            {path:"help", element:<Help/>,},
          ]*/
      },
    ]

  }

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
