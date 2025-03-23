import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";

function AddSupplier() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    itemsName: "",
    quantity: "",
    unitPrice: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, date: today }));
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (errors[id]) {
      setErrors({ ...errors, [id]: null });
    }
    setSubmitError(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Only letters and spaces are allowed";
    }

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email addresst";
    }

    if (!formData.contact || formData.contact.trim() === "") {
      newErrors.contact = "Phone number must be exactly 10 digits and start with 0";
    }

    const itemsArray = formData.itemsName
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    if (itemsArray.length === 0) {
      newErrors.itemsName = "At least one item name is required";
    }

    const quantityArray = formData.quantity
      .split(",")
      .map((qty) => parseFloat(qty.trim()))
      .filter((qty) => !isNaN(qty));
    if (quantityArray.length === 0) {
      newErrors.quantity = "At least one valid quantity is required";
    } else if (quantityArray.some((qty) => qty < 0)) {
      newErrors.quantity = "Quantities must be positive numbers";
    }

    const priceArray = formData.unitPrice
      .split(",")
      .map((price) => parseFloat(price.trim()))
      .filter((price) => !isNaN(price));
    if (priceArray.length === 0) {
      newErrors.unitPrice = "At least one valid unit price is required";
    } else if (priceArray.some((price) => price < 0)) {
      newErrors.unitPrice = "Unit prices must be positive numbers";
    }

    if (
      itemsArray.length !== quantityArray.length ||
      itemsArray.length !== priceArray.length
    ) {
      newErrors.itemsName = "The number of items, quantities, and prices must match";
      newErrors.quantity = "The number of items, quantities, and prices must match";
      newErrors.unitPrice = "The number of items, quantities, and prices must match";
    }

    if (!formData.date || formData.date.trim() === "") {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsArray = formData.itemsName
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");
      const quantityArray = formData.quantity
        .split(",")
        .map((qty) => parseFloat(qty.trim()))
        .filter((qty) => !isNaN(qty));
      const priceArray = formData.unitPrice
        .split(",")
        .map((price) => parseFloat(price.trim()))
        .filter((price) => !isNaN(price));

      const payload = {
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        items: itemsArray,
        quantity: quantityArray,
        price: priceArray,
        date: formData.date,
      };

      console.log("Submitting payload:", payload);

      const res = await fetch("http://localhost:8000/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Supplier added successfully:", data);

      setFormData({
        name: "",
        email: "",
        contact: "",
        itemsName: "",
        quantity: "",
        unitPrice: "",
        date: new Date().toISOString().split("T")[0],
      });

      alert("Supplier added successfully!");
      navigate("/suppliers");
    } catch (err) {
      console.error("Error adding supplier:", err);
      setSubmitError(err.message || "Failed to add supplier. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Supplier</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-6"
      >
        {submitError && (
          <div className="mb-6 text-center text-red-600 text-sm">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name *
            </label>
            <input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter supplier name"
              required
              disabled={isSubmitting}
              className={`w-full border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter supplier email"
              required
              disabled={isSubmitting}
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
              Contact *
            </label>
            <input
              id="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="Enter supplier contact"
              required
              disabled={isSubmitting}
              className={`w-full border ${
                errors.contact ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="itemsName"
              className="block text-sm font-medium text-gray-700"
            >
              Items Name (comma-separated) *
            </label>
            <input
              id="itemsName"
              value={formData.itemsName}
              onChange={handleInputChange}
              placeholder="e.g., Laptop, Mouse"
              required
              disabled={isSubmitting}
              className={`w-full border ${
                errors.itemsName ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.itemsName && (
              <p className="text-red-500 text-xs mt-1">{errors.itemsName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity (comma-separated numbers) *
            </label>
            <input
              id="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="e.g., 10, 20"
              required
              disabled={isSubmitting}
              className={`w-full border ${
                errors.quantity ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
            <p className="text-xs text-gray-500">
              Enter quantities as numbers, separated by commas
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="unitPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Unit Price (comma-separated numbers) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500"></span>
              <input
                id="unitPrice"
                value={formData.unitPrice}
                onChange={handleInputChange}
                placeholder="e.g., 1000, 50"
                required
                disabled={isSubmitting}
                className={`w-full pl-8 border ${
                  errors.unitPrice ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            {errors.unitPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.unitPrice}</p>
            )}
            <p className="text-xs text-gray-500">
              Enter prices as numbers, separated by commas
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date *
            </label>
            <div className="relative">
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                max={new Date().toISOString().split("T")[0]}
                disabled={isSubmitting}
                className={`w-full border ${
                  errors.date ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-2 rounded-lg shadow transition ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-purple-600 hover:to-purple-800"
            }`}
          >
            {isSubmitting ? "Adding Supplier..." : "Add Supplier"}
          </button>
        </div>
      </form>

      <div className="p-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    </div>
  );
}

export default AddSupplier;