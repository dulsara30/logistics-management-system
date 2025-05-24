const validateForm = (formData) => {
    const errors = {};
  
    if (!formData.pickupLocation.trim()) {
      errors.pickupLocation = "Pickup location is required";
    }
  
    if (!formData.dropoffLocation.trim()) {
      errors.dropoffLocation = "Drop-off location is required";
    }
  
    if (!formData.deliveryDate) {
      errors.deliveryDate = "Delivery date & time is required";
    }
  
    if (!formData.packageType.trim()) {
      errors.packageType = "Package type is required";
    }
  
    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = "Quantity must be greater than 0";
    }
  
    if (!formData.driver) {
      errors.driver = "Driver selection is required";
    }
  
    if (!formData.pickupLatitude || !formData.pickupLongitude) {
      errors.pickupCoordinates = "Pickup location must be selected on the map";
    }
  
    if (!formData.dropoffLatitude || !formData.dropoffLongitude) {
      errors.dropoffCoordinates = "Drop-off location must be selected on the map";
    }
  
    return errors;
  };
  
  export default validateForm;