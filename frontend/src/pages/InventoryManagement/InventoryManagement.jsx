import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const InventoryManagementPage = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    supplierID: "",
    category: "",
    quantity: "",
    location: "",
    lastUpdated: new Date().toISOString().split("T")[0],
    supplierName: "",
    unitPrice: "",
    expirationDate: "",
    notes: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByDate, setSortByDate] = useState("latest");
  const [sortByQuantity, setSortByQuantity] = useState("none");
  const navigate = useNavigate();

  // Fetch inventory items from the backend
  const fetchInventory = async () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    try {
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const res = await fetch(`http://localhost:8000/inventory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 401 || res.status === 403) {
          throw new Error(errorData.message || "Unauthorized. Please log in again.");
        }
        throw new Error(`Failed to fetch inventory: ${errorData.message || res.statusText}`);
      }

      const data = await res.json();
      setInventory(data);
      setFilteredInventory(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching inventory:", err);
      if (err.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    let updatedInventory = [...inventory];

    if (searchTerm) {
      updatedInventory = updatedInventory.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.supplierID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortByDate === "oldest") {
      updatedInventory.sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
    } else if (sortByDate === "latest") {
      updatedInventory.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    }

    if (sortByQuantity === "lowest") {
      updatedInventory.sort((a, b) => Number(a.quantity) - Number(b.quantity));
    } else if (sortByQuantity === "highest") {
      updatedInventory.sort((a, b) => Number(b.quantity) - Number(b.quantity));
    }

    setFilteredInventory(updatedInventory);
  }, [inventory, searchTerm, sortByDate, sortByQuantity]);

  const openAddModal = () => {
    setFormData({
      name: "",
      supplierID: "",
      category: "",
      quantity: "",
      location: "",
      lastUpdated: new Date().toISOString().split("T")[0],
      supplierName: "",
      unitPrice: "",
      expirationDate: "",
      notes: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormData({
      ...item,
      id: item._id,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      lastUpdated: item.lastUpdated.split("T")[0],
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null); // Clear error on input change
  };

  const validateForm = () => {
    // Name: Only letters and spaces, 2-50 characters
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!formData.name || formData.name.trim() === "") {
      setError("Product name is required");
      return false;
    }
    if (!nameRegex.test(formData.name)) {
      setError("Product name must contain only letters and spaces");
      return false;
    }
    if (formData.name.length < 2 || formData.name.length > 50) {
      setError("Product name must be between 2 and 50 characters");
      return false;
    }

    // Supplier ID: Alphanumeric, 3-10 characters
    const supplierIDRegex = /^[A-Za-z0-9]+$/;
    if (!formData.supplierID || formData.supplierID.trim() === "") {
      setError("Supplier ID is required");
      return false;
    }
    if (!supplierIDRegex.test(formData.supplierID)) {
      setError("Supplier ID must be alphanumeric (letters and numbers only)");
      return false;
    }
    if (formData.supplierID.length < 3 || formData.supplierID.length > 10) {
      setError("Supplier ID must be between 3 and 10 characters");
      return false;
    }

    // Category: Letters, spaces, and some special characters, 2-50 characters
    const categoryRegex = /^[A-Za-z\s&]+$/;
    if (!formData.category || formData.category.trim() === "") {
      setError("Category is required");
      return false;
    }
    if (!categoryRegex.test(formData.category)) {
      setError("Category must contain only letters, spaces, and '&'");
      return false;
    }
    if (formData.category.length < 2 || formData.category.length > 50) {
      setError("Category must be between 2 and 50 characters");
      return false;
    }

    // Quantity: Positive integer, 1-10000
    const quantity = parseInt(formData.quantity);
    if (!formData.quantity || isNaN(quantity)) {
      setError("Quantity must be a valid number");
      return false;
    }
    if (quantity <= 0) {
      setError("Quantity must be a positive number");
      return false;
    }
    if (quantity > 10000) {
      setError("Quantity must not exceed 10,000");
      return false;
    }

    // Location: Alphanumeric with spaces and some special characters, 2-100 characters
    const locationRegex = /^[A-Za-z0-9\s\-]+$/;
    if (!formData.location || formData.location.trim() === "") {
      setError("Location is required");
      return false;
    }
    if (!locationRegex.test(formData.location)) {
      setError("Location must contain only letters, numbers, spaces, and hyphens");
      return false;
    }
    if (formData.location.length < 2 || formData.location.length > 100) {
      setError("Location must be between 2 and 100 characters");
      return false;
    }

    // Last Updated: Must be a valid date, not in the future
    if (!formData.lastUpdated) {
      setError("Last updated date is required");
      return false;
    }
    const lastUpdatedDate = new Date(formData.lastUpdated);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for comparison
    if (isNaN(lastUpdatedDate.getTime())) {
      setError("Last updated date must be a valid date");
      return false;
    }
    if (lastUpdatedDate > today) {
      setError("Last updated date cannot be in the future");
      return false;
    }

    // Supplier Name: Only letters and spaces, 2-100 characters
    const supplierNameRegex = /^[A-Za-z\s]+$/;
    if (!formData.supplierName || formData.supplierName.trim() === "") {
      setError("Supplier name is required");
      return false;
    }
    if (!supplierNameRegex.test(formData.supplierName)) {
      setError("Supplier name must contain only letters and spaces");
      return false;
    }
    if (formData.supplierName.length < 2 || formData.supplierName.length > 100) {
      setError("Supplier name must be between 2 and 100 characters");
      return false;
    }

    // Unit Price: Positive number, 0.01-10000, max 2 decimal places
    const unitPrice = parseFloat(formData.unitPrice);
    if (!formData.unitPrice || isNaN(unitPrice)) {
      setError("Unit price must be a valid number");
      return false;
    }
    if (unitPrice < 0.01) {
      setError("Unit price must be at least 0.01");
      return false;
    }
    if (unitPrice > 10000) {
      setError("Unit price must not exceed 10,000");
      return false;
    }
    const decimalPlaces = (formData.unitPrice.toString().split(".")[1] || "").length;
    if (decimalPlaces > 2) {
      setError("Unit price must have at most 2 decimal places");
      return false;
    }

    // Expiration Date: Must be a valid date, in the future
    if (!formData.expirationDate) {
      setError("Expiration date is required");
      return false;
    }
    const expirationDate = new Date(formData.expirationDate);
    if (isNaN(expirationDate.getTime())) {
      setError("Expiration date must be a valid date");
      return false;
    }
    if (expirationDate <= today) {
      setError("Expiration date must be in the future");
      return false;
    }

    // Notes: Optional, max 500 characters, no harmful scripts
    if (formData.notes) {
      if (formData.notes.length > 500) {
        setError("Notes must not exceed 500 characters");
        return false;
      }
      const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
      if (scriptRegex.test(formData.notes)) {
        setError("Notes must not contain script tags");
        return false;
      }
    }

    return true;
  };

  const saveItem = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const url = isEditing
        ? `http://localhost:8000/inventory/${formData.id}`
        : "http://localhost:8000/inventory";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          supplierID: formData.supplierID.trim(),
          category: formData.category.trim(),
          quantity: parseInt(formData.quantity),
          location: formData.location.trim(),
          lastUpdated: formData.lastUpdated,
          supplierName: formData.supplierName.trim(),
          unitPrice: parseFloat(formData.unitPrice),
          expirationDate: formData.expirationDate,
          notes: formData.notes ? formData.notes.trim() : "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          throw new Error(errorData.message || "Unauthorized. Please log in again.");
        }
        throw new Error(errorData.message || (isEditing ? "Failed to update item" : "Failed to add item"));
      }

      await fetchInventory();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    try {
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`http://localhost:8000/inventory/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          throw new Error(errorData.message || "Unauthorized. Please log in again.");
        }
        throw new Error(errorData.message || "Failed to delete item");
      }

      await fetchInventory();
      if (selectedItem?._id === id) setSelectedItem(null);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectItem = (item) => {
    setSelectedItem(selectedItem?._id === item._id ? null : item);
  };

  const downloadItemDetails = (item) => {
    const content = `
      Product Name: ${item.name}
      Supplier ID: ${item.supplierID}
      Category: ${item.category}
      Quantity: ${item.quantity}
      Location: ${item.location}
      Last Updated: ${item.lastUpdated}
      Supplier Name: ${item.supplierName}
      Unit Price: $${item.unitPrice.toFixed(2)}
      Expiration Date: ${item.expirationDate}
      Notes: ${item.notes}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.supplierID}_details.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <p className="text-gray-600 mt-2">Manage your warehouse inventory efficiently</p>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="space-y-4">
            <button
              onClick={openAddModal}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 rounded-lg hover:from-purple-600 hover:to-purple-800 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <span className="mr-2">+</span> Add New Item
            </button>
            <button
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 rounded-lg hover:from-purple-600 hover:to-purple-800 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              onClick={() => alert("Generate Report feature coming soon!")}
            >
              <span className="mr-2">📊</span> Generate Report
            </button>
            <button
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 rounded-lg hover:from-purple-600 hover:to-purple-800 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              onClick={() => alert("Scan Barcode feature coming soon!")}
            >
              <span className="mr-2">📷</span> Scan Barcode
            </button>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Category Breakdown</h3>
            <div className="h-32 bg-gray-100 rounded-lg mt-2 flex items-center justify-center text-gray-500">
              Pie Chart Placeholder (40% Produce, 30% Dairy, etc.)
            </div>
          </div>
        </aside>

        {/* Dashboard */}
        <section className="w-3/4">
          {/* Loading and Error States */}
          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="text-gray-600 text-lg">Loading...</div>
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6 border border-red-300">
              {error}
            </div>
          )}

          {/* Key Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Current Stock</h3>
              <p className="text-2xl font-bold text-gray-800">
                {filteredInventory.reduce((sum, item) => sum + Number(item.quantity), 0)} units
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Low Stock Alerts</h3>
              <p className="text-2xl font-bold text-gray-800 flex items-center">
                {filteredInventory.filter(item => item.quantity < 50).length} products
                <span className="w-3 h-3 bg-red-500 rounded-full ml-2"></span>
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Restock Pending</h3>
              <p className="text-2xl font-bold text-gray-800">3 orders</p>
              <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div className="bg-purple-600 h-2 rounded" style={{ width: "60%" }}></div>
              </div>
            </div>
          </div>

          {/* Top-up Card for Selected Item */}
          {selectedItem && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Item Details</h3>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <p><strong>Product Name:</strong> {selectedItem.name}</p>
                <p><strong>Supplier ID:</strong> {selectedItem.supplierID}</p>
                <p><strong>Category:</strong> {selectedItem.category}</p>
                <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
                <p><strong>Location:</strong> {selectedItem.location}</p>
                <p><strong>Last Updated:</strong> {selectedItem.lastUpdated}</p>
                <p><strong>Supplier Name:</strong> {selectedItem.supplierName}</p>
                <p><strong>Unit Price:</strong> ${selectedItem.unitPrice.toFixed(2)}</p>
                <p><strong>Expiration Date:</strong> {selectedItem.expirationDate}</p>
                <p className="col-span-2"><strong>Notes:</strong> {selectedItem.notes}</p>
              </div>
              <button
                onClick={() => downloadItemDetails(selectedItem)}
                className="mt-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-purple-800 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Download Details
              </button>
            </div>
          )}

          {/* Search and Sort Bar */}
          <div className="mb-6 flex gap-4">
            <input
              type="text"
              placeholder="Search by Supplier ID, product name, or category"
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={sortByDate}
              onChange={(e) => {
                setSortByDate(e.target.value);
                setSortByQuantity("none");
              }}
              className="w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <select
              value={sortByQuantity}
              onChange={(e) => {
                setSortByQuantity(e.target.value);
                setSortByDate("latest");
              }}
              className="w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="none">Sort by Quantity</option>
              <option value="lowest">Lowest Quantity First</option>
              <option value="highest">Highest Quantity First</option>
            </select>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Supplier ID</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No inventory items found.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map(item => (
                    <tr
                      key={item._id}
                      onClick={() => selectItem(item)}
                      className={`cursor-pointer ${
                        selectedItem?._id === item._id ? "bg-purple-50" : "bg-white"
                      } hover:bg-purple-50 transition`}
                    >
                      <td className="p-4 text-gray-700">{item.name}</td>
                      <td className="p-4 text-gray-700">{item.supplierID}</td>
                      <td className="p-4 text-gray-700">{item.category}</td>
                      <td className="p-4 text-gray-700">{item.quantity}</td>
                      <td className="p-4 text-gray-700">{item.location}</td>
                      <td className="p-4 text-gray-700">{item.lastUpdated}</td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(item);
                          }}
                          className="text-purple-600 hover:text-purple-800 transition"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item._id);
                          }}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Modal for CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? "Edit Item" : "Add New Item"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier ID</label>
                  <input
                    type="text"
                    name="supplierID"
                    value={formData.supplierID}
                    onChange={handleInputChange}
                    placeholder="Enter supplier ID"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Enter category"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <input
                    type="date"
                    name="lastUpdated"
                    value={formData.lastUpdated}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                  <input
                    type="text"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    placeholder="Enter supplier name"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    placeholder="Enter unit price"
                    step="0.01"
                    min="0.01"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                  <input
                    type="date"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Enter notes"
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              {error && (
                <div className="mt-4 bg-red-100 text-red-800 p-3 rounded-lg border border-red-300">
                  {error}
                </div>
              )}
            </div>
            
            <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveItem}
                disabled={isLoading}
                className={`px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Saving..." : (isEditing ? "Update" : "Save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagementPage;