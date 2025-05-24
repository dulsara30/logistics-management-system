import * as React from 'react';
import { useState } from 'react';
import Home from '../pages/Home/Home.jsx';
import WarehouseManagement from '../pages/WarehouseManagement/WarehouseManagement';
import VehicleFleetManagement from '../pages/DeliveryAndVehicleFleet/VehicleFleetManagement';
import DeliveryManagement from '../pages/DeliveryAndVehicleFleet/DeliveryManagement';
import InventoryManagement from '../pages/InventoryManagement/InventoryManagement';
import StaffManagement from '../pages/StaffManagement/StaffManagement';
import SupplierManagement from '../pages/SupplierManagement/SupplierManagement';
import ReturnDamageHandling from '../pages/Return&DamageHandling/ReturnDamageHandling';
import Help from '../pages/Help/Help';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

function PageContent() {
  return (

    <div className="p-6">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/warehouse" element={<WarehouseManagement />} />
        <Route path="/fleet" element={<VehicleFleetManagement />} />
        <Route path="/delivery" element={<DeliveryManagement />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="/suppliers" element={<SupplierManagement />} />
        <Route path="/returns" element={<ReturnDamageHandling />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </div>
  )
};

export default PageContent;