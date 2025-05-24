import EmployeeRow from './EmployeeRow';
import Pagination from './Pagination';

function EmployeeTable({
  employees,
  currentPage,
  itemsPerPage,
  handleDetailClick,
  handleEditClick,
  handleDeleteClick
}) {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Employee ID', 'Name', 'Email', 'NIC', 'Role', 'Warehouse', 'Status', 'Actions'].map((heading) => (
              <th
                key={heading}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {currentEmployees.length > 0 ? (
            currentEmployees.map((employee, index) => (
              <EmployeeRow
                key={employee._id + index}
                employee={employee}
                index={index}
                handleDetailClick={handleDetailClick}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
              />
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                No employees found matching the current filters
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={employees.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}

export default EmployeeTable;