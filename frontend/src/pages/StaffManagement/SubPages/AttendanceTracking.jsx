import React, { useState, useEffect } from "react";
import { Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs"; // Added import for dayjs

function AttendanceTracking() {
  const [analyticsData, setAnalyticsData] = useState({
    totalEmployees: 0,
    lateArrivalsToday: 0,
    dailySummary: [],
  });
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch analytics data and employee details on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view this page");
        navigate("/login", { replace: true });
        return;
      }

      try {
        // Fetch analytics data
        const analyticsResponse = await fetch("http://localhost:8000/analytics/attendance", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!analyticsResponse.ok) {
          const errorData = await analyticsResponse.json();
          throw new Error(errorData.message || "Failed to fetch analytics data");
        }

        const analyticsData = await analyticsResponse.json();
        setAnalyticsData(analyticsData);

        // Fetch employee-wise details
        const employeeResponse = await fetch("http://localhost:8000/analytics/employee-details", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!employeeResponse.ok) {
          const errorData = await employeeResponse.json();
          throw new Error(errorData.message || "Failed to fetch employee details");
        }

        const employeeData = await employeeResponse.json();
        setEmployeeDetails(employeeData);
        setFilteredEmployees(employeeData);
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

    fetchData();
  }, [navigate]);

  // Handle search filtering
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employeeDetails);
    } else {
      const fetchFilteredEmployees = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(
            `http://localhost:8000/analytics/employee-details?search=${encodeURIComponent(searchQuery)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch filtered employees");
          }

          const data = await response.json();
          setFilteredEmployees(data);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchFilteredEmployees();
    }
  }, [searchQuery, employeeDetails]);

  // Format date for display
  const formatDate = (dateString) => {
    return dayjs(dateString).format("YYYY-MM-DD");
  };

  // Format time for display
  const formatTime = (time) => {
    if (!time) return "N/A";
    return dayjs(time).format("hh:mm A");
  };

  // Format overtime hours
  const formatOvertime = (hours) => {
    if (hours === 0) return "0 hrs";
    return `${hours.toFixed(1)} hrs`;
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8000/analytics/export-pdf", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "attendance-report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  // Loading state
  if (isLoading) {
    return <div className="text-center p-5 text-gray-600">Loading...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Attendance Tracking</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalEmployees}</p>
            </div>
            <Users className="h-8 w-8 text-gray-700" />
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Late Arrivals Today</p>
              <p className="text-2xl font-bold text-orange-600">{analyticsData.lateArrivalsToday}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Attendance Overview Chart */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Attendance Overview (Last 5 Days)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.dailySummary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#4F46E5" name="Present" />
              <Bar dataKey="absent" fill="#EF4444" name="Absent" />
              <Bar dataKey="late" fill="#F97316" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee-wise Details */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Employee-wise Attendance</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search employee by name or NIC..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th className="px-4 py-2">Employee</th>
                <th className="px-4 py-2">NIC</th>
                {analyticsData.dailySummary.map((day) => (
                  <th key={day.date} className="px-4 py-2">
                    {formatDate(day.date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.nic} className="border-b">
                  <td className="px-4 py-2">{employee.name}</td>
                  <td className="px-4 py-2">{employee.nic}</td>
                  {employee.attendance.map((record, index) => (
                    <td key={index} className="px-4 py-2">
                      <div>
                        <p
                          className={`font-medium ${record.status === "Present"
                              ? "text-green-600"
                              : record.status === "Late"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                        >
                          {record.status}
                        </p>
                        <p className="text-xs">In: {formatTime(record.checkIn)}</p>
                        <p className="text-xs">Out: {formatTime(record.checkOut)}</p>
                        <p className="text-xs">OT: {formatOvertime(record.overtimeHours)}</p>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg hover:from-purple-500 hover:to-purple-700 transition-colors duration-200"
          >
            Export PDF
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendanceTracking;