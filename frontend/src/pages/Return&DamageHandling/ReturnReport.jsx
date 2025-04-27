import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function Items({ items }) {
  const defaultItems = [
    {
      id: 1,
      itemName: "Laptop",
      quantity: 2,
      damageType: "N/A",
      returnDate: new Date("2025-04-26"),
      reportedBy: "John Doe",
      supplierName: "TechCorp", // Added supplierName
      reason: "Not needed anymore", // Added reason
    },
    {
      id: 2,
      itemName: "Monitor",
      quantity: 1,
      damageType: "Slightly Scratched",
      returnDate: new Date("2025-04-26"),
      reportedBy: "Jane Smith",
      supplierName: "DisplayInc", // Added supplierName
      reason: "Defective on arrival", // Added reason
    },
  ];

  const displayItems = items && items.length > 0 ? items : defaultItems;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Return Reports
      </h2>
      {displayItems.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No items to display</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Item Name",
                  "Quantity",
                  "Damage Type",
                  "Reported By",
                  "Supplier Name",
                  "Return Date",
                  "Reason",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {displayItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.itemName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.damageType}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.reportedBy}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.supplierName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {format(new Date(item.returnDate), "MMM dd, yyyy")}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.reason}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {/* <Link to={`/returns/return-form/${item.id}`}>
                      <button className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition text-sm">
                        Return
                      </button>
                    </Link>*/}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Items;