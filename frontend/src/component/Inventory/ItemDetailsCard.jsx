import React from "react";

const ItemDetailsCard = ({ selectedItem, onDownload }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Item Details</h3>
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <p><strong>Product Name:</strong> {selectedItem.name}</p>
        <p><strong>Supplier ID:</strong> {selectedItem.supplierID}</p>
        <p><strong>Category:</strong> {selectedItem.category}</p>
        <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
        <p><strong>Location:</strong> {selectedItem.location}</p>
        <p><strong>Last Updated:</strong> {selectedItem.lastUpdated}</p>
        <p><strong>Supplier Name:</strong> {selectedItem.supplierName}</p>
        <p><strong>Unit Price:</strong> ${selectedItem.unitPrice.toFixed(2)}</p>
        <p><strong>Expiration Date:</strong> {selectedItem.expirationDate}</p>
        <p className="col-span-2"><strong>Notes:</strong> {selectedItem.notes}</p>
      </div>
      <button
        onClick={() => onDownload(selectedItem)}
        className="mt-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-purple-800 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Download Details
      </button>
    </div>
  );
};

export default ItemDetailsCard;