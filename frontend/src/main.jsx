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
import AddSupplier from './pages/SupplierManagement/AddSupplier.jsx'
import ItemsList from './pages/Return&DamageHandling/ItemList.jsx'
import ReturnList from './pages/Return&DamageHandling/ReturnList.jsx'
import ReturnForm from './pages/Return&DamageHandling/ReturnList.jsx'
import DamageForm from './pages/Return&DamageHandling/DamageForm.jsx'

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children:[
      {
        element: <DashboardLayout/>,
        children:[
          {path:"/", element:<Home/>, },
          {path:"warehouse", element:<WarehouseManagement/>, },
          {path:"fleet", element:<VehicleFleetManagement/>,},
          {path:"delivery", element:<DeliveryManagement/>,},
          {path:"inventory", element:<InventoryManagement/>,},
          {path:"staff", element:<StaffManagement/>,},
          {path:"suppliers", element:<SupplierManagement/>,
            children:[
              {path:"Add-Supplier", element:<AddSupplier/>}
            ]
          },
          {path:"returns/", element:<ReturnDamageHandling/>,
                children:[
                  {path:"Damage-Form",element:<DamageForm/> ,},
                  {path:"item-list/*",element:<ItemsList/> ,
                    children: [
                      {path:"Return-Form",element:<ReturnForm/> ,},
                    ]
                  }, 
                ],

          },     
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
