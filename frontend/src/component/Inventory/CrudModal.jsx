import React, { useState, useEffect } from "react";

const CrudModal = ({ isOpen, onClose, formData, onInputChange, onSave, isEditing, isLoading, error }) => {
  const [supplierSearch, setSupplierSearch] = useState("");
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  // Mock list of suppliers (replace with API call to fetch actual suppliers)
  const suppliers = [
    "Dairy Farms Inc.",
    "Fresh Produce Co.",
    "Global Suppliers Ltd.",
    "Organic Goods LLC",
    "Sri Lankan Imports",
  ];

  // Predefined categories for the dropdown
  const categories = [
    "Dairy",
    "Produce",
    "Bakery",
    "Beverages",
    "Snacks",
    "Household",
    "Personal Care",
  ];

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  // Handle supplier selection
  const handleSupplierSelect = (supplier) => {
    onInputChange({ target: { name: "supplierName", value: supplier } });
    setSupplierSearch(supplier);
    setShowSupplierDropdown(false);
  };

  useEffect(() => {
    // Reset supplier search when modal opens/closes
    if (!isOpen) {
      setSupplierSearch("");
      setShowSupplierDropdown(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{isEditing ? "Edit Item" : "Add New Item"}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 border border-red-300">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Product Name</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={onInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Brand Name</label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={onInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter description"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={onInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter price"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={onInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={onInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter quantity"
                min="0"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Updated In</label>
              <input
                type="date"
                name="updatedIn"
                value={formData.updatedIn}
                onChange={onInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Created In</label>
              <input
                type="date"
                name="createdIn"
                value={formData.createdIn}
                onChange={onInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={onInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 font-medium mb-1">Supplier Name</label>
              <input
                type="text"
                value={supplierSearch}
                onChange={(e) => {
                  setSupplierSearch(e.target.value);
                  setShowSupplierDropdown(true);
                  if (!formData.supplierName || e.target.value === formData.supplierName) {
                    onInputChange({ target: { name: "supplierName", value: e.target.value } });
                  }
                }}
                onFocus={() => setShowSupplierDropdown(true)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Search for a supplier"
              />
              {showSupplierDropdown && filteredSuppliers.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-md">
                  {filteredSuppliers.map((supplier) => (
                    <li
                      key={supplier}
                      onClick={() => handleSupplierSelect(supplier)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {supplier}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Reorder Level</label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={onInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter reorder level"
                min="0"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="mr-3 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : isEditing ? "Update Item" : "Add Item"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudModal;