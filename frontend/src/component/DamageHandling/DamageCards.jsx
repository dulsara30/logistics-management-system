import { Link } from 'react-router-dom';
import AddDamage from '../../pages/Return&DamageHandling/AddDamage';

function DamageCards() { 
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Return and Damage Handling</h1>
      <div className="flex flex-wrap justify-center gap-6">
        <Link
          to="add-damage"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer w-full sm:w-80"
        >
          <h3 className="text-xl font-semibold text-gray-800">Add New Damage</h3>
        </Link>
        <Link
          to="view-damage-reports"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer w-full sm:w-80"
        >
          <h3 className="text-xl font-semibold text-gray-800">View Damage Reports</h3>
        </Link>
        <Link
          to="view-returned-items"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer w-full sm:w-80"
        >
          <h3 className="text-xl font-semibold text-gray-800">View Returned Items</h3>
        </Link>
      </div>
    </div>
  );
}

export default DamageCards;