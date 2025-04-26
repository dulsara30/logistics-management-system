import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function QRCode (){
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
        // Fetch QR code
        const qrResponse = await fetch("http://localhost:8000/qrcode", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!qrResponse.ok) {
          const errorData = await qrResponse.json();
          if (qrResponse.status === 401 || qrResponse.status === 403) {
            throw new Error("Unauthorized. Please log in again.");
          }
          throw new Error(errorData.message || "Failed to fetch QR code");
        }

        const qrData = await qrResponse.json();
        setQrCodeUrl(qrData.qrCodeUrl); // Assuming backend returns { qrCodeUrl: "..." }

        // Fetch last 5 days of attendance
        const attendanceResponse = await fetch("http://localhost:8000/attendance/last-five-days", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!attendanceResponse.ok) {
          const errorData = await attendanceResponse.json();
          throw new Error(errorData.message || "Failed to fetch attendance records");
        }

        const attendanceData = await attendanceResponse.json();
        setAttendanceRecords(attendanceData); // Assuming backend returns [{ date, checkIn, checkOut, status }, ...]
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

  // Loading state
  if (isLoading) {
    return <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>Loading...</div>;
  }

  // Error state
  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ color: "#dc2626", fontSize: "18px" }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "24px" }}>
      {/* Header Section */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1f2937" }}>My QR Code</h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>Use this QR code to mark your attendance</p>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          color: "#4b5563",
          marginBottom: "24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          transition: "color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#1f2937")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#4b5563")}
      >
        <svg
          style={{ width: "18px", height: "18px", marginRight: "8px" }}
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* QR Code Section */}
        <div>
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "500", color: "#1f2937", marginBottom: "8px" }}>
              Attendance QR Code
            </h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
              Scan this code to mark your attendance
            </p>

            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR Code for attendance"
                style={{ width: "256px", height: "256px", margin: "0 auto", objectFit: "contain" }}
              />
            ) : (
              <p style={{ color: "#dc2626", fontSize: "14px" }}>QR Code not available</p>
            )}

            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = qrCodeUrl;
                link.download = "qrcode.png";
                link.click();
              }}
              style={{
                marginTop: "24px",
                padding: "8px 16px",
                background: "linear-gradient(to right, #6b46c1, #9f7aea)",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                fontSize: "14px",
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <svg
                style={{ width: "16px", height: "16px", marginRight: "8px" }}
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
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "24px",
              marginTop: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "500", color: "#1f2937", marginBottom: "16px" }}>
              How to Use Your QR Code
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  background: "#f9fafb",
                }}
              >
                <p style={{ fontWeight: "500", color: "#1f2937", marginBottom: "4px" }}>
                  Daily Check-In and Check-Out
                </p>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>
                  Scan your QR code at the warehouse entrance scanner when you arrive to mark your check-in. Scan again when you leave to mark your check-out. If you forget to scan when leaving, the system will automatically set your check-out time to 6:00 PM.
                </p>
              </div>

              <div
                style={{
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  background: "#f9fafb",
                }}
              >
                <p style={{ fontWeight: "500", color: "#1f2937", marginBottom: "4px" }}>
                  Security
                </p>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>
                  Your QR code is unique and tied to your employee ID. Do not share it with others to prevent unauthorized attendance marking.
                </p>
              </div>

              <div
                style={{
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  background: "#f9fafb",
                }}
              >
                <p style={{ fontWeight: "500", color: "#1f2937", marginBottom: "4px" }}>
                  Troubleshooting
                </p>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>
                  If the scanner doesn’t recognize your QR code, ensure your device screen brightness is high and the QR code image is clear. Contact HR if the issue persists.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance History Section */}
        <div>
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "500", color: "#1f2937", marginBottom: "16px" }}>
              Attendance History (Last 5 Days)
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((record, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <svg
                          style={{ width: "16px", height: "16px", marginRight: "8px", color: "#6b7280" }}
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
                          <p style={{ fontWeight: "500", color: "#1f2937" }}>
                            {formatDate(record.date)}
                          </p>
                        </div>
                      </div>
                      <span
                        style={{
                          padding: "2px 8px",
                          background:
                            record.status === "Present"
                              ? "#dcfce7"
                              : record.status === "Late"
                              ? "#fef9c3"
                              : "#fee2e2",
                          color:
                            record.status === "Present"
                              ? "#16a34a"
                              : record.status === "Late"
                              ? "#ca8a04"
                              : "#dc2626",
                          fontSize: "12px",
                          fontWeight: "500",
                          borderRadius: "999px",
                        }}
                      >
                        {record.status}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: "8px",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        fontSize: "14px",
                      }}
                    >
                      <div>
                        <p style={{ fontSize: "12px", color: "#6b7280" }}>Check In</p>
                        <p style={{ color: "#1f2937" }}>{formatTime(record.checkIn)}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: "12px", color: "#6b7280" }}>Check Out</p>
                        <p style={{ color: "#1f2937" }}>{formatTime(record.checkOut)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#6b7280", fontSize: "14px", textAlign: "center" }}>
                  No attendance records for the last 5 days.
                </p>
              )}
            </div>

            <button
              onClick={() => navigate("/attendance-history")} // Assuming a full history page exists
              style={{
                marginTop: "16px",
                background: "none",
                border: "none",
                color: "#6b46c1",
                fontSize: "14px",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#9f7aea")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#6b46c1")}
            >
              View Full History
            </button>
          </div>

          {/* Attendance Status Legend */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "16px",
              marginTop: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#6b7280" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#16a34a",
                  marginRight: "8px",
                }}
              ></div>
              <p>Present: On time</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
                color: "#6b7280",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#ca8a04",
                  marginRight: "8px",
                }}
              ></div>
              <p>Late: Arrived after 9:00 AM</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
                color: "#6b7280",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#dc2626",
                  marginRight: "8px",
                }}
              ></div>
              <p>Absent: No attendance record</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCode;