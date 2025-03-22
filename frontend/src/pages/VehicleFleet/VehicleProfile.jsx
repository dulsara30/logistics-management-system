import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';




export default function VehicleProfile() {

  const {VehicleNumber} = useParams(); // Get the Vehicle ID from the URL

  const [vehicleData, setVehicleData] = useState({}); //store vehicle data
  const [editMode, setEditMode] = useState(false);



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



  // Fetch vehicle data from the backend

  useEffect(() => {

    axios.get(`http://localhost:8000/api/vehicles/${VehicleNumber}`).then((response) => {
        setVehicleData(response.data); // Set the fetched data to state
      })

      .catch((error) => {
        console.error('Error fetching vehicle details:', error);
      });


  }, [VehicleNumber]); // Re-fetch when vehicleId changes





  return (

    

    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, margin: 'auto', mt: 5 }}>


      <Typography variant="h5" sx={{mb:4}}>Vehicle Details</Typography>

      <Grid container spacing={2}>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Registration Number"
            name="registrationNumber"
           value={vehicleData.VehicleNumber}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}

            InputLabelProps={{
              shrink: true, // prvent label overlapping
            }}

          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Vehicle Type"
            name="type"
            value={vehicleData.VehicleType}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{
              shrink: true, // prvent label overlapping
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Fuel Type"
            name="fuelType"
            value={vehicleData.FuelType}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{
              shrink: true, // prvent label overlapping
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Brand"
            name="brand"
            value={vehicleData.VehicleBrand}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{
              shrink: true, // prvent label overlapping
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Load Capacity"
            name="loadCapacity"
            value={vehicleData.LoadCapacity}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{
              shrink: true, // prvent label overlapping
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Owner NIC"
            name="ownerNIC"
            value={vehicleData.OwnersNIC}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{
              shrink: true, // prvent label overlapping
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Owner Name"
            name="ownerName"
            value={vehicleData.OwnersName}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{
              shrink: true, // prvent label overlapping
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={vehicleData.ContactNumber}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{
              shrink: true, // prvent label overlapping
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Address"
            name="address"
            value={vehicleData.Address}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{
              shrink: true, // prvent label overlapping
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Email Address"
            name="email"
            value={vehicleData.Email}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{
              shrink: true, // prvent label overlapping
            }}
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


