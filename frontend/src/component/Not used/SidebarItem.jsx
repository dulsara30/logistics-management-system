import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

function SidebarItem({to, icon, label, isOpen}){

   
        return (
          <Link
            to={to}
            className="flex items-center gap-3 px-4 py-2 hover:bg-red-600 transition-all duration-300"
          >
            <span className="text-lg">{icon}</span>
            <span
              className={`${
                isOpen ? "block text-sm font-medium" : "hidden"
              } transition-all duration-300`}
            >
              {label}
            </span>
          </Link>
        );
      
}

export default SidebarItem;

