function ReviewModal({ formData, onEdit, onConfirm }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Review Report</h2>
          <div className="mb-4">
            <p className="text-gray-600">
              <strong>Item Name:</strong> {formData.itemName}
            </p>
            <p className="text-gray-600">
              <strong>Quantity:</strong> {formData.quantity}
            </p>
            <p className="text-gray-600">
              <strong>Damage Type:</strong> {formData.damageType}
            </p>
            <p className="text-gray-600">
              <strong>Action Required:</strong> {formData.actionRequired}
            </p>
            {formData.supplierName && (
              <p className="text-gray-600">
                <strong>Supplier Name:</strong> ABC Distributors
              </p>
            )}
            <p className="text-gray-600">
              <strong>Description:</strong> {formData.description}
            </p>
            <p className="text-gray-600">
              <strong>Date:</strong> {new Date().toISOString().split('T')[0]}
            </p>
            <p className="text-gray-600">
              <strong>Reported By:</strong> Dilshan Perera
            </p>
          </div>
          <div className="flex justify-between">
            <button
              onClick={onEdit}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-300"
            >
              Edit Data
            </button>
            <button
              onClick={onConfirm}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Confirm & Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default ReviewModal;