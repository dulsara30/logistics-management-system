import React, { useState } from "react";

const Sidebar = ({ onAddItem, onStockoutItem, onGenerateReport, lowStockItems }) => {
  const [isWarningCollapsed, setIsWarningCollapsed] = useState(false);

  return (
    <aside className="w-1/4 bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions</h2>
      <div className="space-y-3">
        <button
          onClick={onAddItem}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Add Item
        </button>
        <button
          onClick={onStockoutItem}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Stock Out
        </button>
        <button
          onClick={onGenerateReport}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          Generate Report
        </button>
      </div>

      {/* Low Stock Warning Section */}
      {lowStockItems && lowStockItems.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-red-700 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-red-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Low Stock Alert!
            </h3>
            <button
              onClick={() => setIsWarningCollapsed(!isWarningCollapsed)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isWarningCollapsed ? "Expand" : "Collapse"}
            </button>
          </div>
          {!isWarningCollapsed && (
            <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                The following items are at or below their reorder level:
              </p>
              <ul className="space-y-2">
                {lowStockItems.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
                  >
                    <span className="text-gray-800 font-medium">
                      {item.productName}
                    </span>
                    <span className="text-red-600 text-sm">
                      Quantity: {item.quantity} (Reorder: {item.reorderLevel})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;