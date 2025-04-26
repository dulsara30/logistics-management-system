import React, { useState, useEffect } from 'react';
import {
  TextField, FormControl, MenuItem, Box, InputLabel,
  Select, Autocomplete,
  Typography, Paper, Button
} from '@mui/material';
import axios from 'axios';
import {
  validateNIC, validateName, validateContactNumber, validateAddress,
  validateEmail, validateVehicleNumber,
  validateVehicleTypeAndFuelType, validateVehicleBrand,
  validateLoadCapacity, validateDriverSelection
} from './vehicleValidations';

function VehicleRegistrationForm() {
  // Vehicle owner details
  const [ownersNIC, setOwnersNIC] = useState('');
  const [ownersName, setOwnersName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  // Vehicle details
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [loadCapacity, setLoadCapacity] = useState('');

  // Driver selection
  const [drivers, setDrivers] = useState([]); // List of drivers
  const [selectedDriver, setSelectedDriver] = useState('');

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch drivers on component mount
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/drivers');
        setDrivers(response.data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValidationErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear error on change
    switch (name) {
      case 'ownersNIC': setOwnersNIC(value); break;
      case 'ownersName': setOwnersName(value); break;
      case 'contactNumber': setContactNumber(value); break;
      case 'address': setAddress(value); break;
      case 'email': setEmail(value); break;
      case 'vehicleNumber': setVehicleNumber(value); break;
      case 'vehicleType': setVehicleType(value); break;
      case 'fuelType': setFuelType(value); break;
      case 'vehicleBrand': setVehicleBrand(value); break;
      case 'loadCapacity': setLoadCapacity(value); break;
      default: break;
    }
  };

  const handleDriverChange = (event) => {
    setSelectedDriver(event.target.value);
  };

  const handleSubmit = async () => {
    
    // Clear previous errors before validating again
    setValidationErrors({});

    const errors = {};

    // Validating each field and saving errors
    errors.ownersNIC = validateNIC(ownersNIC);
    errors.ownersName = validateName(ownersName);
    errors.contactNumber = validateContactNumber(contactNumber);
    errors.address = validateAddress(address);
    errors.email = validateEmail(email);
    errors.vehicleNumber = validateVehicleNumber(vehicleNumber);
    errors.vehicleType = validateVehicleTypeAndFuelType(vehicleType, fuelType);
    errors.vehicleBrand = validateVehicleBrand(vehicleBrand);
    errors.loadCapacity = validateLoadCapacity(loadCapacity);
    errors.selectedDriver = validateDriverSelection(selectedDriver);

    setValidationErrors(errors);

    if (Object.values(errors).some(error => error)) {
      return; // Stop submission if there are validation errors
    }

    const vehicleData = {
      OwnersNIC: ownersNIC,
      OwnersName: ownersName,
      ContactNumber: contactNumber,
      Address: address,
      Email: email,
      VehicleNumber: vehicleNumber,
      VehicleType: vehicleType,
      FuelType: fuelType,
      VehicleBrand: vehicleBrand,
      LoadCapacity: parseInt(loadCapacity),
      DriverID: selectedDriver,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/vehicles', vehicleData); 
      console.log('Vehicle created:', response.data);
      alert("Vehicle created successfully!");
      window.location.href = "/fleet"; // Navigate to fleet page
    } catch (error) {
      console.error('Error creating vehicle:', error);
      alert("Failed to create vehicle!");
    }
  };

  const vehicleBrandOptions = ['Toyota', 'Nissan', 'Mitsubishi', 'Isuzu', 'Benz',
    'Hyundai', 'Honda', 'Bajaj', 'TATA', 'Leyland', 'Piaggio'];

  return (
    <div className="p-16">
      <Paper elevation={3} sx={{ p: 4, margin: 'auto', mt: 5, borderRadius: 3 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>Vehicle owner details</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <TextField
            label="Vehicle Owner's NIC"
            variant="outlined"
            fullWidth
            value={ownersNIC}
            onChange={handleInputChange}
            name="ownersNIC"
            error={!!validationErrors.ownersNIC}
            helperText={validationErrors.ownersNIC}
          />
          <TextField
            label="Vehicle Owner's Name"
            variant="outlined"
            fullWidth
            value={ownersName}
            onChange={handleInputChange}
            name="ownersName"
            error={!!validationErrors.ownersName}
            helperText={validationErrors.ownersName}
          />
          <TextField
            label="Contact number"
            variant="outlined"
            type="tel"
            fullWidth
            value={contactNumber}
            onChange={handleInputChange}
            name="contactNumber"
            error={!!validationErrors.contactNumber}
            helperText={validationErrors.contactNumber}
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            value={address}
            onChange={handleInputChange}
            name="address"
            error={!!validationErrors.address}
            helperText={validationErrors.address}
          />
          <TextField
            label="Email address"
            variant="outlined"
            fullWidth
            value={email}
            onChange={handleInputChange}
            name="email"
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, margin: 'auto', mt: 5, borderRadius: 3 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>Vehicle details</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <TextField
            label="Vehicle Registration Number"
            variant="outlined"
            fullWidth
            value={vehicleNumber}
            onChange={handleInputChange}
            name="vehicleNumber"
            error={!!validationErrors.vehicleNumber}
            helperText={validationErrors.vehicleNumber}
          />
          <FormControl fullWidth error={!!validationErrors.vehicleType}>
            <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
            <Select
              labelId="vehicle-type-label"
              value={vehicleType}
              label="Vehicle Type"
              onChange={handleInputChange}
              name="vehicleType"
            >
              <MenuItem value="">-- Select any vehicle type --</MenuItem>
              <MenuItem value="Lorry">Lorry</MenuItem>
              <MenuItem value="Van">Van</MenuItem>
              <MenuItem value="Three wheeler">Three Wheeler</MenuItem>
            </Select>
            {validationErrors.vehicleType && <Typography variant="caption" color="error">{validationErrors.vehicleType}</Typography>}
          </FormControl>

          <FormControl fullWidth error={!!validationErrors.fuelType}>

            <InputLabel id="fuel-type-label">Fuel Type</InputLabel>
            <Select
              labelId="fuel-type-label"
              value={fuelType}
              label="Fuel Type"
              onChange={handleInputChange}
              name="fuelType"
            >
              <MenuItem value="">-- Select fuel type --</MenuItem>
              <MenuItem value="Diesel">Diesel</MenuItem>
              <MenuItem value="Petrol">Petrol</MenuItem>
              <MenuItem value="EV">EV</MenuItem>
            </Select>
            {validationErrors.fuelType && <Typography variant="caption" color="error">{validationErrors.fuelType}</Typography>}
       
          </FormControl>

          <FormControl fullWidth error={!!validationErrors.vehicleBrand}>
            <Autocomplete
              freeSolo
              options={vehicleBrandOptions}
              value={vehicleBrand}
              onChange={(event, newValue) => {
                setVehicleBrand(newValue);
                setValidationErrors(prevErrors => ({ ...prevErrors, vehicleBrand: '' }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vehicle Brand"
                  variant="outlined"
                  error={!!validationErrors.vehicleBrand}
                  helperText={validationErrors.vehicleBrand}
                />
              )}
            />
          </FormControl>

          <TextField
            label="Load Capacity"
            variant="outlined"
            type="number"
            fullWidth
            value={loadCapacity}
            onChange={handleInputChange}
            name="loadCapacity"
            error={!!validationErrors.loadCapacity}
            helperText={validationErrors.loadCapacity}
          />
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, margin: 'auto', mt: 5, borderRadius: 3 }}>
        <Box mt={4}>

        <Typography variant='h6' sx={{ mb: 2 }}>Assign Driver to the vehicle</Typography>

        <FormControl fullWidth error={!!validationErrors.selectedDriver} sx={{ marginTop: 2 }}>
          <InputLabel id="driver-select-label">Select Driver</InputLabel>
          <Select
            labelId="driver-select-label"
            value={selectedDriver}
            onChange={handleDriverChange}
            name="selectedDriver"
            label="Select Driver"
          >
            <MenuItem value="" disabled>
              -- Select a driver --
            </MenuItem>
            {drivers.map((driver) => (
              <MenuItem key={driver.fullName} value={driver.fullName}>
                {driver.fullName}
              </MenuItem>
            ))}
          </Select>

          {validationErrors.selectedDriver && (
            <Typography variant="caption" color="error">{validationErrors.selectedDriver}</Typography>
          )}
        </FormControl>
        
        </Box>
      </Paper>

      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Register Vehicle</Button>
      </Box>
    </div>
  );
}

export default VehicleRegistrationForm;
