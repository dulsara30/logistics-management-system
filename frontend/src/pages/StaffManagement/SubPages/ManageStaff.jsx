import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Header from '../../../component/ManageStaff/Header';
import FilterBar from '../../../component/ManageStaff/FilterBar';
import EmployeeTable from '../../../component/ManageStaff/EmployeeTable';
import EditModal from '../../../component/ManageStaff/EditModal';
import DeleteModal from '../../../component/ManageStaff/DeleteModal';
import DetailModal from '../../../component/ManageStaff/DetailModal';

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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const BACKEND_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view staff members");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    const getStaff = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:8000/staff/manage-staff", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched staff Data:", data);
        setEmployees(data);
        setFilteredEmployees(data);
      } catch (err) {
        const errorMessage = err.message || "An unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching staff:", err);

        if (errorMessage.includes("Invalid or expired token")) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    getStaff();
  }, [navigate]);

  useEffect(() => {
    if (!employees || !Array.isArray(employees)) return;

    let results = [...employees];

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      results = results.filter(employee =>
        (employee.fullName?.toLowerCase() || '').includes(searchTermLower) ||
        (employee._id?.toString().toLowerCase() || '').includes(searchTermLower) ||
        (employee.email?.toLowerCase() || '').includes(searchTermLower) ||
        (employee.phoneNo?.toLowerCase() || '').includes(searchTermLower) ||
        (employee.NIC?.toLowerCase() || '').includes(searchTermLower)
      );
    }

    if (warehouseFilter) {
      results = results.filter(employee =>
        employee.warehouseAssigned?.toLowerCase() === warehouseFilter.toLowerCase()
      );
    }

    if (status) {
      results = results.filter(employee =>
        employee.status?.toLowerCase() === status.toLowerCase()
      );
    }

    setFilteredEmployees(results);
  }, [searchTerm, warehouseFilter, status, employees]);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleEditClick = (employee) => {
    const formattedEmployee = {
      ...employee,
      DOB: formatDateForInput(employee.DOB),
      dateJoined: formatDateForInput(employee.dateJoined),
    };
    setEditEmployee(formattedEmployee);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editEmployee) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to update a staff member");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/staff/manage-staff/${editEmployee._id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editEmployee),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update employee");
      }

      const updatedEmployee = await res.json();
      setEmployees(employees.map(emp =>
        emp._id === updatedEmployee._id ? updatedEmployee : emp
      ));
      setFilteredEmployees(filteredEmployees.map(emp =>
        emp._id === updatedEmployee._id ? updatedEmployee : emp
      ));
      setIsEditModalOpen(false);
      alert(`User: ${editEmployee.fullName} updated successfully!`);
    } catch (err) {
      const errorMessage = err.message || "An unknown error occurred";
      console.error("Error updating employee:", err);
      setError(errorMessage);

      if (errorMessage.includes("Invalid or expired token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to delete a staff member");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/staff/manage-staff/${employeeToDelete._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete employee");
      }

      setEmployees(employees.filter(emp => emp._id !== employeeToDelete._id));
      setFilteredEmployees(filteredEmployees.filter(emp => emp._id !== employeeToDelete._id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      const errorMessage = err.message || "An unknown error occurred";
      console.error("Error deleting employee:", err);
      setError(errorMessage);

      if (errorMessage.includes("Invalid or expired token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDetailClick = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  };

  const downloadReport = (employee) => {
    const report = `
      Employee Report
      ------------------
      ID: ${employee._id}
      Full Name: ${employee.fullName}
      Email: ${employee.email}
      NIC: ${employee.NIC}
      Phone: ${employee.phoneNo}
      DOB: ${formatDateForDisplay(employee.DOB)}
      Gender: ${employee.gender}
      Address: ${employee.address}
      Profile Picture: ${employee.profilePic}
      Date Joined: ${formatDateForDisplay(employee.dateJoined)}
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

  return (
    <div className="space-y-6">
      <Header />

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        warehouseFilter={warehouseFilter}
        setWarehouseFilter={setWarehouseFilter}
        status={status}
        setStatus={setStatus}
      />

      {isLoading && (
        <div className="text-center py-4">Loading employees...</div>
      )}
      {error && (
        <div className="text-center py-4 text-red-600">Error: {error}</div>
      )}

      {!isLoading && !error && (
        <EmployeeTable
          employees={filteredEmployees}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          handleDetailClick={handleDetailClick}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      )}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <EditModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editEmployee={editEmployee}
        setEditEmployee={setEditEmployee}
        handleSaveEdit={handleSaveEdit}
        isSaving={isSaving}
      />

      <DetailModal
        isDetailModalOpen={isDetailModalOpen}
        setIsDetailModalOpen={setIsDetailModalOpen}
        selectedEmployee={selectedEmployee}
        downloadReport={downloadReport}
        formatDateForDisplay={formatDateForDisplay}
        BACKEND_BASE_URL={BACKEND_BASE_URL}
      />

      <DeleteModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        employeeToDelete={employeeToDelete}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default ManageStaff;