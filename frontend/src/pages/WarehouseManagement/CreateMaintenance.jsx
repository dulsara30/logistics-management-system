import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Stack,
  Paper
} from '@mui/material';
import axios from 'axios';

const priorityOptions = ['Low', 'Medium', 'High'];

export default function MaintenanceForm() {
  const [formData, setFormData] = useState({
    requestId: '',
    warehouseId: '',
    issueDescription: '',
    priority: '',
    scheduledDate: '',
    completionDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    

    try {
      // Assuming the backend URL for posting data is 'http://localhost:8000/api/maintenance'
      const response = await axios.post('http://localhost:8000/api/maintenance', formData);
      console.log('Form submitted successfully:', response.data);
      // Optionally, reset the form or navigate to a success page
      setFormData({
        requestId: '',
        warehouseId: '',
        issueDescription: '',
        priority: '',
        scheduledDate: '',
        completionDate: '',
      });
      alert('Maintenance request submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the request. Please try again.');
    }
  };



  const handleCancel = () => {
    // Reset the form data when cancel is clicked
    setFormData({
      requestId: '',
      warehouseId: '',
      issueDescription: '',
      priority: '',
      scheduledDate: '',
      completionDate: '',
    });
    alert('Form has been canceled and cleared.');
  };




  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Add Maintenance Request
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Request ID"
            name="requestId"
            value={formData.requestId}
            onChange={handleChange}
            required
          />
          <TextField
            label="Warehouse ID"
            name="warehouseId"
            value={formData.warehouseId}
            onChange={handleChange}
            required
          />
          <TextField
            label="Issue Description"
            name="issueDescription"
            value={formData.issueDescription}
            onChange={handleChange}
            multiline
            rows={3}
            required
          />
          <TextField
            select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            {priorityOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Requested By"
            name="requestedBy"
            value={formData.requestedBy}
            onChange={handleChange}
            required
          />
          <TextField
            label="Scheduled Date"
            name="scheduledDate"
            type="date"
            value={formData.scheduledDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Completion Date"
            name="completionDate"
            type="date"
            value={formData.completionDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />


          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#7b1fa2', maxWidth: 200 }}>
              Schedule
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{ maxWidth: 200 }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>

        
      </form>
    </Paper>
  );
}
