import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Extract the ID from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view this page");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/staff/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 401 || res.status === 403) {
            throw new Error("Unauthorized. Please log in again.");
          }
          if (res.status === 404) {
            throw new Error("Profile not found");
          }
          throw new Error(errorData.message || "Failed to fetch profile");
        }

        const data = await res.json();
        setProfile(data);
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

    fetchProfile();
  }, [id, navigate]);

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

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 text-lg">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Staff Profile</h1>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {profile.profileImage && (
          <div className="mb-4">
            <img
              src={profile.profileImage}
              alt={`${profile.fullName}'s profile`}
              className="w-32 h-32 rounded-full object-cover mx-auto"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/128"; // Fallback image if the profile image fails to load
              }}
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p><strong>Full Name:</strong> {profile.fullName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;