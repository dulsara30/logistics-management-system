import React from "react";

const Sidebar = ({ onAddItem, onGenerateReport, onScanBarcode }) => {
  return (
    <aside className="w-1/4 bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="space-y-4">
        <button
          onClick={onAddItem}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 rounded-lg hover:from-purple-600 hover:to-purple-800 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <span className="mr-2">+</span> Add New Item
        </button>
        <button
          onClick={onGenerateReport}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 rounded-lg hover:from-purple-600 hover:to-purple-800 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <span className="mr-2">📊</span> Generate Report
        </button>
        {/* <button
          onClick={onScanBarcode}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 rounded-lg hover:from-purple-600 hover:to-purple-800 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <span className="mr-2">📷</span> Scan Barcode
        </button> */}
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Category Breakdown</h3>
        <div className="h-32 bg-gray-100 rounded-lg mt-2 flex items-center justify-center text-gray-500">
          Pie Chart Placeholder (40% Produce, 30% Dairy, etc.)
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;