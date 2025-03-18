import React, { useState } from 'react';
import { Search, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const employees = [
  {
    id: 'EMP001',
    name: 'John Doe',
    position: 'Senior Developer',
    department: 'Engineering',
    status: 'Active'
  },
  // Add more dummy data as needed
];

function ManageStaff() {

    const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');

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
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Employee ID', 'Name', 'Position', 'Department', 'Status', 'Actions'].map((heading) => (
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
            {employees.map((employee, index) => (
              <tr
                key={employee.id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
              >
                <td className="px-6 py-4 text-sm text-gray-900">{employee.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{employee.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{employee.position}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{employee.department}</td>
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
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Edit2 size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-white">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
            <span className="font-medium">20</span> results
          </p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg hover:from-purple-500 hover:to-purple-700 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg hover:from-purple-500 hover:to-purple-700 transition-colors">
              Next
            </button>
          </div>
        </div>


      </div>

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 border border-gray-300  text-gray-700  px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
    </div>
  );
}

export default ManageStaff;
