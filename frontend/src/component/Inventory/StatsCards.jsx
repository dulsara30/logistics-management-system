import React from "react";

const StatsCards = ({ filteredInventory }) => {
  const totalStock = filteredInventory.reduce((sum, item) => sum + Number(item.quantity), 0);
  const lowStockCount = filteredInventory.filter(item => item.quantity < 50).length;

  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-gray-600 text-sm font-medium">Current Stock</h3>
        <p className="text-2xl font-bold text-gray-800">{totalStock} units</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-gray-600 text-sm font-medium">Low Stock Alerts</h3>
        <p className="text-2xl font-bold text-gray-800 flex items-center">
          {lowStockCount} products
          <span className="w-3 h-3 bg-red-500 rounded-full ml-2"></span>
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-gray-600 text-sm font-medium">Restock Pending</h3>
        <p className="text-2xl font-bold text-gray-800">3 orders</p>
        <div className="w-full bg-gray-200 h-2 rounded mt-2">
          <div className="bg-purple-600 h-2 rounded" style={{ width: "60%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;