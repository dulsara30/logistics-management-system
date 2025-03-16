import { Link } from "react-router-dom";

export default function NavItem({ to, icon, label, isOpen }) {
  return (
    <Link to={to} className="flex items-center space-x-4 p-3 hover:bg-gray-700 rounded-lg transition">
      {icon}
      {isOpen && <span className="text-lg">{label}</span>}
    </Link>
  );
}
