import React, { useState, useEffect } from "react";

const StockoutModal = ({ isOpen, onClose, inventory, onStockout, isLoading, error }) => {
  const [stockoutData, setStockoutData] = useState({
    itemId: "",
    quantity: "",
  });
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [localError, setLocalError] = useState(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStockoutData({
        itemId: inventory.length > 0 ? inventory[0]._id : "",
        quantity: "",
      });
      setAvailableQuantity(
        inventory.length > 0 ? inventory[0].quantity : 0
      );
      setLocalError(null);
    }
  }, [isOpen, inventory]);

  // Update available quantity when the selected item changes
  const handleItemChange = (e) => {
    const itemId = e.target.value;
    const selectedItem = inventory.find((item) => item._id === itemId);
    setStockoutData({ ...stockoutData, itemId, quantity: "" });
    setAvailableQuantity(selectedItem ? selectedItem.quantity : 0);
    setLocalError(null);
  };

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    setStockoutData({ ...stockoutData, quantity });
    setLocalError(null);
  };

  const validateForm = () => {
    if (!stockoutData.itemId) {
      setLocalError("Please select an item");
      return false;
    }

    const quantity = parseInt(stockoutData.quantity);
    if (!stockoutData.quantity || isNaN(quantity)) {
      setLocalError("Quantity must be a valid number");
      return false;
    }
    if (quantity <= 0) {
      setLocalError("Quantity must be a positive number");
      return false;
    }
    if (quantity > availableQuantity) {
      setLocalError(`Quantity cannot exceed available stock (${availableQuantity})`);
      return false;
    }

    return true;
  };

  const handleStockout = () => {
    if (!validateForm()) return;
    onStockout(stockoutData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Stockout Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {(error || localError) && (
            <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 border border-red-300">
              {error || localError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Select Item</label>
              {inventory.length > 0 ? (
                <select
                  name="itemId"
                  value={stockoutData.itemId}
                  onChange={handleItemChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select an item</option>
                  {inventory.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.productName} ({item.quantity} available)
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-500">No items available</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Quantity to Stockout (Available: {availableQuantity})
              </label>
              <input
                type="number"
                name="quantity"
                value={stockoutData.quantity}
                onChange={handleQuantityChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter quantity"
                min="1"
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
              onClick={handleStockout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:from-red-600 hover:to-red-800 transition focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Stockout Item"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockoutModal;