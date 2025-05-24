import * as React from 'react';
import { NavLink, useLocation, useNavigate, Outlet } from 'react-router-dom';
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
  X,
} from 'lucide-react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { jwtDecode } from 'jwt-decode';
import logo from '../assets/Picture1.png';
import HeaderSec from './HeaderSec.jsx';

// Navigation items
const NAVIGATION = [
  { path: '/', title: 'Dashboard', icon: LayoutDashboard },
  { path: '/warehouse', title: 'Warehouse Management', icon: Warehouse },
  { path: '/fleet', title: 'Vehicle Fleet Management', icon: Truck },
  { path: '/delivery', title: 'Delivery Management', icon: PackageSearch },
  { path: '/inventory', title: 'Inventory Management', icon: Boxes },
  { path: '/staff', title: 'Staff Management', icon: Users },
  { path: '/suppliers', title: 'Supplier Management', icon: Factory },
  { path: '/returns', title: 'Return & Damage Handling', icon: RotateCcw },
  { path: '/help', title: 'Help', icon: HelpCircle },
  // { path: '/fleet/vehicleRegistration', title: 'Vehicle Registration', icon: HelpCircle },
];

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [fullName, setFullName] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Check token expiration
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
        setIsLoading(false);
        return;
      }

      if (!decoded.fullName) {
        alert('Invalid token. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
        setIsLoading(false);
        return;
      }

      setFullName(decoded.fullName);
      setIsLoading(false);
    } catch (err) {
      console.error('Token decoding failed:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/login');
      setIsLoading(false);
    }
  }, [navigate]);

  // Show loading state while validating token
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl transition-transform duration-300 z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:w-72 w-72
        `}
      >
        {/* Logo */}
        <NavLink to="/" className="flex items-center justify-center h-20 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="GrocerEase Lanka Logo" className="w-20 h-20" />
            <span className="text-xl font-bold text-gray-800">GrocerEase Lanka</span>
          </div>
        </NavLink>

        {/* User Info */}
        <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Welcome back,</p>
            <h2 className="text-lg font-semibold text-gray-800">{fullName || 'User'}</h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          {NAVIGATION.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                <Icon size={28} color={isActive ? '#1976d2' : '#6b7280'} />
                <Typography
                  variant="subtitle1"
                  fontWeight={isActive ? 'bold' : 'medium'}
                  color={isActive ? 'primary' : 'text.secondary'}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {item.title}
                </Typography>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300
          ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'}
          min-h-screen bg-gray-50
        `}
      >
        <HeaderSec />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;