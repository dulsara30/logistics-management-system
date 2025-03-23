import * as React from 'react';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Link, Outlet } from 'react-router-dom';
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
import Home from '../pages/Home/Home.jsx';
import WarehouseManagement from '../pages/WarehouseManagement/WarehouseManagement';
import VehicleFleetManagement from '../pages/DeliveryAndVehicleFleet/VehicleFleetManagement';
import DeliveryManagement from '../pages/DeliveryAndVehicleFleet/DeliveryManagement';
import InventoryManagement from '../pages/InventoryManagement/InventoryManagement';
import StaffManagement from '../pages/StaffManagement/StaffManagement';
import SupplierManagement from '../pages/SupplierManagement/SupplierManagement';
import ReturnDamageHandling from '../pages/Return&DamageHandling/ReturnDamageHandling';
import Help from '../pages/Help/Help';
import logo from '../assets/Picture1.png';
import PageContent from './PageContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HeaderSec from './HeaderSec.jsx';
import { jwtDecode  } from 'jwt-decode';


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

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [fullName, setFullName] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if(!token){
      navigate("/login");
      return;
    }

    try{
      const decoded = jwtDecode(token);
      if(!decoded.fullName) {
        alert("Somthing went wrong. Please try again");
        navigate("/login");
        return;
      }

      setFullName(decoded.fullName);
    }catch(err){
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    }

  }, [navigate]);

 

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
        lg:translate-x-0 lg:w-74 w-72
      `}>
        {/* Logo */}
        <Link to={"/"}>
        <div className="flex items-center justify-center h-20 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <img src={logo} className='w-20 h-20'/>
            <span className="text-xl font-bold text-gray-800">GrocerEase Lanka</span>
          </div>
        </div>
        </Link>
        {/* Navigation */}
        <nav className="p-4 space-y-2">

        <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
            
            <div>
              <p className="text-sm text-gray-600">Welcome back,</p>
              <h2 className="text-lg font-semibold text-gray-800">{fullName}</h2>
            </div>
            </div>

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

              
                 <Box display="flex" alignItems="flex-start" gap={2}>  
                      <Icon size={28} color={isActive ? "#1976d2" : "#6b7280"} />

                      <Typography 
                        variant="subtitle1" 
                        fontWeight={isActive ? 'bold' : 'medium'} 
                        color={isActive ? 'primary' : 'text.secondary'}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        {item.title}
                      </Typography>

                 
                  </Box>
               
                </button>
              );
            })}

          
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`
        transition-all duration-300
        ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'}
        min-h-screen bg-gray-50
      `}>
     <HeaderSec/>
    
        {/* Page Content */}
        
        <Outlet/>
      </main>
    </div>
  );
}



export default DashboardLayout;