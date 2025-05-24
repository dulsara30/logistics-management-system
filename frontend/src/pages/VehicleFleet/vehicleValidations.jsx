// validation.js

export const validateNIC = (nic) => {
  const nicPattern = /^[0-9]{12,14}v?$/i;

  if (!nicPattern.test(nic)) {
    return "NIC must be between 12-15 characters.";
  }
  return null;
};

export const validateName = (name) => {
  if (name.length < 3 || name.length > 100) {
    return "Owner's name must be between 3 and 100 characters.";
  }
  return null;
};

export const validateContactNumber = (contactNumber) => {
  const contactPattern = /^[0-9]{10}$/;
  if (!contactPattern.test(contactNumber)) {
    return "Contact number must be exactly 10 digits.";
  }
  return null;
};

export const validateAddress = (address) => {
  if (address.length < 5 || address.length > 255) {
    return "Address must be between 5 and 255 characters.";
  }
  return null;
};

export const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(email)) {
    return "Please enter a valid email address.";
  }
  return null;
};

export const validateVehicleNumber = (vehicleNumber) => {
  if (vehicleNumber.length < 4) {
    return "Vehicle number must be more than 4 characters.";
  }
  if (vehicleNumber.length > 20) {
    return "Vehicle number must be less than 20 characters.";
  }
  return null;
};

export const validateVehicleTypeAndFuelType = (vehicleType, fuelType) => {
  if (!vehicleType || !fuelType) {
    return "Please select both vehicle type and fuel type.";
  }
  return null;
};

export const validateVehicleBrand = (vehicleBrand) => {
  if (vehicleBrand.length > 50 || vehicleBrand.length < 1) {
    return "Vehicle brand must be inserted.";
  }
  return null;
};

export const validateLoadCapacity = (loadCapacity) => {
  if (loadCapacity <= 0) {
    return "Load capacity must be a positive number.";
  }
  return null;
};

export const validateDriverSelection = (selectedDriver) => {
  if (!selectedDriver || selectedDriver === '') {
    return "Please assign a driver to the vehicle.";
  }
  return null;
};
