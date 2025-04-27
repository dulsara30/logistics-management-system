import React from 'react';
import { X } from 'lucide-react';

const DetailModal = ({
  isDetailModalOpen,
  setIsDetailModalOpen,
  selectedEmployee,
  downloadReport,
  formatDateForDisplay,
  BACKEND_BASE_URL,
}) => {
  if (!isDetailModalOpen || !selectedEmployee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Employee Details</h2>
          <button
            onClick={() => setIsDetailModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-700">Profile Picture</h3>
            {selectedEmployee.profilePic ? (
              <img
                src={selectedEmployee.profilePic}
                alt={`${selectedEmployee.fullName}'s Profile`}
                className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 mt-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/128?text=No+Image';
                }}
              />
            ) : (
              <p className="text-gray-500 italic">No profile picture available</p>
            )}
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-700">QR Code</h3>
            {selectedEmployee.qrCode ? (
              <img
                src={selectedEmployee.qrCode}
                alt={`${selectedEmployee.fullName}'s QR Code`}
                className="w-32 h-32 object-contain mt-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/128?text=No+QR+Code';
                }}
              />
            ) : (
              <p className="text-gray-500 italic">No QR code available</p>
            )}
          </div>

          {/* Employee Details */}
          <div className="space-y-2">
            <p><strong>ID:</strong> {selectedEmployee._id}</p>
            <p><strong>Full Name:</strong> {selectedEmployee.fullName}</p>
            <p><strong>Email:</strong> {selectedEmployee.email}</p>
            <p><strong>NIC:</strong> {selectedEmployee.NIC}</p>
            <p><strong>Phone:</strong> {selectedEmployee.phoneNo}</p>
            <p><strong>DOB:</strong> {formatDateForDisplay(selectedEmployee.DOB)}</p>
            <p><strong>Gender:</strong> {selectedEmployee.gender}</p>
            <p><strong>Address:</strong> {selectedEmployee.address}</p>
            <p><strong>Date Joined:</strong> {formatDateForDisplay(selectedEmployee.dateJoined)}</p>
            <p><strong>Warehouse:</strong> {selectedEmployee.warehouseAssigned}</p>
            <p><strong>Status:</strong> {selectedEmployee.status}</p>
            <p><strong>Role:</strong> {selectedEmployee.role}</p>
            <div>
              <strong>Emergency Contact:</strong>
              <ul className="ml-4 list-disc">
                <li>Name: {selectedEmployee.emName || 'N/A'}</li>
                <li>Relation: {selectedEmployee.emRelation || 'N/A'}</li>
                <li>Number: {selectedEmployee.emNumber || 'N/A'}</li>
              </ul>
            </div>
          </div>

          {/* Download Report Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => downloadReport(selectedEmployee)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;