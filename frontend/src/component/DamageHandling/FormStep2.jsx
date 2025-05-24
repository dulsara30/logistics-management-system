import React from 'react';

function FormStep2({ formData, setFormData, onNext, onBack, errors, setErrors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showSupplierField =
    (['Physical', 'Water', 'Chemical', 'Temperature'].includes(formData.damageType) &&
      formData.actionRequired === 'Return') ||
    formData.damageType === 'Production';

  const validate = () => {
    const newErrors = {};
    if (!formData.description) newErrors.description = 'Description is required';
    setErrors(newErrors);
    console.log('FormStep2: Validation result', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      console.log('FormStep2: Validation passed, proceeding to FormStep3');
      onNext();
    } else {
      console.log('FormStep2: Validation failed', errors);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 2: Details</h2>
      {showSupplierField && (
        <div className="mb-4">
          <label htmlFor="supplierName" className="block text-gray-700 font-medium mb-2">
            Supplier Name
          </label>
          <input
            type="text"
            id="supplierName"
            value={formData.supplierName || 'N/A'}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            aria-label="Supplier Name"
          />
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
          Damage Description <span className="text-red-600">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows="4"
          className={`w-full p-2 border ${errors.description ? 'border-red-600' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
          aria-required="true"
          placeholder="Describe the damage (required)"
        ></textarea>
        {errors.description && (
          <div className="text-red-600 text-sm mt-1">{errors.description}</div>
        )}
      </div>
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-300"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default FormStep2;