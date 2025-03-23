import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function Items({ items, type }) {

  const defaultItems = [
    {
      id: 1,
      itemName: "Laptop",
      quantity: 2,
      returnDate: new Date(),
      condition: "Good",
      damageType: "N/A",
      dateReported: new Date(),
    },
    {
      id: 2,
      itemName: "Monitor",
      quantity: 1,
      returnDate: new Date(),
      condition: "Slightly Scratched",
      damageType: "Screen Crack",
      dateReported: new Date(),
    },
  ];

  const displayItems = items && items.length > 0 ? items : defaultItems;
  const title = type === "returns" ? "Recent Returns" : "Damage Reports";
  const dateLabel = type === "returns" ? "returnDate" : "dateReported";
  const statusLabel = type === "returns" ? "condition" : "damageType";

  return (
    
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      {displayItems.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No items to display</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Item Name",
                  "Quantity",
                  "Date",
                  type === "returns" ? "Condition" : "Damage Type",
                  "Returning",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase border border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {displayItems.map((item) => (
                <tr key={item.id} className="border border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {item.itemName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {format(item[dateLabel], "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item[statusLabel]}</td>
                  <td className="px-6 py-4 text-center">
                    <Link to="Return-Form">
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                        Return
                      </button>
                    </Link>
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
