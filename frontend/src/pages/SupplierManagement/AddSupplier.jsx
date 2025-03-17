import { useState } from "react";


function AddSupplier() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    productCategory: "",
    description: "",
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
          <label className="block font-medium">Supplier Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            required
          />

          <label className="block mt-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            required
          />

          <label className="block mt-2 font-medium">Contact</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            required
          />

          <label className="block mt-2 font-medium">Product Category</label>
          <select
            name="productCategory"
            value={formData.productCategory}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            required
          >
            <option value="">Select Product Category</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="groceries">Groceries</option>
            <option value="clothing">Clothing</option>
            <option value="pharmaceutical">Pharmaceutical</option>
          </select>

          <label className="block mt-2 font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
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
