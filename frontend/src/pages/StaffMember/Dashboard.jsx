import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'; // Removed Navigate since it's not used
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

const quickAccessCards = [
  {
    icon: UserCircle,
    title: 'profile',
    description: 'View and edit your profile',
    path: 'profile',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Calendar,
    title: 'Request Leave',
    description: 'Submit leave requests',
    path: 'leave-request',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: FileText,
    title: 'Pay Sheet',
    description: 'Access your payslips',
    path: 'paysheet',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: MessageSquare,
    title: 'Any Concern',
    description: 'Chat with management',
    path: 'concerns',
    color: 'from-orange-500 to-red-600',
  },
  {
    icon: QrCode,
    title: 'My QR',
    description: 'View attendance QR code',
    path: 'my-qr',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: Package,
    title: 'Something',
    description: 'Coming soon',
    path: 'something',
    color: 'from-gray-500 to-slate-600',
  },
];

const tasks = [
  {
    id: 1,
    title: 'Inventory Check - Zone A',
    status: 'completed',
    time: '9:00 AM',
  },
  {
    id: 2,
    title: 'Package Sorting',
    status: 'pending',
    time: '11:00 AM',
  },
  {
    id: 3,
    title: 'Shipment Verification',
    status: 'pending',
    time: '2:00 PM',
  },
];

export default function Dashboard() {
  // Move hooks inside the component
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserData = () => {
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
          throw new Error("Full name not found in token");
        }
        setFullName(decoded.fullName);
      } catch (err) {
        console.error("Error decoding token:", err);
        setError("Invalid token");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [navigate]);

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  }

  const location = useLocation();

  const isBaseRoute = location.pathname === "/dashboard";

  return (
    <div className="px-8 py-5">

    {isBaseRoute && (

   <div>
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {fullName} 👋</h1>
        <p className="text-gray-600 mt-2">Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {quickAccessCards.map((card) => (
          <Link
            key={card.title}
            to={`/dashboard/${card.path}`}
            className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${card.color}`}
            >
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{card.description}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Daily Tasks</h2>
          <Link
            to="/tasks"
            className="text-sm text-blue-600 hover:text-blue-700"
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
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.time}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.status === 'completed'
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
       )};
      
       
      <main>
        <Outlet/>
      </main>
    </div>
  );
}