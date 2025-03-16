import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="w-full h-16 bg-gray-900 text-white flex justify-between items-center px-6  fixed top-0 left-0 right-0 z-50">
      <div className="text-2xl font-bold">GrocerEase Lanka</div>

 
      <div className="space-x-4">
        <Link to="/signin" className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition">
          Sign In
        </Link>
        <Link to="/signup" className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 transition">
          Sign Up
        </Link>
      </div>
    </header>
  );
}

export default Header;
