import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledTextField = styled(TextField)(() => ({
  marginBottom: '1rem',
}));

const StyledButton = styled(Button)(() => ({
  fontWeight: 'bold',
  borderRadius: '12px',
  paddingX: 3,
  paddingY: 1,
  textTransform: 'none',
  '&:hover': {
    // Inherit color to allow customization
  },
}));

const UpdateVehicleMaintenanceForm = () => {
  const navigate = useNavigate();
  const { MaintenanceID } = useParams(); // Get the maintenance record ID from the URL
  const { VehicleNumber } = useParams(); // Optionally get VehicleNumber if needed for context

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaintenanceData = async () => {

      setLoading(true);
      setError('');

      try {

        const response = await axios.get(`http://localhost:8000/api/maintenance/${MaintenanceID}`);
        const data = response.data;
        setVehicleNumber(data.VehicleNumber);
        setMaintenanceDate(data.MaintenanceDate ? data.MaintenanceDate.split('T')[0] : ''); // Extract only the date part
        setMaintenanceType(data.Type);
        setDescription(data.Description || '');
        setCost(String(data.Cost));
console.log(MaintenanceID);

      } catch (err) {
        setError('Error fetching maintenance details.');
        console.error('Error fetching maintenance details:', err);


      } finally {
        setLoading(false);
      }
    };

    if (MaintenanceID) {
      fetchMaintenanceData();
    } else {
      setLoading(false); // If no MaintenanceID, we are not in update mode
    }
  }, [MaintenanceID]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
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
        setCost(value);
        break;
      default:
        break;
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const errors = {};

    if (!maintenanceDate) {
      errors.maintenanceDate = 'Maintenance Date is required.';
    }
    if (!maintenanceType) {
      errors.maintenanceType = 'Maintenance Type is required.';
    }
    if (!cost) {
      errors.cost = 'Cost is required.';
    } else if (isNaN(parseFloat(cost)) || parseFloat(cost) < 0) {
      errors.cost = 'Cost must be a valid non-negative number.';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const updatedMaintenanceData = {
      MaintenanceDate: maintenanceDate,
      Type: maintenanceType,
      Description: description,
      Cost: parseFloat(cost),
    };

    try {
      const response = await axios.put(`http://localhost:8000/api/maintenance/${MaintenanceID}`, updatedMaintenanceData);
      console.log('Maintenance details updated:', response.data);
      alert('Maintenance details updated successfully!');
      navigate(-1);
    } catch (error) {
      console.error('Error updating maintenance details:', error);
      alert('Error updating maintenance details.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await axios.delete(`http://localhost:8000/api/maintenance/${MaintenanceID}`);
        console.log('Maintenance record deleted successfully');
        alert('Maintenance record deleted successfully!');
        navigate(-1);
      } catch (error) {
        console.error('Error deleting maintenance record:', error);
        alert('Error deleting maintenance record.');
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return <Typography variant="h6">Loading maintenance details...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#2E2E2E', fontWeight: 'bold', mb: 3 }}>
        Update/Delete Vehicle Maintenance Details
      </Typography>

      <form onSubmit={handleUpdate}>
        <StyledTextField
          fullWidth
          label="Vehicle Registration Number"
          value={vehicleNumber}
          name="vehicleNumber"
          InputProps={{ readOnly: true }}
          sx={{ marginBottom: '1rem' }}
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
          error={!!validationErrors.maintenanceDate}
          helperText={validationErrors.maintenanceDate}
          sx={{ marginBottom: '1rem' }}
        />

        <FormControl fullWidth sx={{ marginBottom: '1rem' }} error={!!validationErrors.maintenanceType}>
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
          {validationErrors.maintenanceType && (
            <Typography variant="caption" color="error">
              {validationErrors.maintenanceType}
            </Typography>
          )}
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
          error={!!validationErrors.cost}
          helperText={validationErrors.cost}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={handleCancel} variant="outlined" sx={{ borderRadius: '12px', textTransform: 'none' }}>
            Cancel
          </Button>
          <StyledButton
            type="submit"
            sx={{ background: 'linear-gradient(to right, #00b09b, #96c93d)', color: '#FFFFFF' }}
          >
            Update Maintenance
          </StyledButton>
          <Button
            onClick={handleDelete}
            variant="outlined"
            color="error"
            sx={{ borderRadius: '12px', textTransform: 'none' }}
          >
            Delete Maintenance
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateVehicleMaintenanceForm;