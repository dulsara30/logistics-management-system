import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  // State for form inputs
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    DOB: "",
    address: "",
    emName: "",
    emRelation: "",
    emNumber: "",
    profilePic: "",
    role: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  // Default profile picture if none is provided
  const defaultProfilePic = "https://via.placeholder.com/80?text=User";

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage({ text: "You must be logged in to view this page", type: "error" });
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await fetch(`http://localhost:8000/staff/manage-staff/${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await res.json();
        setFormData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          phoneNo: userData.phoneNo || "",
          DOB: userData.DOB ? userData.DOB.split("T")[0] : "", // Format date for input
          address: userData.address || "",
          emName: userData.emName || "",
          emRelation: userData.emRelation || "",
          emNumber: userData.emNumber || "",
          profilePic: userData.profilePic || defaultProfilePic,
          role: userData.role || "",
        });
      } catch (err) {
        setMessage({ text: "Error fetching user data: " + err.message, type: "error" });
        if (err.message.includes("Invalid or expired token")) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData((prevData) => ({
        ...prevData,
        profilePic: URL.createObjectURL(file), // Preview the image
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ text: "You must be logged in to update your profile", type: "error" });
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // If a new image is uploaded, upload it first
      let updatedProfilePic = formData.profilePic;
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("profilePic", imageFile);

        const imageRes = await fetch("http://localhost:8000/staff/upload-profile-pic", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formDataImage,
        });

        if (!imageRes.ok) {
          throw new Error("Failed to upload profile picture");
        }

        const imageData = await imageRes.json();
        updatedProfilePic = imageData.profilePic; // Update with the new image path
      }

      // Update the user profile
      const updatedData = {
        ...formData,
        profilePic: updatedProfilePic,
      };

      const res = await fetch(`http://localhost:8000/staff/manage-staff/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      setMessage({ text: "Profile updated successfully!", type: "success" });
      setImageFile(null); // Clear the image file after successful upload
    } catch (err) {
      setMessage({ text: "Error updating profile: " + err.message, type: "error" });
    }
  };

  // Loading state
  if (isLoading) {
    return <div className="text-center py-4 text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Profile Picture and Name */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <img
              src={formData.profilePic || defaultProfilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                />
              </svg>
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{formData.fullName}</h2>
            <p className="text-gray-600">{formData.role}</p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="DOB"
                value={formData.DOB}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Emergency Contact */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                <input
                  type="text"
                  name="emName"
                  value={formData.emName}
                  onChange={handleChange}
                  placeholder="Enter emergency contact name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Relationship</label>
                <input
                  type="text"
                  name="emRelation"
                  value={formData.emRelation}
                  onChange={handleChange}
                  placeholder="Enter relationship"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Emergency Contact Number</label>
                <input
                  type="tel"
                  name="emNumber"
                  value={formData.emNumber}
                  onChange={handleChange}
                  placeholder="Enter emergency contact number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Success/Error Message */}
        {message.text && (
          <div
            className={`mt-4 p-3 rounded-md text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}