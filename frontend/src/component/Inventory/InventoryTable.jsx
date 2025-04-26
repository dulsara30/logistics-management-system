import React from "react";

const InventoryTable = ({ filteredInventory, selectedItem, onSelectItem, onEditItem, onDeleteItem }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="p-4">Product Name</th>
            <th className="p-4">Supplier ID</th>
            <th className="p-4">Category</th>
            <th className="p-4">Quantity</th>
            <th className="p-4">Location</th>
            <th className="p-4">Last Updated</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                No inventory items found.
              </td>
            </tr>
          ) : (
            filteredInventory.map(item => (
              <tr
                key={item._id}
                onClick={() => onSelectItem(item)}
                className={`cursor-pointer ${
                  selectedItem?._id === item._id ? "bg-purple-50" : "bg-white"
                } hover:bg-purple-50 transition`}
              >
                <td className="p-4 text-gray-700">{item.name}</td>
                <td className="p-4 text-gray-700">{item.supplierID}</td>
                <td className="p-4 text-gray-700">{item.category}</td>
                <td className="p-4 text-gray-700">{item.quantity}</td>
                <td className="p-4 text-gray-700">{item.location}</td>
                <td className="p-4 text-gray-700">{item.lastUpdated}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditItem(item);
                    }}
                    className="text-purple-600 hover:text-purple-800 transition"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item._id);
                    }}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;