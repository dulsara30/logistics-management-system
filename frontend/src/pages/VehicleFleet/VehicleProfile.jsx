import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper
} from '@mui/material';

export default function VehicleProfile() {

  const [editMode, setEditMode] = useState(false);

  const [vehicleData, setVehicleData] = useState({
    registrationNumber: 'ABC-1234',
    type: 'Lorry',
    fuelType: 'Diesel',
    brand: 'Toyota',
    loadCapacity: '1500kg',
    ownerNIC: '123456789V',
    ownerName:'Jack',
    contactNumber: '0771234567',
    address:'Kottawa',
    email:'Jack@email'
  });

  const handleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    // You can add save logic here (e.g., send data to backend)
    setEditMode(false);
  };




  return (

    

    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, margin: 'auto', mt: 5 }}>


      <Typography variant="h5" sx={{mb:4}}>Vehicle Details</Typography>

      <Grid container spacing={2}>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Registration Number"
            name="registrationNumber"
            value={vehicleData.registrationNumber}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Vehicle Type"
            name="type"
            value={vehicleData.type}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Fuel Type"
            name="fuelType"
            value={vehicleData.type}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Brand"
            name="brand"
            value={vehicleData.brand}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Load Capacity"
            name="loadCapacity"
            value={vehicleData.loadCapacity}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Owner NIC"
            name="ownerNIC"
            value={vehicleData.ownerNIC}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Owner Name"
            name="ownerName"
            value={vehicleData.ownerName}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={vehicleData.contactNumber}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Address"
            name="address"
            value={vehicleData.address}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Email Address"
            name="email"
            value={vehicleData.email}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        {!editMode ? (
            /* If condition true*/
          <Button variant="contained" onClick={handleEditToggle}  sx={{
            background: "linear-gradient(to right, #8e2de2, #4a00e0)",
            color: "white",
            "&:hover": {
              background: "linear-gradient(to right, #4a00e0, #8e2de2)",
            },
          }}>Edit Profile</Button>

        ) : ( /* if condtion flase */

          <>
            <Button variant="contained" color="success" onClick={handleSave} sx={{ mr: 2 }}>Save</Button>
            <Button variant="outlined" onClick={handleEditToggle}>Cancel</Button>
          </>
          )
        
        }
      </Box>
    </Paper>






  );



}


