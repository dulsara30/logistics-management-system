import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Grid, Paper, FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableHead from '@mui/material/TableHead';
import { useNavigate } from 'react-router-dom';


const StyledTableHead = styled(TableHead)(() => ({
  backgroundColor: '#f0f0f0',

}));

const StyledTableCell = styled(TableCell)(() => ({
  color: '#333333',
  fontWeight: 'bold',
  fontSize: 15,
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:hover': {
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
  },
}));


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
} from './vehicleValidations';  

export default function VehicleProfile() {
  const { VehicleNumber } = useParams(); 
  const [vehicleData, setVehicleData] = useState({}); // Store vehicle data
  const [editMode, setEditMode] = useState(false);
  const [errorMessages, setErrorMessages] = useState({}); // Store validation errors
  const [maintenanceData, setMaintenanceData] = useState([]); // Store maintenance data
  const navi = useNavigate();

  const handleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };


  const handleDelete = async () => {
      
    const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
    if (!confirmDelete) return;
  
    try {
     
      await axios.delete(`http://localhost:8000/api/vehicles/${VehicleNumber}`);
      alert("Vehicle deleted successfully.");
      
      // Redirect user after deletion 
      window.location.href = "/fleet"; 
    } catch (error) {
      alert("Error deleting vehicle: " + error);
    }
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

    // Reset error messages before sending the data
    setErrorMessages({});

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
        setMaintenanceData(response.data.Maintenance || []); //Maintenence data
      })
      .catch((error) => {
        alert('Error fetching vehicle details:', error);
      });
  }, [VehicleNumber]); // Re-fetch when vehicleId changes

  return (

  <Box>

    <Paper elevation={3} sx={{ p: 4, margin: 'auto', mt: 5 , borderRadius: 3}}>

      
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
            error={!!errorMessages.VehicleNumber} // Display error
            helperText={errorMessages.VehicleNumber}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
        {editMode ? (
            <FormControl fullWidth>
              <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
              <Select
                labelId="vehicle-type-label"
                name="VehicleType"
                value={vehicleData.VehicleType || ''}
                onChange={handleChange}
                label="Vehicle Type"
              >
                <MenuItem value="">-- Select Vehicle Type --</MenuItem>
                <MenuItem value="Lorry">Lorry</MenuItem>
                <MenuItem value="Van">Van</MenuItem>
                <MenuItem value="Three Wheeler">Three Wheeler</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <TextField
              label="Vehicle Type"
              value={vehicleData.VehicleType || ''}
              fullWidth
              disabled
              InputLabelProps={{ shrink: true }}
            />
          )}

          {errorMessages.VehicleTypeAndFuelType && (
            <Typography variant="body2" color="error">
              {errorMessages.VehicleTypeAndFuelType}
            </Typography>
          )}
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
              color: "white",borderRadius: '12px',
              "&:hover": {
                background: "linear-gradient(to right, #4a00e0, #8e2de2)",
                borderRadius: '12px',
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
              sx={{ mr: 2 ,borderRadius: '12px',}}
            >
              Save
            </Button>
            <Button variant="outlined" onClick={handleEditToggle} sx={{ mr: 2 ,borderRadius: '12px',}}>
              Cancel
            </Button>
          </>
        )}

        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          sx={{ ml: 2 ,borderRadius: '12px'}}
        >
          Delete Vehicle
        </Button>

      </Box>
    </Paper>

    <Paper elevation={3} sx={{ p: 4, margin: 'auto', mt: 5 ,borderRadius: 3}}>

    <Typography variant="h5" sx={{ mb: 4 }}>Vehicle Maintainance</Typography>
      
      <Box  sx={{ mb: '20px' }}>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Table sx={{ minWidth: 700 }} aria-label="vehicle maintenance table">
          <StyledTableHead>
            <TableRow>

             <StyledTableCell>Maintenance ID</StyledTableCell>
              <StyledTableCell >Maintenance Date</StyledTableCell>
              <StyledTableCell >Maintenance Type</StyledTableCell>
              <StyledTableCell >Cost</StyledTableCell>
              <StyledTableCell >Description</StyledTableCell>
            
            </TableRow>
          </StyledTableHead>

          <TableBody>
          {maintenanceData.map((maintenance) => (
            <StyledTableRow
              key={maintenance._id || maintenance.MaintenanceID}
              onClick={() => navi(`VehicleMaintenance/${maintenance._id}`)}
            >
              <TableCell>{maintenance.MaintenanceID}</TableCell>
              <TableCell>{maintenance.MaintenanceDate}</TableCell>
              <TableCell>{maintenance.Type}</TableCell>
              <TableCell>{maintenance.Cost}</TableCell>
              <TableCell>{maintenance.Description}</TableCell>
            </StyledTableRow>
          ))}

          </TableBody>
        </Table>
      </TableContainer>
      </Box>

        <Box>
                <Button
                  variant="contained"
                  onClick={() => navi(`/fleet/VehicleProfile/${vehicleData.VehicleNumber}/vehicleMaintenance`)}
                  sx={{
                    background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    paddingX: 3,
                    paddingY: 1,
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(to right, #7b1fa2, #311b92)',
                    },
                  }}
                >
                  Add Vehicle Maintenance
                </Button>
              </Box>


    </Paper>
  </Box>

  );
}
