import { Link } from 'react-router-dom';

function DamageCards() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-custom-gray-50 to-custom-gray-200 p-5 md:p-10 flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-10 max-w-[700px]">
        <h1 className="text-3xl md:text-5xl font-extrabold text-custom-gray-900 tracking-tight mb-3">
          Return & Damage Handling
        </h1>
        <p className="text-lg text-custom-gray-600 leading-6">
          Manage your damage reports efficiently with our intuitive tools.
        </p>
      </div>

      {/* Cards Section */}
      <div className="flex flex-wrap justify-center gap-7 max-w-[1200px] w-full">
        {/* Card 1: Add New Damage */}
        <Link
          to="add-damage"
          className="group relative bg-white p-7 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-full max-w-[360px] animate-fade-in"
        >
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-custom-indigo-500 to-custom-purple-500 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300 z-0"></div>

          {/* Card Icon */}
          <div className="text-5xl mb-4 text-custom-indigo-500 group-hover:text-custom-indigo-600 transition-colors duration-300 text-center relative z-10">
            +
          </div>

          {/* Card Content */}
          <h3 className="text-xl font-semibold text-custom-gray-700 text-center group-hover:text-custom-indigo-600 transition-colors duration-300 relative z-10 mb-2">
            Add New Damage
          </h3>
          <p className="text-sm text-custom-gray-500 leading-5 text-center relative z-10">
            Report a new damage to your inventory items quickly and easily.
          </p>
        </Link>

        {/* Card 2: View Damage Reports */}
        <Link
          to="view-damage-reports"
          className="group relative bg-white p-7 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-full max-w-[360px] animate-fade-in"
          style={{ animationDelay: '0.1s' }}
        >
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-custom-indigo-500 to-custom-purple-500 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300 z-0"></div>

          {/* Card Icon */}
          <div className="text-5xl mb-4 text-custom-indigo-500 group-hover:text-custom-indigo-600 transition-colors duration-300 text-center relative z-10">
            📄
          </div>

          {/* Card Content */}
          <h3 className="text-xl font-semibold text-custom-gray-700 text-center group-hover:text-custom-indigo-600 transition-colors duration-300 relative z-10 mb-2">
            View Damage Reports
          </h3>
          <p className="text-sm text-custom-gray-500 leading-5 text-center relative z-10">
            Review and manage all existing damage reports in one place.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default DamageCards;