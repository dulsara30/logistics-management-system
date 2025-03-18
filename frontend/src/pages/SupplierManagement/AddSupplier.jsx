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
    <main className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Supplier Management</h1>
        <form onSubmit={handleSubmit}>
          <label className="block font-medium">Supplier Id</label>
          <input
            type="text"
            name="Supplier Id"
            value={formData.supplierId}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            required
          />

          <label className="block mt-2 font-medium">Name</label>
          <input
            type="text"
            name="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            required
          />

          <label className="block mt-2 font-medium">Items Name</label>
          <input
            type="text"
            name="Items Name"
            value={formData.itemsName}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            required
          />

          <label className="block mt-2 font-medium">Quantity</label>
          <input
            type="text"
            name="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            required
          />

          <label className="block mt-2 font-medium">Unit Price</label>
          <input
            type="text"
            name="Unit Price"
            value={formData.unitPrice}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />

            <label className="block mt-2 font-medium">Date</label>
          <input
            type="text"
            name="Date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />


          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}

export default AddSupplier;
