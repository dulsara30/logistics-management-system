import React from 'react';
function FormStep3({ formData, onBack, onReview }) {
    const today = new Date().toISOString().split('T')[0];
  
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 3: Report Info</h2>
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={today}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            aria-label="Report Date"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reportedBy" className="block text-gray-700 font-medium mb-2">
            Reported By
          </label>
          <input
            type="text"
            id="reportedBy"
            value="Dilshan Perera"
            readOnly
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            aria-label="Reported By"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-300"
          >
            Back
          </button>
          <button
            onClick={onReview}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Review & Submit
          </button>
        </div>
      </div>
    );
  }
  
  export default FormStep3;