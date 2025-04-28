import React from "react";

const SearchSortBar = ({
  searchTerm,
  onSearchChange,
  sortByDate,
  onSortByDateChange,
  sortByQuantity,
  onSortByQuantityChange,
}) => {
  return (
    <div className="mb-6 flex gap-4">
      <input
        type="text"
        placeholder="Search by Supplier ID, product name, or category"
        className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        value={sortByDate}
        onChange={(e) => {
          onSortByDateChange(e.target.value);
          onSortByQuantityChange("none");
        }}
        className="w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>
      <select
        value={sortByQuantity}
        onChange={(e) => {
          onSortByQuantityChange(e.target.value);
          onSortByDateChange("latest");
        }}
        className="w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="none">Sort by Quantity</option>
        <option value="lowest">Lowest Quantity First</option>
        <option value="highest">Highest Quantity First</option>
      </select>
    </div>
  );
};

export default SearchSortBar;