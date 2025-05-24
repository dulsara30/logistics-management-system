import React from "react";

const StatsCards = ({ filteredInventory, expiringSoonItems }) => {
  // Calculate total stock
  const totalStock = filteredInventory.reduce((sum, item) => sum + Number(item.quantity), 0);

  // Calculate low stock count using isLowStock flag
  const lowStockCount = filteredInventory.filter((item) => item.isLowStock).length;

  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Current Stock Card */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium">Current Stock</h3>
          <p className="text-2xl font-bold text-gray-800">{totalStock} units</p>
        </div>

        {/* Low Stock Alerts Card */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium">Low Stock Alerts</h3>
          <p className="text-2xl font-bold text-gray-800 flex items-center">
            {lowStockCount} products
            {lowStockCount > 0 && (
              <span className="w-3 h-3 bg-red-500 rounded-full ml-2"></span>
            )}
          </p>
        </div>

        {/* Expiration Reminder Card */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium">Expiration Reminder</h3>
          {expiringSoonItems.length === 0 ? (
            <p className="text-gray-500">No items expiring soon.</p>
          ) : (
            <ul className="max-h-24 overflow-y-auto">
              {expiringSoonItems.map((item) => (
                <li
                  key={item._id}
                  className={`p-1 text-sm ${item.isExpiringSoon ? "bg-red-100 text-red-800 rounded" : ""
                    }`}
                >
                  {item.productName} - Expires in {item.daysUntilExpiry} days
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCards;