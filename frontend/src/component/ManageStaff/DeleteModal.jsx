import { X } from 'lucide-react';

function DeleteModal({ 
  isDeleteModalOpen, 
  setIsDeleteModalOpen, 
  employeeToDelete, 
  confirmDelete, 
  isDeleting 
}) {
  if (!isDeleteModalOpen || !employeeToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Confirm Delete</h2>
        </div>
        <p className="mb-4">
          Are you sure you want to delete <span className="font-semibold">{employeeToDelete.fullName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className={`px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg hover:from-red-500 hover:to-red-700 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;