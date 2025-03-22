import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/staff/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store the token and role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Redirect based on role
      switch (data.role) {
        case "Business Owner":
          navigate("/business-owner-dashboard");
          break;
        case "Warehouse Manager":
          navigate("/warehouse-manager-dashboard");
          break;
        case "Inventory Manager":
          navigate("/inventory-manager-dashboard");
          break;
        case "Driver":
          navigate("/driver-dashboard");
          break;
        case "Maintenance Staff":
          navigate("/maintenance-staff-dashboard");
          break;
        case "Other Staff":
          navigate("/other-staff-dashboard");
          break;
        default:
          setError("Unknown role");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>
      <form onSubmit={handleLogin} className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.smith@example.com"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-2 rounded-lg shadow hover:from-purple-600 hover:to-purple-800 transition"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;