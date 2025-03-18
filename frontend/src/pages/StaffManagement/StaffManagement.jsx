import { Users, UserPlus, ClipboardList, Calendar, DollarSign, MessageCircle } from "lucide-react";
import * as React from 'react';
import MainCard from "./MainCard";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import RightSidebar from "./RightSidebar.jsx";

export default function StaffManagement(){
  const navigate = useNavigate();
  const location = useLocation();

  const isBaseRoute = location.pathname === "/staff";

  const actionCards = [
      { icon: <Users size={24} />, title: "Manage Staff", desc: "View, Update, Delete Employees", path: "manage-staff" },
      { icon: <UserPlus size={24} />, title: "Add New Staff Member", desc: "Create new employee profiles", path: "add-staff" },
      { icon: <ClipboardList size={24} />, title: "Assign Tasks to Staff", desc: "Delegate and track tasks", path: "assign-tasks" },
      { icon: <Calendar size={24} />, title: "Manage Leave Requests", desc: "Handle time-off requests", path: "leave-requests" },
      { icon: <DollarSign size={24} />, title: "Manage Salary", desc: "Process payroll and benefits", path: "manage-salary" },
      { icon: <MessageCircle size={24} />, title: "Employee's Concerns", desc: "Address staff issues", path: "concerns" },
  ];

  return (
      
        <div>
          {isBaseRoute &&(

          <div className="flex">
          <div className="flex-1 p-8">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                  {actionCards.map((card, index) => (
                      <MainCard 
                          key={index} 
                          icon={card.icon} 
                          title={card.title} 
                          path={card.path} 
                          desc={card.desc} 
                      />
                  ))}
              </div>
          </div> 

              <RightSidebar/>
          </div>

)}
      <main className="p-3">

              <Outlet />
        
      </main>
      </div>
  );
}
