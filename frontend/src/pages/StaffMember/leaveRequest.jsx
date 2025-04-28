import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function LeaveRequest() {
  const [leaveData, setLeaveData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    attachment: null,
  });
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState({
    totalLeavesTaken: 0,
    remainingLeaves: 21,
  });
  const [previousRequests, setPreviousRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const navigate = useNavigate();

  // Fetch leave balance and previous requests on mount
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
        // Fetch leave balance
        const balanceResponse = await fetch("http://localhost:8000/leaves/balance", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!balanceResponse.ok) {
          const errorData = await balanceResponse.json();
          throw new Error(errorData.message || "Failed to fetch leave balance");
        }

        const balanceData = await balanceResponse.json();
        setLeaveBalance(balanceData);

        // Fetch previous leave requests
        const requestsResponse = await fetch("http://localhost:8000/leaves/my-requests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!requestsResponse.ok) {
          const errorData = await requestsResponse.json();
          throw new Error(errorData.message || "Failed to fetch leave requests");
        }

        const requestsData = await requestsResponse.json();
        setPreviousRequests(requestsData);
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

  // Handle input changes
  const handleInputChange = (e) => {
    setLeaveData({
      ...leaveData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setLeaveData({
      ...leaveData,
      attachment: file,
    });
  };

  // Calculate leave days between start and end dates
  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to submit a leave request");
      navigate("/login", { replace: true });
      return;
    }

    // Calculate leave days
    const leaveDays = calculateLeaveDays(leaveData.startDate, leaveData.endDate);
    const newTotalLeavesTaken = leaveBalance.totalLeavesTaken + leaveDays;

    // Check leave limit
    if (newTotalLeavesTaken > 21 && !editingRequestId) {
      setWarning(
        `Warning: You have exceeded the annual leave limit of 21 days. You are requesting ${leaveDays} more days, making a total of ${newTotalLeavesTaken} days taken this year. You can still submit this request, but it may be subject to approval.`
      );
      if (!window.confirm("You have exceeded the annual leave limit. Proceed with the request?")) {
        return;
      }
    }

    // Prepare form data for submission
    const formData = new FormData();
    formData.append("leaveType", leaveData.leaveType);
    formData.append("startDate", leaveData.startDate);
    formData.append("endDate", leaveData.endDate);
    formData.append("reason", leaveData.reason);
    if (leaveData.attachment) {
      formData.append("attachment", leaveData.attachment);
    }

    try {
      const url = editingRequestId
        ? `http://localhost:8000/leaves/${editingRequestId}`
        : "http://localhost:8000/leaves";
      const method = editingRequestId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit leave request");
      }

      const result = await response.json();
      alert(editingRequestId ? "Leave request updated successfully" : "Leave request submitted successfully");

      // Reset form
      setLeaveData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
        attachment: null,
      });
      setEditingRequestId(null);
      setWarning(null);

      // Refresh leave balance and requests
      const balanceResponse = await fetch("http://localhost:8000/leaves/balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const balanceData = await balanceResponse.json();
      setLeaveBalance(balanceData);

      const requestsResponse = await fetch("http://localhost:8000/leaves/my-requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const requestsData = await requestsResponse.json();
      setPreviousRequests(requestsData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit request
  const handleEdit = (request) => {
    setLeaveData({
      leaveType: request.leaveType,
      startDate: request.startDate.split("T")[0], // Convert ISO date to YYYY-MM-DD
      endDate: request.endDate.split("T")[0],
      reason: request.reason,
      attachment: null, // Cannot prefill file input
    });
    setEditingRequestId(request._id);
  };

  // Handle delete request
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave request?")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/leaves/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete leave request");
      }

      alert("Leave request deleted successfully");
      setPreviousRequests(previousRequests.filter((req) => req._id !== id));

      // Refresh leave balance
      const balanceResponse = await fetch("http://localhost:8000/leaves/balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const balanceData = await balanceResponse.json();
      setLeaveBalance(balanceData);
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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Leave Request</h1>

      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      {warning && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          {warning}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave request form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 mb-6 flex items-center">
            Request a Leave
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Leave Type */}
              <div className="space-y-2">
                <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">
                  Leave Type
                </label>
                <select
                  id="leaveType"
                  name="leaveType"
                  value={leaveData.leaveType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="" disabled>
                    Select leave type
                  </option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Personal Leave">Personal Leave</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={leaveData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={leaveData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* File attachment */}
              <div className="space-y-2">
                <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
                  Attachment (Optional)
                </label>
                <input
                  id="attachment"
                  name="attachment"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-500">
                  Upload supporting documents (e.g., medical certificate)
                </p>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2 mt-6">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason for Leave
              </label>
              <textarea
                id="reason"
                name="reason"
                value={leaveData.reason}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Please provide details about your leave request..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg hover:from-purple-500 hover:to-purple-700 transition-colors duration-200"
              >
                {editingRequestId ? "Update Request" : "Submit Request"}
              </button>
            </div>
          </form>
        </div>

        {/* Leave balance & history */}
        <div className="space-y-6">
          {/* Leave balance */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Leave Balance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Leaves Taken (This Year)</span>
                <span className="font-medium">{leaveBalance.totalLeavesTaken} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Remaining Leaves</span>
                <span className="font-medium">{leaveBalance.remainingLeaves} days</span>
              </div>
            </div>
          </div>

          {/* Previous requests */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Previous Requests</h3>
            <div className="space-y-4">
              {previousRequests.length === 0 ? (
                <p className="text-gray-500 text-center">No previous leave requests</p>
              ) : (
                previousRequests.map((request) => (
                  <div key={request._id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{request.leaveType}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(request.startDate).toLocaleDateString()} -{" "}
                          {new Date(request.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          request.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : request.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <p>{request.reason}</p>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      {request.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleEdit(request)}
                            className="text-blue-600 hover:underline text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(request._id)}
                            className="text-red-600 hover:underline text-xs"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {request.attachmentUrl && (
                        <a
                          href={request.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          View Attachment
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveRequest;