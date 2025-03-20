import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Container } from "@mui/material";

export default function RoutingMaintenanceForm() {
  const navi = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    warehouse: '',
    date: '',
    waterBill: '',
    currentBill: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // Add form submission logic here (e.g., API call)
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#fff', p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Routing Maintenance Form</Typography>
        <form onSubmit={handleSubmit} className="space-y-4" style={{ width: '100%' }}>
          <TextField
            label="ID"
            variant="outlined"
            fullWidth
            name="id"
            value={formData.id}
            onChange={handleChange}
            sx={{ mb: 1 }}
            required
          />
          <TextField
            label="Warehouse"
            variant="outlined"
            fullWidth
            name="warehouse"
            value={formData.warehouse}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Date"
            variant="outlined"
            type="date"
            fullWidth
            name="date"
            value={formData.date}
            onChange={handleChange}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Water Bill"
            variant="outlined"
            fullWidth
            name="waterBill"
            value={formData.waterBill}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Current Bill"
            variant="outlined"
            fullWidth
            name="currentBill"
            value={formData.currentBill}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            name="description"
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
            multiline
            rows={4}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 2 ,bgcolor: '#ab47bc',color: '#FFF' }}
            onClick={() => navi('RoutingSubmit')}
            
          >
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
}
