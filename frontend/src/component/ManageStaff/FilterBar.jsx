import { Search } from 'lucide-react';

function FilterBar({ searchTerm, setSearchTerm, warehouseFilter, setWarehouseFilter, status, setStatus }) {
  return (
    <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow border border-gray-100">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <select
          value={warehouseFilter}
          onChange={(e) => setWarehouseFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Warehouses</option>
          <option value="Warehouse A">Warehouse A</option>
          <option value="Warehouse B">Warehouse B</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;