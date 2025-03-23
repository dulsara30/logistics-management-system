import React, { useState } from 'react';
import { Check, Search, X, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Custom StatusBadge component with updated color theme
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-700 border border-amber-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Mock data for leave requests
const leaveRequestsData = [
  { 
    id: '1', 
    employee: 'John Smith', 
    type: 'Annual', 
    startDate: new Date('2023-07-15'), 
    endDate: new Date('2023-07-20'), 
    duration: '5 days', 
    status: 'pending', 
    reason: 'Family vacation' 
  },
  { 
    id: '2', 
    employee: 'Sarah Johnson', 
    type: 'Sick', 
    startDate: new Date('2023-07-10'), 
    endDate: new Date('2023-07-12'), 
    duration: '2 days', 
    status: 'approved', 
    reason: 'Doctor appointment' 
  },
  { 
    id: '3', 
    employee: 'David Lee', 
    type: 'Unpaid', 
    startDate: new Date('2023-07-05'), 
    endDate: new Date('2023-07-09'), 
    duration: '4 days', 
    status: 'rejected', 
    reason: 'Personal matters' 
  },
  { 
    id: '4', 
    employee: 'Emma Davis', 
    type: 'Annual', 
    startDate: new Date('2023-07-25'), 
    endDate: new Date('2023-07-27'), 
    duration: '3 days', 
    status: 'pending', 
    reason: 'Short break' 
  },
  { 
    id: '5', 
    employee: 'Michael Brown', 
    type: 'Sick', 
    startDate: new Date('2023-07-17'), 
    endDate: new Date('2023-07-18'), 
    duration: '1 day', 
    status: 'approved', 
    reason: 'Not feeling well' 
  },
];

function ManageLeave() {
  const [leaveRequests, setLeaveRequests] = useState(leaveRequestsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('table');
  const [date, setDate] = useState(new Date());
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // Filter leave requests based on search term
  const filteredRequests = leaveRequests.filter(request =>
    request.employee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get leave requests for the selected date
  const getDateLeaveRequests = (date) => {
    if (!date) return [];
    
    return leaveRequests.filter(request => {
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      const selectedDate = new Date(date);
      
      // Reset time part for comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      return selectedDate >= startDate && selectedDate <= endDate;
    });
  };
  
  const dateLeaveRequests = getDateLeaveRequests(date);

  const handleApproveClick = (id) => {
    setSelectedRequestId(id);
    setApproveModalOpen(true);
  };

  const handleRejectClick = (id) => {
    setSelectedRequestId(id);
    setRejectModalOpen(true);
  };

  const handleApprove = () => {
    const updatedRequests = leaveRequests.map(request =>
      request.id === selectedRequestId ? { ...request, status: 'approved' } : request
    );
    
    setLeaveRequests(updatedRequests);
    setApproveModalOpen(false);
    
    // Show toast notification
    alert("Leave request approved");
  };

  const handleReject = () => {
    const updatedRequests = leaveRequests.map(request =>
      request.id === selectedRequestId ? { ...request, status: 'rejected' } : request
    );
    
    setLeaveRequests(updatedRequests);
    setRejectModalOpen(false);
    
    // Show toast notification
    alert("Leave request rejected");
  };

  // Helper function to generate calendar days
  const generateCalendarDays = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push(dayDate);
    }
    
    return days;
  };

  // Check if a day has any leave requests
  const isLeaveDay = (day) => {
    if (!day) return false;
    
    return leaveRequests.some(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      day.setHours(0, 0, 0, 0);
      
      return day >= start && day <= end;
    });
  };

  // Handle day click in calendar
  const handleDayClick = (day) => {
    if (day) {
      setDate(day);
    }
  };

  // Modal component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
   

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  // Get gradient background class for buttons
  const getPurpleGradientClass = () => {
    return 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white';
  };

  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fadeIn bg-white">
      <h1 className="text-2xl font-bold text-gray-800">Manage Leave Requests</h1>
      
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 border-b-2 ${activeTab === 'table' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'}`}
          onClick={() => setActiveTab('table')}
        >
          Table View
        </button>
        <button
          className={`py-2 px-4 border-b-2 ${activeTab === 'calendar' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar View
        </button>
      </div>
      
      {activeTab === 'table' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">Leave Requests</h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by employee..."
                  className="pl-8 w-full h-10 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{request.employee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={
                        request.type === 'Annual' ? 'text-blue-600' :
                        request.type === 'Sick' ? 'text-red-600' :
                        'text-amber-600'
                      }>
                        {request.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <span>
                        {format(new Date(request.startDate), 'MMM d')} - {format(new Date(request.endDate), 'MMM d, yyyy')}
                        <br />
                        <span className="text-xs text-gray-500">({request.duration})</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <button 
                              className={`px-3 py-1 text-sm rounded-md ${getPurpleGradientClass()} flex items-center`}
                              onClick={() => handleApproveClick(request.id)}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Approve
                            </button>
                            <button 
                              className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() => handleRejectClick(request.id)}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Reject
                            </button>
                          </>
                        )}
                        {request.status !== 'pending' && (
                          <span className="text-sm text-gray-500 italic">
                            {request.status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                      No leave requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 md:col-span-2">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Leave Calendar</h2>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  {format(date, 'MMMM yyyy')}
                </h3>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-gray-500 text-sm py-2">
                    {day}
                  </div>
                ))}
                {generateCalendarDays().map((day, i) => (
                  <div 
                    key={i} 
                    className={`h-12 border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                      !day ? 'border-transparent' : 
                      isLeaveDay(day) ? 'bg-purple-50 text-purple-700 font-medium' : 
                      'hover:bg-gray-50 text-gray-800'
                    } ${
                      day && day.getDate() === date.getDate() && day.getMonth() === date.getMonth() ? 
                      'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => handleDayClick(day)}
                  >
                    {day && day.getDate()}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {format(date, 'MMMM d, yyyy')}
              </h2>
            </div>
            <div className="p-6">
              {dateLeaveRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No leave requests for this date
                </p>
              ) : (
                <div className="space-y-4">
                  {dateLeaveRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-800">{request.employee}</h3>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-sm text-gray-500">{request.type} Leave</p>
                      <p className="text-sm text-gray-700">{request.reason}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(request.startDate), 'MMM d')} - {format(new Date(request.endDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Approve Leave Request"
      >
        <p className="mb-4 text-gray-700">Are you sure you want to approve this leave request?</p>
        <div className="flex justify-end space-x-2">
          <button 
            className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
            onClick={() => setApproveModalOpen(false)}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 text-sm rounded-md ${getPurpleGradientClass()}`}
            onClick={handleApprove}
          >
            Approve
          </button>
        </div>
      </Modal>
      
      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Leave Request"
      >
        <p className="mb-4 text-gray-700">Are you sure you want to reject this leave request?</p>
        <div className="flex justify-end space-x-2">
          <button 
            className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
            onClick={() => setRejectModalOpen(false)}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      </Modal>

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 border border-gray-300  text-gray-700  px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
    </div>
  );
};

export default ManageLeave;