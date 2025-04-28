import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/inventory/Sidebar";
import StatsCards from "../../component/inventory/StatsCards";
import ItemDetailsCard from "../../component/inventory/ItemDetailsCard";
import SearchSortBar from "../../component/inventory/SearchSortBar";
import InventoryTable from "../../component/inventory/InventoryTable";
import CrudModal from "../../component/inventory/CrudModal";
import StockoutModal from "../../component/Inventory/StockoutModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ToastStyles.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InventoryManagementPage = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [expiringSoonItems, setExpiringSoonItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockoutModalOpen, setIsStockoutModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    brandName: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    updatedIn: new Date().toISOString().split("T")[0],
    createdIn: new Date().toISOString().split("T")[0],
    expiryDate: "",
    supplierName: "",
    reorderLevel: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByDate, setSortByDate] = useState("latest");
  const [sortByQuantity, setSortByQuantity] = useState("none");
  const navigate = useNavigate();

  // Calculate Low Stock and Expiring Soon items
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const tenDaysFromNow = new Date(today);
    tenDaysFromNow.setDate(today.getDate() + 10);

    console.log("Today:", today.toISOString());
    console.log("Ten days from now:", tenDaysFromNow.toISOString());

    // Low Stock: quantity <= reorderLevel
    const lowStock = filteredInventory
      .map((item) => ({
        ...item,
        isLowStock: Number(item.quantity) <= Number(item.reorderLevel),
      }))
      .filter((item) => item.isLowStock);

    // Expiring Soon: within 10 days
    const expiringSoon = filteredInventory
      .map((item) => {
        const expiryDate = new Date(item.expiryDate);
        if (isNaN(expiryDate.getTime())) {
          console.warn(`Invalid expiry date for item ${item.productName}: ${item.expiryDate}`);
          return { ...item, isExpiringSoon: false, daysUntilExpiry: null };
        }

        const isExpiringSoon = expiryDate <= tenDaysFromNow && expiryDate >= today;
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

        console.log(`Item: ${item.productName}, Expiry: ${expiryDate.toISOString()}, Is Expiring Soon: ${isExpiringSoon}, Days Until Expiry: ${daysUntilExpiry}`);

        return {
          ...item,
          isExpiringSoon,
          daysUntilExpiry: isExpiringSoon ? daysUntilExpiry : null,
        };
      })
      .filter((item) => item.isExpiringSoon);

    setLowStockItems(lowStock);
    setExpiringSoonItems(expiringSoon);
  }, [filteredInventory]);

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
      console.log("Fetched inventory data:", data);
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

  const fetchSuppliers = async () => {
    const token = localStorage.getItem("token");
    try {
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const res = await fetch(`http://localhost:8000/suppliers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch suppliers");
      }

      const data = await res.json();
      const supplierNames = [...new Set(data.map((supplier) => supplier.name))];
      setSuppliers(supplierNames);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching suppliers:", err);
      if (err.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    }
  };

  const stockoutItem = async (stockoutData) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`http://localhost:8000/inventory/stockout/${stockoutData.itemId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: parseInt(stockoutData.quantity),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          throw new Error(errorData.message || "Unauthorized. Please log in again.");
        }
        throw new Error(errorData.message || "Failed to stockout item");
      }

      const updatedItem = await response.json();
      toast.success(`Stock updated! New quantity for ${updatedItem.productName}: ${updatedItem.quantity}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        )
      );
      setFilteredInventory((prevFiltered) =>
        prevFiltered.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        )
      );

      setIsStockoutModalOpen(false);
    } catch (err) {
      setError(err.message);
      console.error("Error during stockout:", err);
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
    fetchSuppliers();
  }, []);

  useEffect(() => {
    let updatedInventory = [...inventory];

    if (searchTerm) {
      updatedInventory = updatedInventory.filter(
        (item) =>
          item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortByDate === "oldest") {
      updatedInventory.sort((a, b) => new Date(a.updatedIn) - new Date(b.updatedIn));
    } else if (sortByDate === "latest") {
      updatedInventory.sort((a, b) => new Date(b.updatedIn) - new Date(a.updatedIn));
    }

    if (sortByQuantity === "lowest") {
      updatedInventory.sort((a, b) => Number(a.quantity) - Number(b.quantity));
    } else if (sortByQuantity === "highest") {
      updatedInventory.sort((a, b) => Number(b.quantity) - Number(a.quantity));
    }

    setFilteredInventory(updatedInventory);
  }, [inventory, searchTerm, sortByDate, sortByQuantity]);

  const openAddModal = () => {
    setFormData({
      productName: "",
      brandName: "",
      description: "",
      price: "",
      category: "",
      quantity: "",
      updatedIn: new Date().toISOString().split("T")[0],
      createdIn: new Date().toISOString().split("T")[0],
      expiryDate: "",
      supplierName: suppliers.length > 0 ? suppliers[0] : "",
      reorderLevel: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openStockoutModal = () => {
    setIsStockoutModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormData({
      ...item,
      id: item._id,
      quantity: item.quantity.toString(),
      price: item.price.toString(),
      updatedIn: item.updatedIn.split("T")[0],
      createdIn: item.createdIn.split("T")[0],
      expiryDate: item.expiryDate.split("T")[0],
      reorderLevel: item.reorderLevel.toString(),
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: name=${name}, value=${value}, type=${typeof value}`);
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!formData.productName || formData.productName.trim() === "") {
      setError("Product name is required");
      return false;
    }
    if (!nameRegex.test(formData.productName)) {
      setError("Product name must contain only letters and spaces");
      return false;
    }
    if (formData.productName.length < 2 || formData.productName.length > 50) {
      setError("Product name must be between 2 and 50 characters");
      return false;
    }

    if (!formData.brandName || formData.brandName.trim() === "") {
      setError("Brand name is required");
      return false;
    }
    if (!nameRegex.test(formData.brandName)) {
      setError("Brand name must contain only letters and spaces");
      return false;
    }
    if (formData.brandName.length < 2 || formData.brandName.length > 50) {
      setError("Brand name must be between 2 and 50 characters");
      return false;
    }

    if (!formData.description || formData.description.trim() === "") {
      setError("Description is required");
      return false;
    }
    if (formData.description.length < 10 || formData.description.length > 500) {
      setError("Description must be between 10 and 500 characters");
      return false;
    }
    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    if (scriptRegex.test(formData.description)) {
      setError("Description must not contain script tags");
      return false;
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price)) {
      setError("Price must be a valid number");
      return false;
    }
    if (price < 0) {
      setError("Price must not be negative");
      return false;
    }
    if (price > 100000) {
      setError("Price must not exceed 100,000");
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

    if (!formData.updatedIn) {
      setError("Updated date is required");
      return false;
    }
    const updatedDate = new Date(formData.updatedIn);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(updatedDate.getTime())) {
      setError("Updated date must be a valid date");
      return false;
    }
    if (updatedDate > today) {
      setError("Updated date cannot be in the future");
      return false;
    }

    if (!formData.createdIn) {
      setError("Created date is required");
      return false;
    }
    const createdDate = new Date(formData.createdIn);
    if (isNaN(createdDate.getTime())) {
      setError("Created date must be a valid date");
      return false;
    }

    if (!formData.expiryDate) {
      setError("Expiry date is required");
      return false;
    }
    const expiryDate = new Date(formData.expiryDate);
    if (isNaN(expiryDate.getTime())) {
      setError("Expiry date must be a valid date");
      return false;
    }
    if (expiryDate <= today) {
      setError("Expiry date must be in the future");
      return false;
    }

    if (!formData.supplierName || formData.supplierName.trim() === "") {
      setError("Supplier name is required");
      return false;
    }
    const supplierNameRegex = /^[A-Za-z0-9\s\-&@#.,()'"]+$/;
    if (!supplierNameRegex.test(formData.supplierName)) {
      setError("Supplier name contains invalid characters");
      return false;
    }
    if (scriptRegex.test(formData.supplierName)) {
      setError("Supplier name must not contain script tags");
      return false;
    }
    if (formData.supplierName.length < 2 || formData.supplierName.length > 100) {
      setError("Supplier name must be between 2 and 100 characters");
      return false;
    }

    const reorderLevel = parseInt(formData.reorderLevel);
    if (!formData.reorderLevel || isNaN(reorderLevel)) {
      setError("Reorder level must be a valid number");
      return false;
    }
    if (reorderLevel < 0) {
      setError("Reorder level must be a non-negative number");
      return false;
    }
    if (reorderLevel > 10000) {
      setError("Reorder level must not exceed 10,000");
      return false;
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
          productName: formData.productName.trim(),
          brandName: formData.brandName.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          category: formData.category.trim(),
          quantity: parseInt(formData.quantity),
          updatedIn: formData.updatedIn,
          createdIn: formData.createdIn,
          expiryDate: formData.expiryDate,
          supplierName: formData.supplierName.trim(),
          reorderLevel: parseInt(formData.reorderLevel),
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

  const formatPrice = (price) => {
    return typeof price === "number" ? `$${price.toFixed(2)}` : "$0.00";
  };

  const downloadItemDetails = (item) => {
    const formatDate = (dateString) => {
      return dateString ? dateString.split("T")[0] : "N/A";
    };

    const content = `
      Product Name: ${item.productName || "N/A"}
      Brand Name: ${item.brandName || "N/A"}
      Description: ${item.description || "N/A"}
      Price: ${formatPrice(item.price)}
      Category: ${item.category || "N/A"}
      Quantity: ${item.quantity ?? "N/A"}
      Updated In: ${formatDate(item.updatedIn)}
      Created In: ${formatDate(item.createdIn)}
      Expiry Date: ${formatDate(item.expiryDate)}
      Supplier Name: ${item.supplierName || "N/A"}
      Reorder Level: ${item.reorderLevel ?? "N/A"}
    `;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.productName || "item"}_details.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    if (filteredInventory.length === 0) {
      toast.info("No inventory items to generate a report for.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    try {
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Inventory Report", 14, 20);
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toISOString().split("T")[0]}`, 14, 30);

      const columns = [
        { header: "Product Name", dataKey: "productName" },
        { header: "Brand Name", dataKey: "brandName" },
        { header: "Category", dataKey: "category" },
        { header: "Quantity", dataKey: "quantity" },
        { header: "Price", dataKey: "price" },
        { header: "Supplier Name", dataKey: "supplierName" },
        { header: "Reorder Level", dataKey: "reorderLevel" },
      ];

      const data = filteredInventory.map((item) => ({
        productName: item.productName || "N/A",
        brandName: item.brandName || "N/A",
        category: item.category || "N/A",
        quantity: item.quantity ?? "N/A",
        price: formatPrice(item.price),
        supplierName: item.supplierName || "N/A",
        reorderLevel: item.reorderLevel ?? "N/A",
      }));

      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 40,
        theme: "striped",
        headStyles: { fillColor: [100, 100, 255] },
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          productName: { cellWidth: 30 },
          brandName: { cellWidth: 30 },
          category: { cellWidth: 20 },
          quantity: { cellWidth: 20 },
          price: { cellWidth: 20 },
          supplierName: { cellWidth: 30 },
          reorderLevel: { cellWidth: 20 },
        },
      });

      doc.save("inventory_report.pdf");

      toast.success("Inventory report generated and downloaded as PDF!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      console.error("Error generating PDF report:", error);
      toast.error("Failed to generate PDF report: " + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  // Prepare data for the bar chart
  const chartData = {
    labels: filteredInventory.map((item) => item.productName),
    datasets: [
      {
        label: "Quantity",
        data: filteredInventory.map((item) => item.quantity),
        backgroundColor: filteredInventory.map((item) =>
          Number(item.quantity) <= Number(item.reorderLevel)
            ? "rgba(255, 99, 132, 0.6)"
            : "rgba(54, 162, 235, 0.6)"
        ),
        borderColor: filteredInventory.map((item) =>
          Number(item.quantity) <= Number(item.reorderLevel)
            ? "rgba(255, 99, 132, 1)"
            : "rgba(54, 162, 235, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Inventory Quantities",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantity",
        },
      },
      x: {
        title: {
          display: true,
          text: "Product Name",
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <p className="text-gray-600 mt-2">Manage your warehouse inventory efficiently</p>
      </div>

      <div className="flex gap-6">
        <Sidebar
          onAddItem={openAddModal}
          onStockoutItem={openStockoutModal}
          onGenerateReport={generateReport}
          lowStockItems={lowStockItems}
          expiringSoonItems={expiringSoonItems}
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

          <StatsCards
            filteredInventory={filteredInventory.map((item) => ({
              ...item,
              isLowStock: Number(item.quantity) <= Number(item.reorderLevel),
            }))}
            expiringSoonItems={expiringSoonItems}
          />

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

          {/* Inventory Quantities Chart - Moved Below the Table */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mt-6">
            <div style={{ height: "300px" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
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
        suppliers={suppliers}
      />

      <StockoutModal
        isOpen={isStockoutModalOpen}
        onClose={() => setIsStockoutModalOpen(false)}
        inventory={inventory}
        onStockout={stockoutItem}
        isLoading={isLoading}
        error={error}
      />

      <ToastContainer />
    </div>
  );
};

export default InventoryManagementPage;