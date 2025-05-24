import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  UserCircle,
  Calendar,
  FileText,
  MessageSquare,
  QrCode,
  Plus,
  CheckCircle,
  Clock,
  Package
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

// Define the quickAccessCards array
const quickAccessCardsBase = [
  {
    icon: UserCircle,
    title: 'Profile',
    description: 'View and edit your profile',
    path: '/profile', // Absolute path to /profile
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Calendar,
    title: 'Request Leave',
    description: 'Submit leave requests',
    path: 'dashboard/leave-request',
    color: 'from-blue-500 to-cyan-600',
  },
  // {
  //   icon: FileText,
  //   title: 'Pay Sheet',
  //   description: 'Access your payslips',
  //   path: 'paysheet',
  //   color: 'from-emerald-500 to-teal-600',
  // },
  // {
  //   icon: MessageSquare,
  //   title: 'Warehouse Maintenance',
  //   description: 'Maintain Warehouse',
  //   path: 'warehouse-maintenance',
  //   color: 'from-orange-500 to-red-600',
  // },
  {
    icon: QrCode,
    title: 'My QR',
    description: 'View attendance QR code',
    path: 'dashboard/my-qr',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: Package,
    title: 'Vehicle Fleet',
    description: 'Vehicle Fleet',
    path: 'vehicle-fleet',
    color: 'from-gray-500 to-slate-600',
  },
  // {
  //   icon: Package,
  //   title: 'Delivery Scheduling',
  //   description: 'Delivery Scheduling',
  //   path: 'delivery-scheduling',
  //   color: 'from-gray-500 to-slate-600',
  // },
];

const tasks = [
  //   {
  //     id: 1,
  //     title: 'Inventory Check - Zone A',
  //     status: 'completed',
  //     time: '9:00 AM',
  //   },
  //   {
  //     id: 2,
  //     title: 'Package Sorting',
  //     status: 'pending',
  //     time: '11:00 AM',
  //   },
  //   {
  //     id: 3,
  //     title: 'Shipment Verification',
  //     status: 'pending',
  //     time: '2:00 PM',
  //   },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserData = () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to view this page");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (!decoded.fullName) {
          throw new Error("Full name not found in token");
        }
        if (!decoded.id) {
          throw new Error("User ID not found in token");
        }
        setFullName(decoded.fullName);
        setUserId(decoded.id);
      } catch (err) {
        console.error("Error decoding token:", err);
        setError("Invalid token");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    );
  }

  const isBaseRoute = location.pathname === "/dashboard";

  return (
    <div className="px-8 py-5">
      {isBaseRoute ? (
        // Render the dashboard UI only on the base route
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {fullName} 👋</h1>
            <p className="text-gray-600 mt-2">Here's what's happening today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessCardsBase.map((card) => (
              <Link
                key={card.title}
                to={card.path}
                className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div
                  className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${card.color}`}
                >
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">{card.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{card.description}</p>
              </Link>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mt-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Daily Tasks</h2>
              <Link
                to="/tasks"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                See More
              </Link>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-orange-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.time}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                      }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Render child routes when not on the base route
        <Outlet />
      )}
    </div>
  );
}