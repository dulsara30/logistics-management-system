import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ReturnForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    returnDate: new Date(),
    reason: "",
    condition: "good",
    customerName: "",
    orderNumber: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      itemName: "",
      quantity: "",
      returnDate: new Date(),
      reason: "",
      condition: "good",
      customerName: "",
      orderNumber: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Return Item Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Item Name", name: "itemName", type: "text" },
            { label: "Quantity", name: "quantity", type: "number" },
            { label: "Customer Name", name: "customerName", type: "text" },
            { label: "Order Number", name: "orderNumber", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">Return Date</label>
            <DatePicker
              selected={formData.returnDate}
              onChange={(date) => setFormData((prev) => ({ ...prev, returnDate: date }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
            >
              <option value="good">Good</option>
              <option value="damaged">Damaged</option>
              <option value="unopened">Unopened</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason for Return</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Submit Return
          </button>
        </form>
      </div>
    </main>
  );
}

export default ReturnForm;