import React, { useState } from 'react';
import { TextField, Button, Stack, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CorrectiveForm() {
  const navi = useNavigate();

  // State to hold the form values
  const [formData, setFormData] = useState({
    id: '',
    warehouse: '',
    date: '',
    item: '',
    qty: '',
    price: '',
    description: '',
    otherCharges: '',
  });

  const [errors, setErrors] = useState({});

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors for the current field
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for empty required fields
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== 'otherCharges') {  // 'otherCharges' is optional
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Process the form data
    console.log('Form Submitted:', formData);
    navigate('/CorrectiveSubmit');
  };

  return (
    <Box
      sx={{
        width: 400,
        margin: 'auto',
        padding: 3,
        boxShadow: 3,
        bgcolor: '#FFFFFF',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
        Corrective Maintenance Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="ID"
            variant="outlined"
            fullWidth
            name="id"
            value={formData.id}
            onChange={handleChange}
            error={!!errors.id}
            helperText={errors.id}
          />
          <TextField
            label="Warehouse"
            variant="outlined"
            fullWidth
            name="warehouse"
            value={formData.warehouse}
            onChange={handleChange}
            error={!!errors.warehouse}
            helperText={errors.warehouse}
          />
          <TextField
            label="Date"
            variant="outlined"
            fullWidth
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Item"
            variant="outlined"
            fullWidth
            name="item"
            value={formData.item}
            onChange={handleChange}
            error={!!errors.item}
            helperText={errors.item}
          />
          <TextField
            label="Quantity"
            variant="outlined"
            fullWidth
            type="number"
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            error={!!errors.qty}
            helperText={errors.qty}
          />
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            name="price"
            value={formData.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
          />
          <TextField
            label="Maintenance Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            label="Other Service Charges"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            name="otherCharges"
            value={formData.otherCharges}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" sx={{ bgcolor: '#ab47bc', color: '#FFF' }} fullWidth 
          onClick={() => navi('CorrectiveSubmit')}>
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
}