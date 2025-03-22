import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Grid, Paper, FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Import validation functions
import { 
  validateNIC, 
  validateName, 
  validateContactNumber, 
  validateAddress, 
  validateEmail, 
  validateVehicleNumber, 
  validateVehicleTypeAndFuelType, 
  validateVehicleBrand, 
  validateLoadCapacity, 
  validateDriverSelection 
} from './vehicleValidations';  // Adjust path as needed

export default function VehicleProfile() {
  const { VehicleNumber } = useParams(); // Get the Vehicle ID from the URL
  const [vehicleData, setVehicleData] = useState({}); // Store vehicle data
  const [editMode, setEditMode] = useState(false);
  const [errorMessages, setErrorMessages] = useState({}); // Store validation errors

  const handleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  // Handle Save with validation
  const handleSave = async () => {
    const errors = {};

    // Validate all fields and store error messages
    errors.NIC = validateNIC(vehicleData.OwnersNIC);
    errors.Name = validateName(vehicleData.OwnersName);
    errors.ContactNumber = validateContactNumber(vehicleData.ContactNumber);
    errors.Address = validateAddress(vehicleData.Address);
    errors.Email = validateEmail(vehicleData.Email);
    errors.VehicleNumber = validateVehicleNumber(vehicleData.VehicleNumber);
    errors.VehicleTypeAndFuelType = validateVehicleTypeAndFuelType(vehicleData.VehicleType, vehicleData.FuelType);
    errors.VehicleBrand = validateVehicleBrand(vehicleData.VehicleBrand);
    errors.LoadCapacity = validateLoadCapacity(vehicleData.LoadCapacity);
    errors.DriverSelection = validateDriverSelection(vehicleData.DriverID);

    // Filter out fields with no error message
    const filteredErrors = Object.fromEntries(Object.entries(errors).filter(([key, value]) => value !== null));

    // If there are any errors, show them and prevent save
    if (Object.keys(filteredErrors).length > 0) {
      setErrorMessages(filteredErrors);
      return; // Stop the save process if there are errors
    }

    try {
      // Send the updated vehicle data to the backend
      const response = await axios.put(`http://localhost:8000/api/vehicles/${VehicleNumber}`, vehicleData);

      alert('Vehicle updated successfully:', response.data);

      setEditMode(false); // Exit edit mode after saving

    } catch (error) {
      alert('Error saving vehicle details:', error);
    }
  };

  // Fetch vehicle data from the backend
  useEffect(() => {
    axios.get(`http://localhost:8000/api/vehicles/${VehicleNumber}`)
      .then((response) => {
        setVehicleData(response.data); // Set the fetched data to state
      })
      .catch((error) => {
        alert('Error fetching vehicle details:', error);
      });
  }, [VehicleNumber]); // Re-fetch when vehicleId changes

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, margin: 'auto', mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 4 }}>Vehicle Details</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Registration Number"
            name="VehicleNumber"
            value={vehicleData.VehicleNumber || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{ shrink: true }}
            error={!!errorMessages.VehicleNumber} // Display error if any
            helperText={errorMessages.VehicleNumber}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={!editMode}>
            <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
            <Select
              labelId="vehicle-type-label"
              name="VehicleType"
              value={vehicleData.VehicleType || ''}
              onChange={handleChange}
              label="Vehicle Type"
              disabled={!editMode}
            >
              <MenuItem value="">-- Select Vehicle Type --</MenuItem>
              <MenuItem value="Lorry">Lorry</MenuItem>
              <MenuItem value="Van">Van</MenuItem>
              <MenuItem value="Three Wheeler">Three Wheeler</MenuItem>
            </Select>
            {errorMessages.VehicleTypeAndFuelType && (
              <Typography variant="body2" color="error">
                {errorMessages.VehicleTypeAndFuelType}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={!editMode}>
            <InputLabel id="fuel-type-label">Fuel Type</InputLabel>
            <Select
              labelId="fuel-type-label"
              name="FuelType"
              value={vehicleData.FuelType || ''}
              onChange={handleChange}
              label="Fuel Type"
            >
              <MenuItem value="">-- Select Fuel Type --</MenuItem>
              <MenuItem value="Diesel">Diesel</MenuItem>
              <MenuItem value="Petrol">Petrol</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Brand"
            name="VehicleBrand"
            value={vehicleData.VehicleBrand || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{ shrink: true }}
            error={!!errorMessages.VehicleBrand}
            helperText={errorMessages.VehicleBrand}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Load Capacity"
            name="LoadCapacity"
            value={vehicleData.LoadCapacity || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{ shrink: true }}
            error={!!errorMessages.LoadCapacity}
            helperText={errorMessages.LoadCapacity}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Owner NIC"
            name="OwnersNIC"
            value={vehicleData.OwnersNIC || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{ shrink: true }}
            error={!!errorMessages.NIC}
            helperText={errorMessages.NIC}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Owner Name"
            name="OwnersName"
            value={vehicleData.OwnersName || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{ shrink: true }}
            error={!!errorMessages.Name}
            helperText={errorMessages.Name}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact Number"
            name="ContactNumber"
            value={vehicleData.ContactNumber || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{ shrink: true }}
            error={!!errorMessages.ContactNumber}
            helperText={errorMessages.ContactNumber}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Address"
            name="Address"
            value={vehicleData.Address || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{ shrink: true }}
            error={!!errorMessages.Address}
            helperText={errorMessages.Address}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Email Address"
            name="Email"
            value={vehicleData.Email || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{ shrink: true }}
            error={!!errorMessages.Email}
            helperText={errorMessages.Email}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Driver"
            name="DriverID"
            value={vehicleData.DriverID || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{ shrink: true }}
            error={!!errorMessages.DriverSelection}
            helperText={errorMessages.DriverSelection}
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        {!editMode ? (
          <Button
            variant="contained"
            onClick={handleEditToggle}
            sx={{
              background: "linear-gradient(to right, #8e2de2, #4a00e0)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(to right, #4a00e0, #8e2de2)",
              },
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              sx={{ mr: 2 }}
            >
              Save
            </Button>
            <Button variant="outlined" onClick={handleEditToggle}>
              Cancel
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
}
