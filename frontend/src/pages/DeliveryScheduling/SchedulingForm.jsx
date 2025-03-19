import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Grid,
} from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const NewDeliverySchedule = () => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    deliveryDate: "",
    packageType: "",
    quantity: "",
    vehicle: "",
    driver: "",
    specialInstructions: "",
    pickupLatitude: null,
    pickupLongitude: null,
    dropoffLatitude: null,
    dropoffLongitude: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // You can send the formData to backend API here
  };



  // Handle the map click to update coordinates and location name
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

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Delivery Schedule Form
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
          />
        </Grid>

        {/* Map for Pickup Location */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Select Pickup Location</Typography>
          <LoadScript googleMapsApiKey="AIzaSyD_lhBUF7rZ651jBwwIn6ZTmnxD5_1zd1A">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={{
                lat: formData.pickupLatitude || 6.9271, // Default to Colombo if not set
                lng: formData.pickupLongitude || 79.8612, // Default to Colombo
              }}
              zoom={12}
              onClick={(event) => handleMapClick(event, true)} // True for pickup
            >
              {formData.pickupLatitude && formData.pickupLongitude && (
                <Marker
                  position={{
                    lat: formData.pickupLatitude,
                    lng: formData.pickupLongitude,
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </Grid>

        {/* Map for Drop-off Location */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Select Drop-off Location</Typography>
          <LoadScript googleMapsApiKey="AIzaSyD_lhBUF7rZ651jBwwIn6ZTmnxD5_1zd1A">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={{
                lat: formData.dropoffLatitude || 6.9271, // Default to Colombo if not set
                lng: formData.dropoffLongitude || 79.8612, // Default to Colombo
              }}
              zoom={12}
              onClick={(event) => handleMapClick(event, false)} // False for dropoff
            >
              {formData.dropoffLatitude && formData.dropoffLongitude && (
                <Marker
                  position={{
                    lat: formData.dropoffLatitude,
                    lng: formData.dropoffLongitude,
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </Grid>

        {/* Pickup Date and Time */}
        <Grid item xs={12}>
          <TextField
            label="Pickup Date & Time"
            type="datetime-local"
            name="pickupDate"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.pickupDate}
            onChange={handleChange}
          />
        </Grid>

        {/* Delivery Date and Time */}
        <Grid item xs={12}>
          <TextField
            label="Expected Delivery Date & Time"
            type="datetime-local"
            name="deliveryDate"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.deliveryDate}
            onChange={handleChange}
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
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              label="Driver"
            >
              <MenuItem value="Driver A">Driver A</MenuItem>
              <MenuItem value="Driver B">Driver B</MenuItem>
              <MenuItem value="Driver C">Driver C</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Special Instructions */}
        <Grid item xs={12}>
          <TextField
            label="Special Instructions"
            name="specialInstructions"
            fullWidth
            multiline
            rows={3}
            value={formData.specialInstructions}
            onChange={handleChange}
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Submit Delivery Schedule
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default NewDeliverySchedule;
