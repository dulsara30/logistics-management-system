import React, { useEffect, useState } from "react";

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
    lastUpdated: "",
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
  const [selectedCategory, setSelectedCategory] = useState("All"); // For filtering by category

  // Replace this with your actual token (e.g., from localStorage after login)
  const token = localStorage.getItem("token") || "your-jwt-token-here";

  // Fetch inventory items from the backend
  const fetchInventory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/manage-inventory", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched inventory data:", data);
      setInventory(data);
      setFilteredInventory(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching inventory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch inventory on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Get unique categories for the filter dropdown
  const categories = ["All", ...new Set(inventory.map(item => item.category))];

  // Handle search and filtering
  useEffect(() => {
    let filtered = inventory;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.supplierID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredInventory(filtered);
  }, [searchTerm, selectedCategory, inventory]);

  const openAddModal = () => {
    setFormData({
      name: "",
      supplierID: "",
      category: "",
      quantity: "",
      location: "",
      lastUpdated: "",
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
      id: item._id, // Map _id to id for the form
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const saveItem = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = isEditing
        ? `http://localhost:8000/api/manage-inventory/${formData.id}`
        : "http://localhost:8000/api/manage-inventory";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          supplierID: formData.supplierID,
          category: formData.category,
          quantity: parseInt(formData.quantity),
          location: formData.location,
          lastUpdated: formData.lastUpdated || new Date().toLocaleDateString("en-US"),
          supplierName: formData.supplierName,
          unitPrice: parseFloat(formData.unitPrice),
          expirationDate: formData.expirationDate,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update item" : "Failed to add item");
      }

      await fetchInventory(); // Refresh the inventory list
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/manage-inventory/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      await fetchInventory(); // Refresh the inventory list
      if (selectedItem?._id === id) setSelectedItem(null);
    } catch (err) {
      setError(err.message);
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
    link.download = `${item.supplierID}_details.txt`; // Updated from sku to supplierID
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="bg-white text-black p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Warehouse A</h1>
            <p className="text-gray-600 text-sm">Inventory Control</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex p-6 space-x-6">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="space-y-4">
            <button
              onClick={openAddModal}
              className="w-full bg-gradient-to-r from-purple-400 to-purple-600 text-white py-2 rounded hover:from-purple-500 hover:to-purple-700 transition flex items-center justify-center"
            >
              <span className="mr-2">+</span> Add New Item
            </button>
            <button className="w-full bg-gradient-to-r from-purple-400 to-purple-600 text-white py-2 rounded hover:from-purple-500 hover:to-purple-700 transition flex items-center justify-center">
              <span className="mr-2">📊</span> Generate Report
            </button>
            <button className="w-full bg-gradient-to-r from-purple-400 to-purple-600 text-white py-2 rounded hover:from-purple-500 hover:to-purple-700 transition flex items-center justify-center">
              <span className="mr-2">📷</span> Scan Barcode
            </button>
          </div>
          <div className="mt-6">
            <h3 className="text-gray-800 font-semibold">Category Breakdown</h3>
            <div className="h-32 bg-gray-100 rounded mt-2 flex items-center justify-center text-gray-500">
              Pie Chart Here (40% Produce, 30% Dairy, etc.)
            </div>
          </div>
        </aside>

        {/* Dashboard */}
        <section className="w-3/4">
          {/* Loading and Error States */}
          {isLoading && <p className="text-gray-600">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {/* Key Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-gray-600">Current Stock</h3>
              <p className="text-2xl font-bold text-gray-800">
                {inventory.reduce((sum, item) => sum + Number(item.quantity), 0)} units
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-gray-600">Low Stock Alerts</h3>
              <p className="text-2xl font-bold text-gray-800 flex items-center">
                {inventory.filter(item => item.quantity < 50).length} products{" "}
                <span className="w-3 h-3 bg-purple-500 rounded-full ml-2"></span>
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-gray-600">Restock Pending</h3>
              <p className="text-2xl font-bold text-gray-800">3 orders</p>
              <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Top-up Card for Selected Item */}
          {selectedItem && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Item Details</h3>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <p>
                  <strong>Product Name:</strong> {selectedItem.name}
                </p>
                <p>
                  <strong>Supplier ID:</strong> {selectedItem.supplierID}
                </p>
                <p>
                  <strong>Category:</strong> {selectedItem.category}
                </p>
                <p>
                  <strong>Quantity:</strong> {selectedItem.quantity}
                </p>
                <p>
                  <strong>Location:</strong> {selectedItem.location}
                </p>
                <p>
                  <strong>Last Updated:</strong> {selectedItem.lastUpdated}
                </p>
                <p>
                  <strong>Supplier Name:</strong> {selectedItem.supplierName}
                </p>
                <p>
                  <strong>Unit Price:</strong> ${selectedItem.unitPrice.toFixed(2)}
                </p>
                <p>
                  <strong>Expiration Date:</strong> {selectedItem.expirationDate}
                </p>
                <p className="col-span-2">
                  <strong>Notes:</strong> {selectedItem.notes}
                </p>
              </div>
              <button
                onClick={() => downloadItemDetails(selectedItem)}
                className="mt-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white py-2 px-4 rounded hover:from-purple-500 hover:to-purple-700 transition"
              >
                Download Details
              </button>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="mb-6 flex space-x-4">
            <input
              type="text"
              placeholder="Search Supplier ID, product name, or category"
              className="w-3/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Supplier ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Last Updated</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => (
                  <tr
                    key={item._id} // Use _id from MongoDB
                    onClick={() => selectItem(item)}
                    className={`cursor-pointer ${
                      selectedItem?._id === item._id ? "bg-blue-100" : "bg-white"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="p-3 text-gray-700">{item.name}</td>
                    <td className="p-3 text-gray-700">{item.supplierID}</td>
                    <td className="p-3 text-gray-700">{item.category}</td>
                    <td className="p-3 text-gray-700">{item.quantity}</td>
                    <td className="p-3 text-gray-700">{item.location}</td>
                    <td className="p-3 text-gray-700">{item.lastUpdated}</td>
                    <td className="p-3 flex space-x-2">
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
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal for CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {isEditing ? "Edit Item" : "Add New Item"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Product Name"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="text"
                name="supplierID"
                value={formData.supplierID}
                onChange={handleInputChange}
                placeholder="Supplier ID"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Category"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Location"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="text"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleInputChange}
                placeholder="Supplier Name"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleInputChange}
                placeholder="Unit Price"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="text"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleInputChange}
                placeholder="Expiration Date (MM/DD/YY)"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400"
              />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Notes"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveItem}
                className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded hover:from-purple-500 hover:to-purple-700 transition"
              >
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagementPage;