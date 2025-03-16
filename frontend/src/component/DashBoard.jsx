import * as React from 'react';
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
}