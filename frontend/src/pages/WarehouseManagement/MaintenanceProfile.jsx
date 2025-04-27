
import React, { useEffect, useState } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';



const priorityOptions = ['Low', 'Medium', 'High'];

export default function MaintenanceFormTwo() {


  const [editMode, setEditMode] = useState(false); // Edit mode state   
  const { requestId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requestId: '',
    warehouseId: '',
    issueDescription: '',
    priority: '',
    requestedBy: '',
    scheduledDate: '',
    completionDate: '',
  });




  // Handle canceling edit mode
  const handleCancel = () => {
    setEditMode(false);
  };




// Handle editing mode
const handleEdit = () => {
    setEditMode(true);
  };



  
  // Fetch existing maintenance data
  useEffect(() => {
    axios.get(`http://localhost:8000/api/maintenance/${requestId}`)
      .then((res) => {
        const data = res.data;

        // Function to format date to YYYY-MM-DD
        const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        setFormData({
          ...data,
          scheduledDate: formatDate(data.scheduledDate),
          completionDate: formatDate(data.completionDate),
        });
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        alert('Failed to load maintenance data.');
      });
  }, [requestId]);



  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };






  // Update existing record
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/maintenance/${requestId}`, formData);
      alert('Maintenance request updated successfully!');
      navigate('/warehouse/Maintainance');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update request.');
    }
  };






  // Delete record
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this request?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/maintenance/${requestId}`);
        alert('Maintenance request deleted.');
        navigate('/warehouse/Maintainance');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete request.');
      }
    }
  };





  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Edit Maintenance Request
      </Typography>
      <form onSubmit={handleUpdate}>
        <Stack spacing={2}>
          <TextField
            label="Request ID"
            name="requestId"
            value={formData.requestId}
            InputProps={{ readOnly: true }}

            fullWidth
          />
          <TextField
            label="Warehouse ID"
            name="warehouseId"
            value={formData.warehouseId}
            onChange={handleChange}
            fullWidth
            required
            disabled={!editMode}

          />
          <TextField
            label="Issue Description"
            name="issueDescription"
            value={formData.issueDescription}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            required
            disabled={!editMode}

          />
          <TextField
            select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            fullWidth
            required
            disabled={!editMode}

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
            fullWidth
            required
            disabled={!editMode}

          />
          <TextField
            label="Scheduled Date"
            name="scheduledDate"
            type="date"
            value={formData.scheduledDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled={!editMode}
            required
          />

          <TextField
            label="Completion Date"
            name="completionDate"
            type="date"
            value={formData.completionDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled={!editMode}
            required
          />




<Stack direction="row" spacing={2}>
  {!editMode ? (
              <>
                <Button variant="contained" color="secondary" onClick={handleEdit}>
                  Edit
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete}>
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button variant="contained" sx={{ backgroundColor: "#ab47bc" }} onClick={handleUpdate}>
                  Save
                </Button>
                <Button variant="outlined" color="inherit" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            )}
</Stack>

        </Stack>
      </form>
    </Paper>
  );
}
