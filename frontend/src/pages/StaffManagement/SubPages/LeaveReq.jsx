import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border border-red-200";
      case "Pending":
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

function ManageLeave() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("table");
  const [date, setDate] = useState(new Date());
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all leave requests on mount
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to view this page");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/leaves/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Log the raw response for debugging
          const text = await response.text();
          console.error("Raw response:", text);
          let errorData;
          try {
            errorData = JSON.parse(text);
          } catch (e) {
            throw new Error("Server returned an unexpected response: " + text);
          }
          throw new Error(errorData.message || "Failed to fetch leave requests");
        }

        const data = await response.json();
        setLeaveRequests(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Unauthorized") || err.message.includes("Access denied")) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [navigate]);

  // Filter leave requests based on search term
  const filteredRequests = leaveRequests.filter((request) =>
    request.employeeId.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date without date-fns
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatMonthYear = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Calculate duration
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
    return `${days} days`;
  };

  // Get leave requests for the selected date
  const getDateLeaveRequests = (date) => {
    if (!date) return [];

    return leaveRequests.filter((request) => {
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      const selectedDate = new Date(date);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      return selectedDate >= startDate && selectedDate <= endDate;
    });
  };

  const dateLeaveRequests = getDateLeaveRequests(date);

  const handleApproveClick = (id) => {
    setSelectedRequestId(id);
    setApproveModalOpen(true);
  };

  const handleRejectClick = (id) => {
    setSelectedRequestId(id);
    setRejectModalOpen(true);
  };

  const handleApprove = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/leaves/${selectedRequestId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Approved" }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Raw response:", text);
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch (e) {
          throw new Error("Server returned an unexpected response: " + text);
        }
        throw new Error(errorData.message || "Failed to approve leave request");
      }

      const updatedRequest = await response.json();
      setLeaveRequests(
        leaveRequests.map((request) =>
          request._id === selectedRequestId ? updatedRequest : request
        )
      );
      setApproveModalOpen(false);
      alert("Leave request approved");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/leaves/${selectedRequestId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Rejected" }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Raw response:", text);
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch (e) {
          throw new Error("Server returned an unexpected response: " + text);
        }
        throw new Error(errorData.message || "Failed to reject leave request");
      }

      const updatedRequest = await response.json();
      setLeaveRequests(
        leaveRequests.map((request) =>
          request._id === selectedRequestId ? updatedRequest : request
        )
      );
      setRejectModalOpen(false);
      alert("Leave request rejected");
    } catch (err) {
      setError(err.message);
    }
  };

  // Helper function to generate calendar days
  const generateCalendarDays = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push(dayDate);
    }

    return days;
  };

  // Check if a day has any leave requests
  const isLeaveDay = (day) => {
    if (!day) return false;

    return leaveRequests.some((request) => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      day.setHours(0, 0, 0, 0);

      return day >= start && day <= end;
    });
  };

  // Handle day click in calendar
  const handleDayClick = (day) => {
    if (day) {
      setDate(day);
    }
  };

  // Download leave report for an employee
  const handleDownloadReport = async (employeeId, employeeName) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8000/leaves/report/${employeeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Raw response:", text);
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch (e) {
          throw new Error("Server returned an unexpected response: " + text);
        }
        throw new Error(errorData.message || "Failed to download report");
      }

      // Expecting a PDF response, not JSON
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Leave_Report_${employeeName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  // Modal component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const getPurpleGradientClass = () => {
    return "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white";
  };

  if (isLoading) {
    return <div className="text-center p-5 text-gray-600">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Manage Leave Requests</h1>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 border-b-2 ${
            activeTab === "table"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600"
          }`}
          onClick={() => setActiveTab("table")}
        >
          Table View
        </button>
        <button
          className={`py-2 px-4 border-b-2 ${
            activeTab === "calendar"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600"
          }`}
          onClick={() => setActiveTab("calendar")}
        >
          Calendar View
        </button>
      </div>

      {activeTab === "table" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">Leave Requests</h2>
              <div className="relative w-full sm:w-64">
                <svg
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by employee..."
                  className="pl-8 w-full h-10 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {request.employeeId.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={
                          request.leaveType === "Annual Leave"
                            ? "text-blue-600"
                            : request.leaveType === "Sick Leave"
                            ? "text-red-600"
                            : "text-amber-600"
                        }
                      >
                        {request.leaveType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <span>
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                        <br />
                        <span className="text-xs text-gray-500">
                          ({calculateDuration(request.startDate, request.endDate)})
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {request.status === "Pending" && (
                          <>
                            <button
                              className={`px-3 py-1 text-sm rounded-md ${getPurpleGradientClass()} flex items-center`}
                              onClick={() => handleApproveClick(request._id)}
                            >
                              <svg
                                className="mr-1 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Approve
                            </button>
                            <button
                              className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() => handleRejectClick(request._id)}
                            >
                              <svg
                                className="mr-1 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Reject
                            </button>
                          </>
                        )}
                        {request.status !== "Pending" && (
                          <span className="text-sm text-gray-500 italic">
                            {request.status === "Approved" ? "Approved" : "Rejected"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() =>
                          handleDownloadReport(request.employeeId._id, request.employeeId.fullName)
                        }
                      >
                        Download Report
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No leave requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 md:col-span-2">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Leave Calendar</h2>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  {formatMonthYear(date)}
                </h3>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-gray-500 text-sm py-2"
                  >
                    {day}
                  </div>
                ))}
                {generateCalendarDays().map((day, i) => (
                  <div
                    key={i}
                    className={`h-12 border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                      !day
                        ? "border-transparent"
                        : isLeaveDay(day)
                        ? "bg-purple-50 text-purple-700 font-medium"
                        : "hover:bg-gray-50 text-gray-800"
                    } ${
                      day &&
                      day.getDate() === date.getDate() &&
                      day.getMonth() === date.getMonth()
                        ? "ring-2 ring-purple-500"
                        : ""
                    }`}
                    onClick={() => handleDayClick(day)}
                  >
                    {day && day.getDate()}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {formatDate(date)}
              </h2>
            </div>
            <div className="p-6">
              {dateLeaveRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No leave requests for this date
                </p>
              ) : (
                <div className="space-y-4">
                  {dateLeaveRequests.map((request) => (
                    <div
                      key={request._id}
                      className="border border-gray-200 rounded-lg p-3 space-y-2"
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-800">
                          {request.employeeId.fullName}
                        </h3>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-sm text-gray-500">{request.leaveType} Leave</p>
                      <p className="text-sm text-gray-700">{request.reason}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </p>
                      {request.attachmentUrl && (
                        <a
                          href={request.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          View Proof Document
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Approve Leave Request"
      >
        <p className="mb-4 text-gray-700">
          Are you sure you want to approve this leave request?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
            onClick={() => setApproveModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-md ${getPurpleGradientClass()}`}
            onClick={handleApprove}
          >
            Approve
          </button>
        </div>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Leave Request"
      >
        <p className="mb-4 text-gray-700">
          Are you sure you want to reject this leave request?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
            onClick={() => setRejectModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      </Modal>

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
    </div>
  );
}

export default ManageLeave;