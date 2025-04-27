import { X } from 'lucide-react';

function EditModal({ 
  isEditModalOpen, 
  setIsEditModalOpen, 
  editEmployee, 
  setEditEmployee, 
  handleSaveEdit, 
  isSaving 
}) {
  if (!isEditModalOpen || !editEmployee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Employee</h2>
          <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee ID</label>
            <input
              type="text"
              value={editEmployee._id}
              readOnly
              className="mt-1 bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={editEmployee.fullName}
              onChange={(e) => setEditEmployee({...editEmployee, fullName: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={editEmployee.email}
              onChange={(e) => setEditEmployee({...editEmployee, email: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">NIC</label>
            <input
              type="text"
              value={editEmployee.NIC}
              onChange={(e) => setEditEmployee({...editEmployee, NIC: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={editEmployee.phoneNo}
              onChange={(e) => setEditEmployee({...editEmployee, phoneNo: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={editEmployee.DOB}
              onChange={(e) => setEditEmployee({...editEmployee, DOB: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              value={editEmployee.gender}
              onChange={(e) => setEditEmployee({...editEmployee, gender: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={editEmployee.address}
              onChange={(e) => setEditEmployee({...editEmployee, address: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
            <input
              type="text"
              value={editEmployee.profilePic}
              onChange={(e) => setEditEmployee({...editEmployee, profilePic: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Joined</label>
            <input
              type="date"
              value={editEmployee.dateJoined}
              onChange={(e) => setEditEmployee({...editEmployee, dateJoined: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Warehouse Assigned</label>
            <input
              type="text"
              value={editEmployee.warehouseAssigned}
              onChange={(e) => setEditEmployee({...editEmployee, warehouseAssigned: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={editEmployee.status}
              onChange={(e) => setEditEmployee({...editEmployee, status: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={editEmployee.role}
              onChange={(e) => setEditEmployee({...editEmployee, role: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Inventory Manager">Inventory Manager</option>
              <option value="Driver">Driver</option>
              <option value="Maintenance Staff">Maintenance Staff</option>
              <option value="Other Staff">Other Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
            <input
              type="text"
              value={editEmployee.emName || ''}
              onChange={(e) => setEditEmployee({...editEmployee, emName: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Emergency Contact Relation</label>
            <input
              type="text"
              value={editEmployee.emRelation || ''}
              onChange={(e) => setEditEmployee({...editEmployee, emRelation: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Emergency Contact Number</label>
            <input
              type="text"
              value={editEmployee.emNumber || ''}
              onChange={(e) => setEditEmployee({...editEmployee, emNumber: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className={`px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg hover:from-purple-500 hover:to-purple-700 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditModal;