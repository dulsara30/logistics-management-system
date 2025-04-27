import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Manage Staff</h1>
      <Link to={"/staff/add-staff"}>
        <button className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-500 hover:to-purple-700 transition-colors duration-200">
          Add New Staff
        </button>
      </Link>
    </div>
  );
}

export default Header;