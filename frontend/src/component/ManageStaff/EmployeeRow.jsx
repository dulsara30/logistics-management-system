import { Edit2, Trash2 } from 'lucide-react';

function EmployeeRow({ employee, index, handleDetailClick, handleEditClick, handleDeleteClick }) {
  return (
    <tr
      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
    >
      <td className="px-6 py-4 text-sm text-gray-900">{employee._id}</td>
      <td
        className="px-6 py-4 text-sm text-gray-900 cursor-pointer hover:text-indigo-600"
        onClick={() => handleDetailClick(employee)}
      >
        {employee.fullName}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{employee.email}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{employee.NIC}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{employee.role}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{employee.warehouseAssigned}</td>
      <td className="px-6 py-4">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}
        >
          {employee.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="flex space-x-2">
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => handleEditClick(employee)}
          >
            <Edit2 size={18} />
          </button>
          <button
            className="text-red-600 hover:text-red-900"
            onClick={() => handleDeleteClick(employee)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default EmployeeRow;