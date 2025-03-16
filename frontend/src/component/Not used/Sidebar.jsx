import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import SidebarItem from "./SidebarItem";
import Header from "./Header";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (

    <main>
    <div
      className={`fixed top-16 left-0  h-screen ${
        isOpen ? "w-56" : "w-16"
      } bg-gray-900 text-white flex flex-col transition-all duration-300 shadow-lg`}
    >
      {/* Toggle Button */}
      <button className="p-4 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        <FaBars size={24} />
      </button>

      {/* Navigation Links */}
      <nav className="mt-5 space-y-2">
        <SidebarItem to="/" icon="🏠" label="Home" isOpen={isOpen} />
        <SidebarItem to="/warehouse-management" icon="🏢" label="Warehouse" isOpen={isOpen} />
        <SidebarItem to="/fleet" icon="🚚" label="Vehicle Fleet" isOpen={isOpen} />
        <SidebarItem to="/delivery" icon="📦" label="Delivery" isOpen={isOpen} />
        <SidebarItem to="/inventory" icon="📊" label="Inventory" isOpen={isOpen} />
        <SidebarItem to="/staff" icon="👥" label="Staff" isOpen={isOpen} />
        <SidebarItem to="/suppliers" icon="📜" label="Suppliers" isOpen={isOpen} />
        <SidebarItem to="/return&damage" icon="🔄" label="Returns & Damage" isOpen={isOpen} />
        <SidebarItem to="/help" icon="❓" label="Help" isOpen={isOpen} />
      </nav>
    </div>

    </main>
  );
}


export default Sidebar;

