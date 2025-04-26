const items = [
    { name: "Item A", availableQty: 100 },
    { name: "Item B", availableQty: 50 },
    { name: "Item C", availableQty: 200 },
    { name: "Item D", availableQty: 150 },
    { name: "Item E", availableQty: 80 },
    { name: "Item F", availableQty: 120 },
    { name: "Item G", availableQty: 90 },
    { name: "Item H", availableQty: 60 },
    { name: "Item I", availableQty: 110 },
    { name: "Item J", availableQty: 70 },
    { name: "Item K", availableQty: 130 },
    { name: "Item L", availableQty: 40 },
    { name: "Item M", availableQty: 160 },
    { name: "Item N", availableQty: 85 },
    { name: "Item O", availableQty: 95 },
    { name: "Item P", availableQty: 105 },
    { name: "Item Q", availableQty: 65 },
    { name: "Item R", availableQty: 125 },
    { name: "Item S", availableQty: 75 },
    { name: "Item T", availableQty: 115 },
  ];
  
  function FormStep1({ formData, setFormData, onNext, errors, setErrors }) {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  
      // Validate Quantity
      if (name === 'quantity') {
        const selectedItem = items.find((item) => item.name === formData.itemName);
        if (selectedItem && value > selectedItem.availableQty) {
          setErrors({ ...errors, quantity: `Quantity cannot exceed ${selectedItem.availableQty}` });
        } else {
          setErrors({ ...errors, quantity: '' });
        }
      }
    };
  
    const handleSearch = (e) => {
      setFormData({ ...formData, searchTerm: e.target.value });
    };
  
    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes((formData.searchTerm || '').toLowerCase())
    );
  
    const validate = () => {
      const newErrors = {};
      if (!formData.itemName) newErrors.itemName = 'Item Name is required';
      if (!formData.quantity) newErrors.quantity = 'Quantity is required';
      if (!formData.damageType) newErrors.damageType = 'Damage Type is required';
      if (!formData.actionRequired) newErrors.actionRequired = 'Action Required is required';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleNext = () => {
      if (validate()) onNext();
    };
  
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 1: Item Info</h2>
        <div className="mb-4">
          <label htmlFor="searchTerm" className="block text-gray-700 font-medium mb-2">
            Search Items
          </label>
          <input
            type="text"
            id="searchTerm"
            placeholder="Search items..."
            value={formData.searchTerm || ''}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Search items"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="itemName" className="block text-gray-700 font-medium mb-2">
            Item Name
          </label>
          <select
            id="itemName"
            name="itemName"
            value={formData.itemName || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-required="true"
          >
            <option value="">Select an item</option>
            {filteredItems.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name} (Available: {item.availableQty})
              </option>
            ))}
          </select>
          {errors.itemName && <div className="text-red-600 text-sm mt-1">{errors.itemName}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity || ''}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-required="true"
          />
          {errors.quantity && <div className="text-red-600 text-sm mt-1">{errors.quantity}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="damageType" className="block text-gray-700 font-medium mb-2">
            Damage Type
          </label>
          <select
            id="damageType"
            name="damageType"
            value={formData.damageType || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-required="true"
          >
            <option value="">Select damage type</option>
            <option value="Physical">Physical</option>
            <option value="Water">Water</option>
            <option value="Chemical">Chemical</option>
            <option value="Temperature">Temperature</option>
            <option value="Production">Production</option>
          </select>
          {errors.damageType && <div className="text-red-600 text-sm mt-1">{errors.damageType}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="actionRequired" className="block text-gray-700 font-medium mb-2">
            Action Required
          </label>
          <select
            id="actionRequired"
            name="actionRequired"
            value={formData.actionRequired || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-required="true"
          >
            <option value="">Select action</option>
            <option value="Dispose">Dispose</option>
            <option value="Return">Return</option>
          </select>
          {errors.actionRequired && <div className="text-red-600 text-sm mt-1">{errors.actionRequired}</div>}
        </div>
        <div className="flex justify-end">
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
  
  export default FormStep1;