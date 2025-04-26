import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/inventory/Sidebar";
import StatsCards from "../../component/inventory/StatsCards";
import ItemDetailsCard from "../../component/inventory/ItemDetailsCard";
import SearchSortBar from "../../component/inventory/SearchSortBar";
import InventoryTable from "../../component/inventory/InventoryTable";
import CrudModal from "../../component/inventory/CrudModal";
import BarcodeScannerModal from "../../component/inventory/BarcodeScannerModal";

const InventoryManagementPage = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false); // State for barcode scanner modal
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

  // Handle product found from barcode scan
  const handleProductFound = (product) => {
    setIsScannerOpen(false); // Close scanner modal
    openEditModal(product); // Open edit modal with scanned product
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const validateForm = () => {
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

    if (!formData.lastUpdated) {
      setError("Last updated date is required");
      return false;
    }
    const lastUpdatedDate = new Date(formData.lastUpdated);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(lastUpdatedDate.getTime())) {
      setError("Last updated date must be a valid date");
      return false;
    }
    if (lastUpdatedDate > today) {
      setError("Last updated date cannot be in the future");
      return false;
    }

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

  const handleScanBarcode = () => {
    setIsScannerOpen(true); // Open the barcode scanner modal
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
        <Sidebar
          onAddItem={openAddModal}
          onGenerateReport={() => alert("Generate Report feature coming soon!")}
          onScanBarcode={handleScanBarcode}
        />

        <section className="w-3/4">
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

          <StatsCards filteredInventory={filteredInventory} />

          {selectedItem && (
            <ItemDetailsCard
              selectedItem={selectedItem}
              onDownload={downloadItemDetails}
            />
          )}

          <SearchSortBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortByDate={sortByDate}
            onSortByDateChange={setSortByDate}
            sortByQuantity={sortByQuantity}
            onSortByQuantityChange={setSortByQuantity}
          />

          <InventoryTable
            filteredInventory={filteredInventory}
            selectedItem={selectedItem}
            onSelectItem={selectItem}
            onEditItem={openEditModal}
            onDeleteItem={deleteItem}
          />
        </section>
      </div>

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onSave={saveItem}
        isEditing={isEditing}
        isLoading={isLoading}
        error={error}
      />

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onProductFound={handleProductFound}
        setError={setError}
      />
    </div>
  );
};

export default InventoryManagementPage;