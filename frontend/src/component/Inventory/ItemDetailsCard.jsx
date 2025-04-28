import React from "react";

const ItemDetailsCard = ({ selectedItem, onDownload }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Item Details</h3>
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <p><strong>Product Name:</strong> {selectedItem.productName}</p>
        <p><strong>Brand Name:</strong> {selectedItem.brandName}</p>
        <p className="col-span-2"><strong>Description:</strong> {selectedItem.description}</p>
        <p><strong>Price:</strong> ${selectedItem.price.toFixed(2)}</p>
        <p><strong>Category:</strong> {selectedItem.category}</p>
        <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
        <p><strong>Updated In:</strong> {selectedItem.updatedIn.split("T")[0]}</p>
        <p><strong>Created In:</strong> {selectedItem.createdIn.split("T")[0]}</p>
        <p><strong>Expiry Date:</strong> {selectedItem.expiryDate.split("T")[0]}</p>
        <p><strong>Supplier Name:</strong> {selectedItem.supplierName}</p>
        <p><strong>Reorder Level:</strong> {selectedItem.reorderLevel}</p>
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