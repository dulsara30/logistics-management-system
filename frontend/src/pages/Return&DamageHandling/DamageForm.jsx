import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DamageForm({ onSubmit }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    dateReported: new Date(),
    damageType: "physical",
    description: "",
    location: "",
    reportedBy: "",
  });

  const [errors, setErrors] = useState({});

  // Form Validation Function
  const validateForm = () => {
    let newErrors = {};
    if (!formData.itemName.trim()) newErrors.itemName = "Item name is required.";
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Enter a valid quantity.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.reportedBy.trim()) newErrors.reportedBy = "Reported by is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      navigate("/item-list"); // Redirect to item list after successful submission
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Damage Report Form</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Name */}
          <div>
            <label className="block text-gray-700 font-medium">Item Name</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            {errors.itemName && <p className="text-red-500 text-sm">{errors.itemName}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-700 font-medium">Quantity Damaged</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
          </div>

          {/* Date Reported */}
          <div>
            <label className="block text-gray-700 font-medium">Date Reported</label>
            <DatePicker
              selected={formData.dateReported}
              onChange={(date) => setFormData((prev) => ({ ...prev, dateReported: date }))}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Damage Type */}
          <div>
            <label className="block text-gray-700 font-medium">Damage Type</label>
            <select
              name="damageType"
              value={formData.damageType}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="physical">Physical Damage</option>
              <option value="water">Water Damage</option>
              <option value="chemical">Chemical Damage</option>
              <option value="temperature">Temperature Damage</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium">Location in Warehouse</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>

          {/* Reported By */}
          <div>
            <label className="block text-gray-700 font-medium">Reported By</label>
            <input
              type="text"
              name="reportedBy"
              value={formData.reportedBy}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            {errors.reportedBy && <p className="text-red-500 text-sm">{errors.reportedBy}</p>}
          </div>

          {/* Damage Description */}
          <div>
            <label className="block text-gray-700 font-medium">Damage Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Submit Button */}
          <Link to={'item-list'} >
          
         <button
             type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            Submit Damage Report
          </button>
          </Link>
        </form>
      </div>
    </main>
  );
}

export default DamageForm; 
