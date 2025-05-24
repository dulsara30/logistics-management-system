import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";

function StaffAttendance() {
  const [cameraStream, setCameraStream] = useState(null);
  const [scannedNic, setScannedNic] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [attendanceMode, setAttendanceMode] = useState("checkIn"); // "checkIn" or "checkOut"
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Request camera permissions and start the stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        console.log('Available cameras:', videoDevices); // Log available devices

        const droidCamDevice = videoDevices.find(device =>
          device.label.toLowerCase().includes('droidcam')
        );

        const constraints = droidCamDevice
          ? { video: { deviceId: droidCamDevice.deviceId } }
          : { video: { facingMode: 'environment' } }; // Fallback if not found

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        setError("Failed to access camera: " + err.message);
      }
    };

    startCamera();

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Continuously scan for QR codes
  useEffect(() => {
    const scanQRCode = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          try {
            // Parse the QR code data as JSON and extract the NIC
            const qrData = JSON.parse(code.data);
            if (qrData.NIC) {
              setScannedNic(qrData.NIC); // Set only the NIC value
            } else {
              setError("NIC not found in QR code data");
            }
          } catch (err) {
            setError("Failed to parse QR code data: " + err.message);
          }
        }
      }

      requestAnimationFrame(scanQRCode);
    };

    if (cameraStream) {
      requestAnimationFrame(scanQRCode);
    }
  }, [cameraStream]);

  // Mark attendance and fetch user details when a QR code is scanned
  useEffect(() => {
    const markAttendance = async () => {
      if (!scannedNic) return;

      setMessage("");
      setError("");
      setUserDetails(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to mark attendance");
        navigate("/login", { replace: true });
        return;
      }

      try {
        // Step 1: Mark attendance
        const attendanceResponse = await fetch("http://localhost:8000/staff/attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nic: scannedNic,
            mode: attendanceMode, // "checkIn" or "checkOut"
          }),
        });

        const attendanceData = await attendanceResponse.json();

        if (!attendanceResponse.ok) {
          throw new Error(attendanceData.message || "Failed to mark attendance");
        }

        // Step 2: Fetch user details
        const userResponse = await fetch(`http://localhost:8000/staff/attendance/${scannedNic}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
          throw new Error(userData.message || "Failed to fetch user details");
        }

        // Combine user details with attendance status and check-in time
        const combinedUserDetails = {
          ...userData,
          status: attendanceData.status,
          checkInTime: attendanceData.checkInTime,
        };

        setUserDetails(combinedUserDetails);
        setMessage("Attendance taken successfully!");
      } catch (err) {
        setError(err.message);
      } finally {
        // Reset scannedNic to allow scanning another QR code
        setTimeout(() => setScannedNic(null), 3000); // Reset after 3 seconds
      }
    };

    markAttendance();
  }, [scannedNic, attendanceMode, navigate]);

  // Format date and time for display
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    const date = new Date(time);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Staff Attendance</h1>
        <p className="text-gray-600 mt-2">Scan a QR code to mark attendance</p>
      </div>

      {/* Radio Buttons for Attendance Mode */}
      <div className="mb-6">
        <label className="mr-4">
          <input
            type="radio"
            value="checkIn"
            checked={attendanceMode === "checkIn"}
            onChange={(e) => setAttendanceMode(e.target.value)}
            className="mr-2"
          />
          Check-In
        </label>
        <label>
          <input
            type="radio"
            value="checkOut"
            checked={attendanceMode === "checkOut"}
            onChange={(e) => setAttendanceMode(e.target.value)}
            className="mr-2"
          />
          Check-Out
        </label>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg text-center">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Camera View */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Camera View to Scan QR Code
          </h3>
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-64 object-cover rounded-lg"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>

        {/* User Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Details of the User
          </h3>
          {userDetails ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={userDetails.photo || "https://via.placeholder.com/80"}
                  alt="User"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <p className="text-xl font-semibold text-gray-800">
                    {userDetails.name}
                  </p>
                  <p className="text-sm text-gray-600">{userDetails.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <p
                    className={`text-sm font-medium ${userDetails.status === "Present"
                        ? "text-green-600"
                        : userDetails.status === "Late"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                  >
                    {userDetails.status || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Warehouse</p>
                  <p className="text-sm text-gray-800">
                    {userDetails.warehouse || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">NIC</p>
                  <p className="text-sm text-gray-800">{userDetails.nic}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Date</p>
                  <p className="text-sm text-gray-800">{formatDate()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Check-In Time</p>
                  <p className="text-sm text-gray-800">
                    {formatTime(userDetails.checkInTime)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center">
              Scan a QR code to view user details
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffAttendance;