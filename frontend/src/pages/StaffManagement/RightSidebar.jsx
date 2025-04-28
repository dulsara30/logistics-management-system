import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function RightSidebar() {
  const [stats, setStats] = useState({
    totalAttendance: 0,
    totalAbsents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch today's stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view this page");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/analytics/today-stats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch today’s stats");
        }

        const data = await response.json();
        setStats({
          totalAttendance: data.totalAttendance,
          totalAbsents: data.totalAbsents,
        });
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Unauthorized")) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <aside className="w-80 bg-white shadow-lg p-6">
        <div className="text-center text-gray-600">Loading...</div>
      </aside>
    );
  }

  // Error state
  if (error) {
    return (
      <aside className="w-80 bg-white shadow-lg p-6">
        <div className="text-center text-red-600">Error: {error}</div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-white shadow-lg p-6">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
        <h2 className="text-xl font-semibold mb-4">Attendance Tracking</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Total Attendance</span>
            <span className="font-bold">{stats.totalAttendance}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Absents</span>
            <span className="font-bold">{stats.totalAbsents}</span>
          </div>
        </div>
        <Link to="Attendance-Tracking">
          <button className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition-colors duration-200">
            More details
          </button>
        </Link>
      </div>

      <div className="mt-6">
        <Link to="attendance">
          <button className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors duration-200">
            <Calendar size={18} className="mr-2" />
            Take Attendance
          </button>
        </Link>
      </div>
    </aside>
  );
}

export default RightSidebar;