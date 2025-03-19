import { useState } from "react";

function AddSupplier() {
  const [formData, setFormData] = useState({
    supplierId: "",
    name: "",
    itemsName: "",
    quantity: "",
    unitPrice: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-gray-800">
              Supplier Management
            </h2>
            <div className="h-0.5 w-24 mx-auto mt-4 bg-blue-600"></div>
            <p className="mt-4 text-gray-600 text-sm">Enter supplier information below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Supplier ID & Name Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Supplier ID
                </label>
                <input
                  type="text"
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 placeholder-gray-400
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter supplier ID"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 placeholder-gray-400
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter supplier name"
                  required
                />
              </div>
            </div>

            {/* Items Name & Quantity Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Items Name
                </label>
                <input
                  type="text"
                  name="itemsName"
                  value={formData.itemsName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 placeholder-gray-400
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter items name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 placeholder-gray-400
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter quantity"
                  required
                />
              </div>
            </div>

            {/* Unit Price & Date Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Unit Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300 text-gray-800 placeholder-gray-400
                      focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 placeholder-gray-400
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-2.5 rounded-md bg-blue-600 text-white font-medium text-sm
                  hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                  transition-colors duration-200"
              >
                Add Supplier
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default AddSupplier;