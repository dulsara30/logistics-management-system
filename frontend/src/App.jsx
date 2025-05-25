import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Hello from './hello.jsx'
import Sidebar from './component/sidebar.jsx'
import Home from './pages/Home.jsx'
import WarehouseManagement from './pages/WarehouseManagement.jsx'
import VehicleFleetManagement from './pages/VehicleFleetManagement.jsx'
import DeliveryManagement from './pages/DeliveryManagement.jsx'
import InventoryManagement from './pages/InventoryManagement.jsx'
import StaffManagement from './pages/StaffManagement.jsx'
import SupplierManagement from './pages/SupplierManagement.jsx'
import ReturnDamageHandling from './pages/ReturnDamageHandling.jsx'
import Help from './pages/Help.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SupplierDetails from './pages/SupplierManagement/SupplierDetails.jsx'



function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/warehouse-management" element={<WarehouseManagement />} />
            <Route path="/vehicle-fleet" element={<VehicleFleetManagement />} />
            <Route path="/delivery-management" element={<DeliveryManagement />} />
            <Route path="/inventory-management" element={<InventoryManagement />} />
            <Route path="/staff-management" element={<StaffManagement />} />
            <Route path="/supplier-management" element={<SupplierManagement />} />
            <Route path="/return-damage" element={<ReturnDamageHandling />} />
            <Route path="/help" element={<Help />} />

          </Routes>
        </main>
      </div>
    </Router>

    /* <div className="h-screen flex items-center justify-center bg-gray-900 text-white text-3xl">
       Tailwind CSS is Working! 🚀
     </div>*/



  )
}

export default App
