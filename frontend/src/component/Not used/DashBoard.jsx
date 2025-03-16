/*import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import { Route, Router, Routes, useNavigate, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import WarehouseManagement from '../pages/WarehouseManagement';
import VehicleFleetManagement from '../pages/VehicleFleetManagement';
import DeliveryManagement from '../pages/DeliveryManagement';
import InventoryManagement from '../pages/InventoryManagement';
import StaffManagement from '../pages/StaffManagement';
import SupplierManagement from '../pages/SupplierManagement';
import ReturnDamageHandling from '../pages/ReturnDamageHandling';
import Help from '../pages/Help';
import Picture1 from '../assets/Picture1.png';

const NAVIGATION = [
    { kind: 'header', title: 'Main Sections' },
    { segment: '/*', title: 'Dashboard', icon: <DashboardIcon /> },
    { segment: 'warehouse-management', title: 'Warehouse Management', icon: <DashboardIcon /> },
    { segment: 'fleet-management', title: 'Vehicle Fleet Management', icon: <DashboardIcon /> },
    { segment: 'delivery', title: 'Delivery Management', icon: <DashboardIcon /> },
    { segment: 'inventory', title: 'Inventory Management', icon:<DashboardIcon /> },
    { segment: 'staff', title: 'Staff Management', icon: <DashboardIcon /> },
    { segment: 'suppliers', title: 'Supplier Management', icon: <DashboardIcon /> },
    { segment: 'return&damage', title: 'Return & Damage Handling', icon: <DashboardIcon /> },
    { segment: 'help', title: 'Help', icon: <DashboardIcon /> }
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});



const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function DashboardLayoutBasic(props) {
    const navigate = useNavigate();  // 🔹 Using React Router's navigation
    const location = useLocation(); // 🔹 Get current URL path

    const router = {
        pathname: location.pathname, // Current route path
        searchParams: new URLSearchParams(location.search),
        navigate: (path) => navigate(path), // Correctly updates the route
    };

    return (
        <AppProvider 
        navigation={NAVIGATION}
        theme={demoTheme}
        router={router}

        branding={{
          logo: <img src={Picture1} alt="Logo" className='w-10 h-56' />,
          title: 'GrocerEase Lanka',
          homeUrl: '/toolpad/core/introduction',
        }}
        >
      <DashboardLayout title="GrocerEase Lanka">
        <PageContainer >
            <Routes>
                <Route path='/*' element={<Home/>}/>
                <Route path='warehouse-management' element={<WarehouseManagement/>}/>
                <Route path='fleet-management' element={<VehicleFleetManagement/>}/>
                <Route path='delivery' element={<DeliveryManagement/>}/>
                <Route path='inventory' element={<InventoryManagement/>}/>
                <Route path='staff' element={<StaffManagement/>}/>
                <Route path='suppliers' element={<SupplierManagement/>}/>
                <Route path='return&damage' element={<ReturnDamageHandling/>}/>
                <Route path='help' element={<Help/>}/>
                
            </Routes>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}*/


import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Warehouse, 
  Truck, 
  PackageSearch, 
  Boxes, 
  Users, 
  Factory, 
  RotateCcw,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import Home from '../pages/Home';
import WarehouseManagement from '../pages/WarehouseManagement';
import VehicleFleetManagement from '../pages/VehicleFleetManagement';
import DeliveryManagement from '../pages/DeliveryManagement';
import InventoryManagement from '../pages/InventoryManagement';
import StaffManagement from '../pages/StaffManagement';
import SupplierManagement from '../pages/SupplierManagement';
import ReturnDamageHandling from '../pages/ReturnDamageHandling';
import Help from '../pages/Help';
import logo from '../assets/Picture1.png';

// Placeholder components - replace with actual components
/*const Home = () => <div className="p-6">Dashboard Content</div>;
const WarehouseManagement = () => <div className="p-6">Warehouse Management Content</div>;
const VehicleFleetManagement = () => <div className="p-6">Fleet Management Content</div>;
const DeliveryManagement = () => <div className="p-6">Delivery Management Content</div>;
const InventoryManagement = () => <div className="p-6">Inventory Management Content</div>;
const StaffManagement = () => <div className="p-6">Staff Management Content</div>;
const SupplierManagement = () => <div className="p-6">Supplier Management Content</div>;
const ReturnDamageHandling = () => <div className="p-6">Return & Damage Handling Content</div>;
const Help = () => <div className="p-6">Help Content</div>;*/

const NAVIGATION = [
  { path: '/', title: 'Dashboard', icon: LayoutDashboard },
  { path: '/warehouse', title: 'Warehouse Management', icon: Warehouse },
  { path: '/fleet', title: 'Vehicle Fleet Management', icon: Truck },
  { path: '/delivery', title: 'Delivery Management', icon: PackageSearch },
  { path: '/inventory', title: 'Inventory Management', icon: Boxes },
  { path: '/staff', title: 'Staff Management', icon: Users },
  { path: '/suppliers', title: 'Supplier Management', icon: Factory },
  { path: '/returns', title: 'Return & Damage Handling', icon: RotateCcw },
  { path: '/help', title: 'Help', icon: HelpCircle }
];

function DashboardLayout1() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white shadow-xl transition-transform duration-300 z-40
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:w-64 w-72
      `}>
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-gray-200">
          <div className="flex items-center space-x-2">

            <img src={logo} size={5} className='text-blue-600 w-20 h-20'/>
            <span className="text-2xl font-bold text-gray-800">GrocerEase Lanka</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {NAVIGATION.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon size={24} />
                <span className="font-medium">{item.title}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`
        transition-all duration-300
        ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
        min-h-screen bg-gray-50
      `}>
        {/* Header */}
        <header className="h-20 bg-white shadow-sm flex items-center px-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {NAVIGATION.find(item => item.path === location.pathname)?.title || 'Dashboard'}
          </h1>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/warehouse" element={<WarehouseManagement/>} />
            <Route path="/fleet" element={<VehicleFleetManagement/>} />
            <Route path="/delivery" element={<DeliveryManagement/>} />
            <Route path="/inventory" element={<InventoryManagement/>} />
            <Route path="/staff" element={<StaffManagement/>} />
            <Route path="/suppliers" element={<SupplierManagement/>} />
            <Route path="/returns" element={<ReturnDamageHandling/>} />
            <Route path="/help" element={<Help/>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}


export default DashboardLayout1;