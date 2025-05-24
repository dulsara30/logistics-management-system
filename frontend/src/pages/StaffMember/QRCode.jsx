import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function QRCode() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch QR code and attendance data on component mount
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
        // Fetch QR code and last 5 days of attendance in one request
        const response = await fetch("http://localhost:8000/dashboard/my-qr", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401 || response.status === 403) {
            throw new Error("Unauthorized. Please log in again.");
          }
          throw new Error(errorData.message || "Failed to fetch data");
        }

        const data = await response.json();
        setQrCodeUrl(data.qrCode); // Set the QR code URL
        setAttendanceRecords(data.attendanceRecords); // Set the attendance records
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

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Format overtime hours for display
  const formatOvertime = (hours) => {
    if (hours === 0) return "0 hrs";
    return `${hours.toFixed(1)} hrs`;
  };

  // Handle QR code download
  const handleDownload = async () => {
    if (!qrCodeUrl) {
      alert("No QR code available to download.");
      return;
    }

    try {
      // Fetch the image as a blob
      const response = await fetch(qrCodeUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch QR code image");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary link to download the blob
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "qrcode.png"; // Ensure the file downloads as a .png
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err.message);
      alert("Failed to download QR code: " + err.message);
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My QR Code</h1>
        <p className="text-gray-600 mt-2">Use this QR code to mark your attendance</p>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-gray-600 mb-6 bg-none border-none cursor-pointer text-sm hover:text-gray-800 transition-colors"
      >
        <svg
          className="w-4.5 h-4.5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code Section */}
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Attendance QR Code
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Scan this code to mark your attendance
            </p>

            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR Code for attendance"
                className="w-64 h-64 mx-auto object-contain"
              />
            ) : (
              <p className="text-red-600 text-sm">QR Code not available</p>
            )}

            <button
              onClick={handleDownload}
              disabled={!qrCodeUrl}
              className={`mt-6 px-4 py-2 ${qrCodeUrl
                  ? "bg-gradient-to-r from-purple-600 to-purple-400 hover:opacity-90"
                  : "bg-gray-300 cursor-not-allowed"
                } text-white border-none rounded-md inline-flex items-center text-sm transition-opacity`}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download QR Code
            </button>
          </div>

          {/* Instructions Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              How to Use Your QR Code
            </h3>

            <div className="flex flex-col gap-4">
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <p className="font-medium text-gray-800 mb-1">
                  Daily Check-In and Check-Out
                </p>
                <p className="text-sm text-gray-600">
                  Scan your QR code at the warehouse entrance scanner when you arrive to mark your check-in. Scan again when you leave to mark your check-out. If you forget to scan when leaving, the system will automatically set your check-out time to 6:00 PM.
                </p>
              </div>

              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <p className="font-medium text-gray-800 mb-1">Security</p>
                <p className="text-sm text-gray-600">
                  Your QR code is unique and tied to your employee ID. Do not share it with others to prevent unauthorized attendance marking.
                </p>
              </div>

              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <p className="font-medium text-gray-800 mb-1">Troubleshooting</p>
                <p className="text-sm text-gray-600">
                  If the scanner doesn’t recognize your QR code, ensure your device screen brightness is high and the QR code image is clear. Contact HR if the issue persists.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance History Section */}
        <div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Attendance History (Last 5 Days)
            </h3>

            <div className="flex flex-col gap-4">
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((record, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-800">
                            {formatDate(record.date)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${record.status === "Present"
                            ? "bg-green-100 text-green-600"
                            : record.status === "Late"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-600"
                          }`}
                      >
                        {record.status}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-gray-600">Check In</p>
                        <p className="text-gray-800">{formatTime(record.checkIn)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Check Out</p>
                        <p className="text-gray-800">{formatTime(record.checkOut)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Overtime</p>
                        <p className="text-gray-800">{formatOvertime(record.overTimeHours)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm text-center">
                  No attendance records for the last 5 days.
                </p>
              )}
            </div>
          </div>

          {/* Attendance Status Legend */}
          <div className="bg-white rounded-xl shadow-md p-4 mt-6">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
              <p>Present: On time</p>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <div className="w-3 h-3 rounded-full bg-yellow-600 mr-2"></div>
              <p>Late: Arrived after 9:00 AM</p>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
              <p>Absent: No attendance record</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCode;