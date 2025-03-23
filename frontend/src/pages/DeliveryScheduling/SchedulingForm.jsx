import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from 'axios';

const NewDeliverySchedule = () => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    deliveryDate: "",
    packageType: "",
    quantity: "",
    vehicle: "",
    driverName: "",
    driverUsername: "",
    specialInstructions: "",
    pickupLatitude: 6.9271,
    pickupLongitude: 79.8612,
    dropoffLatitude: 6.9271,
    dropoffLongitude: 79.8612,
  });

  const drivers = [
    { driverName: "Driver A", driverUsername: "driver_a" },
    { driverName: "Driver B", driverUsername: "driver_b" },
    { driverName: "Driver C", driverUsername: "driver_c" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "driverName") {
      // Find the selected driver by username
      const selectedDriver = drivers.find((driver) => driver.driverUsername === value);
      setFormData((prevData) => ({
        ...prevData,
        driverName: selectedDriver.driverName,
        driverUsername: selectedDriver.driverUsername, // Store both the name and username
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleMapClick = (event, isPickup) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;

        if (isPickup) {
          setFormData({
            ...formData,
            pickupLatitude: lat,
            pickupLongitude: lng,
            pickupLocation: address,
          });
        } else {
          setFormData({
            ...formData,
            dropoffLatitude: lat,
            dropoffLongitude: lng,
            dropoffLocation: address,
          });
        }
      }
    });
  };

  const handleSubmit = () => {
    axios.post("http://localhost:8000/api/Delivery", formData)
      .then(() => {
        alert("Delivery schedule created successfully");
        window.location.href = "/Delivery";
      })
      .catch((error) => {
        console.error("Error creating delivery schedule:", error);
      });
  };

  const formattedDeliveryDate = formData.deliveryDate
    ? new Date(formData.deliveryDate).toISOString().slice(0, 16)
    : "";

  return (
    <form style={{ padding: 20 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#333', mb: 4 }}>
        Create Delivery Schedule
      </Typography>

      <Grid container spacing={2}>
        {/* Pickup Location */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Pickup Location"
            name="pickupLocation"
            fullWidth
            value={formData.pickupLocation}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>

        {/* Drop-off Location */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Drop-off Location"
            name="dropoffLocation"
            fullWidth
            value={formData.dropoffLocation}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>

        {/* Google Map for Pickup Location */}
        <Grid item xs={12} sm={6} style={{ height: "400px" }}>
          <LoadScript googleMapsApiKey="AIzaSyD_lhBUF7rZ651jBwwIn6ZTmnxD5_1zd1A">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={{ lat: formData.pickupLatitude, lng: formData.pickupLongitude }}
              zoom={14}
              onClick={(event) => handleMapClick(event, true)}
            >
              <Marker position={{ lat: formData.pickupLatitude, lng: formData.pickupLongitude }} />
            </GoogleMap>
          </LoadScript>
        </Grid>

        {/* Google Map for Dropoff Location */}
        <Grid item xs={12} sm={6} style={{ height: "400px" }}>
          <LoadScript googleMapsApiKey="AIzaSyD_lhBUF7rZ651jBwwIn6ZTmnxD5_1zd1A">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={{ lat: formData.dropoffLatitude, lng: formData.dropoffLongitude }}
              zoom={14}
              onClick={(event) => handleMapClick(event, false)}
            >
              <Marker position={{ lat: formData.dropoffLatitude, lng: formData.dropoffLongitude }} />
            </GoogleMap>
          </LoadScript>
        </Grid>

        {/* Delivery Date and Time */}
        <Grid item xs={12}>
          <TextField
            label="Expected Delivery Date & Time"
            type="datetime-local"
            name="deliveryDate"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formattedDeliveryDate}
            onChange={handleChange}
            inputProps={{
              min: new Date().toISOString().slice(0, 16), // Set min value to the current date and time
            }}
          />
        </Grid>

        {/* Package Type */}
        <Grid item xs={12}>
          <TextField
            label="Package Type"
            name="packageType"
            fullWidth
            value={formData.packageType}
            onChange={handleChange}
          />
        </Grid>

        {/* Quantity */}
        <Grid item xs={12}>
          <TextField
            label="Quantity"
            type="number"
            name="quantity"
            fullWidth
            value={formData.quantity}
            onChange={handleChange}
          />
        </Grid>

        {/* Driver Selection */}
        <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Driver</InputLabel>
          <Select
            name="driverName"
            label="Driver"
            value={formData.driverUsername} 
            onChange={handleChange}
          >
            {drivers.map((driver) => (
              <MenuItem key={driver.driverUsername} value={driver.driverUsername}> 
                {driver.driverName} ({driver.driverUsername})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            Create Delivery Schedule
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default NewDeliverySchedule;
