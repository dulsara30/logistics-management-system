import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ReturnForm({ onSubmit, items }) {
  const { id } = useParams(); // Get item ID from URL
  const defaultItems = [
    {
      id: 1,
      itemName: "Laptop",
      quantity: 2,
      damageType: "N/A",
      condition: "Good",
      returnDate: new Date(),
      dateReported: new Date(),
      reportedBy: "John Doe",
      supplierName: "TechCorp", // Added supplierName for existing items
    },
    {
      id: 2,
      itemName: "Monitor",
      quantity: 1,
      damageType: "Slightly Scratched",
      condition: "Good",
      returnDate: new Date(),
      dateReported: new Date(),
      reportedBy: "Jane Smith",
      supplierName: "DisplayInc", // Added supplierName for existing items
    },
  ];

  const initialFormData = {
    itemName: "",
    quantity: "",
    damageType: "",
    reportedBy: "",
    supplierName: "", // Added supplierName to initial form data
    condition: "good",
    returnDate: null,
    reason: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // Pre-fill form if item ID is provided
  useEffect(() => {
    if (id) {
      const itemList = items && items.length > 0 ? items : defaultItems;
      const item = itemList.find((item) => item.id === parseInt(id));
      if (item) {
        setFormData({
          itemName: item.itemName,
          quantity: item.quantity.toString(),
          damageType: item.damageType,
          reportedBy: item.reportedBy,
          supplierName: item.supplierName || "", // Pre-fill supplierName
          condition: item.condition.toLowerCase(),
          returnDate: item.returnDate,
          reason: "",
        });
      }
    }
  }, [id, items]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: parseInt(formData.quantity), // Convert quantity to number
      id: id ? parseInt(id) : Math.max(...defaultItems.map((i) => i.id)) + 1, // Generate new ID if not editing
    });
    setFormData(initialFormData); // Reset form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Return Item Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Item Name", name: "itemName", type: "text" },
            { label: "Quantity", name: "quantity", type: "number" },
            { label: "Damage Type", name: "damageType", type: "text" },
            { label: "Reported By", name: "reportedBy", type: "text" },
            { label: "Supplier Name", name: "supplierName", type: "text" }, // Added Supplier Name field
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="mt-1 block w-full rounded border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 text-sm text-gray-600"
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
              Return Date
            </label>
            <DatePicker
              selected={formData.returnDate}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, returnDate: date }))
              }
              className="mt-1 block w-full rounded border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 text-sm text-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
              Condition
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="mt-1 block w-full rounded border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 text-sm text-gray-600"
              required
            >
              <option value="good">Good</option>
              <option value="damaged">Damaged</option>
              <option value="unopened">Unopened</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reason for Return
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 text-sm text-gray-600"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition text-sm"
          >
            Submit Return
          </button>
        </form>
      </div>7
    </main>
  );
}

export default ReturnForm;