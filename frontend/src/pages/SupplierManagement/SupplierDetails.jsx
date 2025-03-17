import { DeleteIcon } from "lucide-react";
import { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ClassNames } from "@emotion/react";

 function SupplierDetails() {
  const [suppliers, setSuppliers] = useState([
    {
      id: "SUP001",
      name: "sName",
      items: ["item 1", "item 2", "item 3"],
      quantity: ["Qty", "Qty", "Qty"],
      price: ["Price", "Price", "Price"],
      date: "2025-03-17",
    },
    {
      id: "SUP002",
      name: "sName",
      items: ["item 1", "item 2"],
      quantity: ["Qty", "Qty"],
      price: ["Price", "Price"],
      date: "2025-03-15",
    },
    {
      name: "sName",
      id: "SUP003",
      items: ["item 1"],
      quantity: ["Qty"],
      price: ["Price"],
      date: "2025-03-16",
    },
  ]);

  const handleDelete = (id) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
  };

  return (
    <div className="p-6">


       
      
      {/* Total Suppliers */}
      <div className="bg-indigo-500 text-white text-center py-3 rounded-lg mb-4">
        <span className="text-lg font-bold">TOTAL SUPPLIERS</span>
        <span className="block text-3xl">{suppliers.length}</span>
      </div>

      {/* Search & Buttons */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name / ID"
          className="border p-2 rounded-lg w-1/3"
        />
        <div className="space-x-3">

          <button className="bg-indigo-400 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
            Download Report
          </button>
        
        </div>
      </div>

      {/* Supplier Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-indigo-500">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="p-2 border">Supplier ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Items Name</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Unit Price</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="bg-gray-100 border-b">
                <td className="p-2 border">{supplier.id}</td>
                <td className="p-2 border">{supplier.name}</td>
                <td className="p-2 border">
                  {supplier.items.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </td>
                <td className="p-2 border">
                  {supplier.quantity.map((qty, index) => (
                    <div key={index}>{qty}</div>
                  ))}
                </td>
                <td className="p-2 border">
                  {supplier.price.map((price, index) => (
                    <div key={index}>{price}</div>
                  ))}
                </td>
               
                <td className="p-2 border">{supplier.date}</td>
                <td className="p-2 border flex space-x-2 justify-center">
                  <button className="text-blue-400">
                    <FaEye />
                  </button>
                  <button className="text-yellow-600">
                    <EditOutlined/>
                  </button>
                  <button
                    className="text-Black-600"
                    onClick={() => handleDelete(supplier.id)}
                  >
                    <DeleteIcon/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default SupplierDetails;
