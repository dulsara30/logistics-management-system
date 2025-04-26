import React from "react";

const InventoryTable = ({ filteredInventory, selectedItem, onSelectItem, onEditItem, onDeleteItem }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left text-gray-700 font-semibold">Product Name</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Brand Name</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Category</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Quantity</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Price</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Supplier Name</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Reorder Level</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr
                key={item._id}
                onClick={() => onSelectItem(item)}
                className={`border-t border-gray-200 cursor-pointer ${
                  selectedItem?._id === item._id ? "bg-gray-50" : "hover:bg-gray-50"
                }`}
              >
                <td className="p-4 text-gray-800">{item.productName}</td>
                <td className="p-4 text-gray-800">{item.brandName}</td>
                <td className="p-4 text-gray-800">{item.category}</td>
                <td className="p-4 text-gray-800">
                  <div className="flex items-center">
                    {item.quantity}
                    {item.quantity < item.reorderLevel && (
                      <span className="ml-2 inline-block w-3 h-3 bg-red-500 rounded-full" title="Low Stock"></span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-gray-800">${item.price}</td>
                <td className="p-4 text-gray-800">{item.supplierName}</td>
                <td className="p-4 text-gray-800">{item.reorderLevel}</td>
                <td className="p-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditItem(item);
                    }}
                    className="text-blue-600 hover:underline mr-3 focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item._id);
                    }}
                    className="text-red-600 hover:underline focus:outline-none"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredInventory.length === 0 && (
        <p className="p-4 text-gray-600 text-center">No items found.</p>
      )}
    </div>
  );
};

export default InventoryTable;