import React from "react";
import { useLocation, Link } from "react-router-dom";

function Breadcrumbs() {
  const location = useLocation(); // Get current URL path
  const pathnames = location.pathname.split("/").filter((x) => x); // Remove empty parts

  return (
    <nav className="text-gray-600 text-sm py-2">
      <ul className="flex">
        <li>
          <Link to="/" className="text-blue-500 hover:underline">
            Home
          </Link>
        </li>
        {pathnames.map((path, index) => {
          // Construct URL for each breadcrumb step
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          
          return (
            <li key={index} className="mx-2">
              <span className="text-gray-400"> &gt; </span>
              <Link to={routeTo} className="text-blue-500 hover:underline capitalize">
                {decodeURIComponent(path.replace(/-/g, " "))} {/* Convert URL text to readable format */}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Breadcrumbs;
