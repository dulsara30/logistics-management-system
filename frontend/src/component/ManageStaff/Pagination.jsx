function Pagination({ currentPage, totalItems, itemsPerPage, setCurrentPage }) {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
    const nextPage = () => {
      if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const prevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    return (
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-white">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(indexOfLastItem, totalItems)}
          </span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </p>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 ${
              currentPage === 1 
                ? 'bg-gray-200 text-gray-600' 
                : 'bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700'
            } rounded-lg transition-colors`}
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button 
            className={`px-4 py-2 ${
              currentPage >= Math.ceil(totalItems / itemsPerPage) 
                ? 'bg-gray-200 text-gray-600' 
                : 'bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700'
            } rounded-lg transition-colors`}
            onClick={nextPage}
            disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
  
  export default Pagination;