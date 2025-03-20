import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, ArrowLeft, X, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function ManageStaff() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [status, setStatus] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const getStaff = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8000/staff/manage-staff", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setEmployees(data);
        setFilteredEmployees(data); // Set initial filtered data
      } catch (err) {
        setError(err.message);
        console.error("Error fetching staff:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getStaff();
  }, []);

  // Apply filters when searchTerm, warehouseFilter, or status changes
  useEffect(() => {
    if (!employees || !Array.isArray(employees)) return;

    let results = [...employees];

    // Search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      results = results.filter(employee => 
        (employee.fullName?.toLowerCase() || '').includes(searchTermLower) ||
        (employee.id?.toString().toLowerCase() || '').includes(searchTermLower) ||
        (employee.email?.toLowerCase() || '').includes(searchTermLower) ||
        (employee.phoneNo?.toLowerCase() || '').includes(searchTermLower)
      );
    }

    // Warehouse filter
    if (warehouseFilter) {
      results = results.filter(employee => 
        employee.warehouseAssigned?.toLowerCase() === warehouseFilter.toLowerCase()
      );
    }

    // Status filter
    if (status) {
      results = results.filter(employee => 
        employee.status?.toLowerCase() === status.toLowerCase()
      );
    }

    setFilteredEmployees(results); // Update filtered employees
  }, [searchTerm, warehouseFilter, status, employees]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredEmployees.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle edit
  const handleEditClick = (employee) => {
    setEditEmployee({...employee});
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:8000/staff/manage-staff/${editEmployee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editEmployee)
      });

      if (!res.ok) {
        throw new Error("Failed to update employee");
      }

      const updatedEmployee = await res.json();
      setEmployees(employees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      ));
      setFilteredEmployees(filteredEmployees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      ));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating employee:", err);
      setError(err.message);
    }
  };

  // Handle delete
  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8000/staff/manage-staff/${employeeToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete employee");
      }

      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      setFilteredEmployees(filteredEmployees.filter(emp => emp.id !== employeeToDelete.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError(err.message);
    }
  };

  // Rest of your functions (handleDetailClick, downloadReport) remain the same
  const handleDetailClick = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  };

  const downloadReport = (employee) => {
    const report = `
      Employee Report
      ---------------
      ID: ${employee.id}
      Full Name: ${employee.fullName}
      Email: ${employee.email}
      Phone: ${employee.phoneNo}
      DOB: ${employee.DOB}
      Gender: ${employee.gender}
      Address: ${employee.address}
      Profile Picture: ${employee.profilePic}
      Date Joined: ${employee.dateJoined}
      Warehouse: ${employee.warehouseAssigned}
      Status: ${employee.status}
      Role: ${employee.role}
      Emergency Contact:
      - Name: ${employee.emName || 'N/A'}
      - Relation: ${employee.emRelation || 'N/A'}
      - Number: ${employee.emNumber || 'N/A'}
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${employee.fullName}_report.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // JSX return statement remains largely the same, just adding loading and error states
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Staff</h1>
        <Link to={"/staff/add-staff"}>
          <button className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-500 hover:to-purple-700 transition-colors duration-200">
            Add New Staff
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow border border-gray-100">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Warehouses</option>
            <option value="Warehouse A">Warehouse A</option>
            <option value="Warehouse B">Warehouse B</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-4">Loading employees...</div>
      )}
      {error && (
        <div className="text-center py-4 text-red-600">Error: {error}</div>
      )}

      {/* Employee Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Employee ID', 'Name', 'Email', 'Role', 'Warehouse', 'Status', 'Actions'].map((heading) => (
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
                  <tr
                    key={employee.id + index}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.id}</td>
                    <td 
                      className="px-6 py-4 text-sm text-gray-900 cursor-pointer hover:text-indigo-600"
                      onClick={() => handleDetailClick(employee)}
                    >
                      {employee.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.role}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.warehouseAssigned}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.status === 'Active'
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
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No employees found matching the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-white">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredEmployees.length)}
              </span> of{' '}
              <span className="font-medium">{filteredEmployees.length}</span> results
            </p>
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 ${
                  currentPage === 1 
                    ? 'bg-gray-200 text-gray-600' 
                    : 'bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700'
                } rounded-lg transition-colors`}
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button 
                className={`px-4 py-2 ${
                  currentPage >= Math.ceil(filteredEmployees.length / itemsPerPage) 
                    ? 'bg-gray-200 text-gray-600' 
                    : 'bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700'
                } rounded-lg transition-colors`}
                onClick={nextPage}
                disabled={currentPage >= Math.ceil(filteredEmployees.length / itemsPerPage)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of your JSX (Back button and modals) remains the same */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Edit Modal */}
      {isEditModalOpen && editEmployee && (
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
                  value={editEmployee.id}
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

              {/* Rest of edit modal fields remain the same */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg hover:from-purple-500 hover:to-purple-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedEmployee && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Employee Details</h2>
        <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      
      <div className="space-y-4">
        <img 
          src={selectedEmployee.profilePic} 
          alt={selectedEmployee.fullName} 
          className="w-24 h-24 rounded-full mx-auto"
        />
        
        <div className="grid grid-cols-1 gap-2">
          <div className="flex">
            <p className="text-sm text-gray-600 w-28">ID:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.id}</span>
          </div>
          <div className="flex">
            <p className="text-sm text-gray-600 w-28">Name:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.fullName}</span>
          </div>
          <div className="flex">
            <p className="text-sm text-gray-600 w-28">Email:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.email}</span>
          </div>
          <div className="flex">
            <p className="text-sm text-gray-600 w-28">Phone:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.phoneNo}</span>
          </div>
          <div className="flex">
            <p className="text-sm text-gray-600 w-28">DOB:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.DOB}</span>
          </div>
          <div className="flex">
            <p className="text-sm text-gray-600 w-28">Gender:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.gender}</span>
          </div>
          <div className="flex">
            <p className="text-sm text-gray-600 w-28">Address:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.address}</span>
          </div>
          <div className="flex">
            <p className="text-sm text-gray-600 w-28">Joined:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.dateJoined}</span>
          </div>
          <div className="flex">
            <p className="text-sm text-gray-600 w-28">Warehouse:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.warehouseAssigned}</span>
          </div>
          <div className="flex">
            <p className="text-sm text-gray-600 w-28">Status:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.status}</span>
          </div>
          <div className="flex">
            <p className="text-sm text-gray-600 w-28">Role:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.role}</span>
          </div>
          
          <p className="text-sm text-gray-600 font-medium mt-2">Emergency Contact:</p>
          <div className="flex ml-4">
            <p className="text-sm text-gray-600 w-24">Name:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.emName || 'N/A'}</span>
          </div>
          <div className="flex ml-4">
            <p className="text-sm text-gray-600 w-24">Relation:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.emRelation || 'N/A'}</span>
          </div>
          <div className="flex ml-4">
            <p className="text-sm text-gray-600 w-24">Number:</p>
            <span className="font-medium text-gray-900">{selectedEmployee.emNumber || 'N/A'}</span>
          </div>
        </div>
        
        <button 
          onClick={() => downloadReport(selectedEmployee)} 
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg hover:from-purple-500 hover:to-purple-700"
        >
          <Download size={18} /> Download Report
        </button>
      </div>
    </div>
  </div>
)}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && employeeToDelete && (
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
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg hover:from-red-500 hover:to-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStaff;