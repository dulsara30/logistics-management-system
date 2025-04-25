import React, { useState } from 'react';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(() => ({
  marginBottom: '1rem',
}));

const StyledButton = styled(Button)(() => ({
  background: 'linear-gradient(to right, #00b09b, #96c93d)',
  color: '#FFFFFF',
  fontWeight: 'bold',
  borderRadius: '12px',
  paddingX: 3,
  paddingY: 1,
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(to right, #00897b, #8fbc8f)',
  },
}));

const VehicleMaintenanceForm = () => {
  const navigate = useNavigate();
  
  // Using useParams to extract VehicleNumber from the URL
  const { VehicleNumber } = useParams();
  
  const [vehicleNumber, setVehicleNumber] = useState(VehicleNumber || ''); // Initialize state with the URL parameter
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(0); // Initialize cost as a number

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'vehicleNumber':
        setVehicleNumber(value);
        break;
      case 'maintenanceDate':
        setMaintenanceDate(value);
        break;
      case 'maintenanceType':
        setMaintenanceType(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'cost':
        setCost(parseFloat(value)); // Ensure cost is stored as a number
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Validate that all fields are filled
    if (!vehicleNumber || !maintenanceDate || !maintenanceType || !cost) {
      alert('Please fill out all fields.');
      return;
    }

    const maintenanceData = {
      vehicleNumber,
      maintenanceDate,
      maintenanceType,
      description,
      cost,
    };
    console.log('Maintenance Data:', maintenanceData);

    // Navigate back to the fleet management page
    navigate('/vehicleFleetManagement');
  };

  const handleCancel = () => {
    navigate('/vehicleFleetManagement'); // Navigate back without saving
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#2E2E2E', fontWeight: 'bold', mb: 3 }}>
        Add Vehicle Maintenance Details
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Vehicle Number Input */}
        <StyledTextField
          fullWidth
          label="Vehicle Registration Number"
          value={vehicleNumber} // Bind vehicleNumber to input field
          name="vehicleNumber"
          onChange={handleInputChange} // Ensure input changes update state
          InputProps={{ readOnly: true }} // Read-only as required
        />

        <StyledTextField
          fullWidth
          label="Maintenance Date"
          type="date"
          name="maintenanceDate"
          value={maintenanceDate}
          onChange={handleInputChange}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
          <InputLabel id="maintenance-type-label">Maintenance Type</InputLabel>
          <Select
            labelId="maintenance-type-label"
            id="maintenanceType"
            name="maintenanceType"
            value={maintenanceType}
            label="Maintenance Type"
            onChange={handleInputChange}
            required
          >
            <MenuItem value="Routine Service">Routine Service</MenuItem>
            <MenuItem value="Repair">Repair</MenuItem>
            <MenuItem value="Tyre Change">Tyre Change</MenuItem>
            <MenuItem value="Oil Change">Oil Change</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <StyledTextField
          fullWidth
          label="Description"
          name="description"
          value={description}
          onChange={handleInputChange}
          multiline
          rows={4}
          sx={{ marginBottom: '1rem' }}
        />

        <StyledTextField
          fullWidth
          label="Cost (LKR)"
          type="number"
          name="cost"
          value={cost}
          onChange={handleInputChange}
          required
          sx={{ marginBottom: '2rem' }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            onClick={handleCancel}
            variant="outlined"
            sx={{ borderRadius: '12px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <StyledButton type="submit">
            Save Maintenance Details
          </StyledButton>
        </Box>
      </form>
    </Box>
  );
};

export default VehicleMaintenanceForm;
