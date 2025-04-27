import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Breadcrumbs from './Breadcrumbs'; // Assuming this component exists
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function HeaderSec() {
  const NAVIGATION = [
    { path: '/', title: 'Dashboard' },
    { path: '/warehouse', title: 'Warehouse Management' },
    { path: '/fleet', title: 'Vehicle Fleet Management' },
    { path: '/delivery', title: 'Delivery Management' },
    { path: '/inventory', title: 'Inventory Management' },
    { path: '/staff', title: 'Staff Management' },
    { path: '/suppliers', title: 'Supplier Management' },
    { path: '/returns', title: 'Return & Damage Handling' },
    { path: '/help', title: 'Help' },
  ];

  const navigate = useNavigate();
  const location = useLocation(); // Added to get the current path
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to view this page");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded.fullName) {
        alert("Something went wrong. Please try again");
        navigate("/login");
        return;
      }

      setFullName(decoded.fullName);
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (isLoading) {
    return <div className="text-center py-4 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  }

  const firstLetter = fullName.charAt(0);

  return (
    <header className="h-20 bg-white shadow-sm flex items-center px-6 justify-between">
      {/* Left Section: Title and Breadcrumbs */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          {NAVIGATION.find(item => item.path === location.pathname)?.title || 'Dashboard'}
        </h1>
        <Breadcrumbs />
      </div>

      {/* Right Section: Avatar and Logout Button */}
      <div className="flex items-center space-x-4">
        {/* User Avatar */}
        <Link to="/profile">
          <Avatar className="bg-blue-600 text-white">{firstLetter}</Avatar>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </header>
  );
}