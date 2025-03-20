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
import { styled } from '@mui/material/styles';

const NewDeliverySchedule = () => {
  const [formData, setFormData] = useState({
    pickupLocation: "Sample Pickup Location",
    dropoffLocation: "Sample Dropoff Location",
    pickupDate: "2025-03-22T10:00",
    deliveryDate: "2025-03-23T12:00",
    packageType: "Fragile",
    quantity: "2",
    vehicle: "Van",
    driver: "Driver A",
    specialInstructions: "Handle with care",
    pickupLatitude: 6.9271,
    pickupLongitude: 79.8612,
    dropoffLatitude: 6.9271,
    dropoffLongitude: 79.8612,
  });

  const [isEditable, setIsEditable] = useState(false);  // New state for edit mode

  const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
      backgroundColor: '#f7f7f7',
      borderRadius: '10px',
    },
    '& .MuiInputLabel-root': {
      color: '#333',
    },
    '& .Mui-disabled': {
      color: '#666',
    },
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const toggleEditMode = () => {
    setIsEditable(!isEditable);
  };

  const handleCancel = () => {
    // Logic for canceling changes, if necessary
    setIsEditable(false);
  };

  return (
    <form style={{ padding: 20 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#333' , mb:4}}>
        Delivery Schedule
      </Typography>

      <Grid container spacing={2}>
        {/* Pickup Location */}
        <Grid item xs={12} sm={6}>
          <StyledTextField
            label="Pickup Location"
            name="pickupLocation"
            fullWidth
            value={formData.pickupLocation}
            onChange={handleChange}
            disabled={!isEditable}
            sx={{ borderRadius: "4px" }}
          />
        </Grid>

        {/* Drop-off Location */}
        <Grid item xs={12} sm={6}>
          <StyledTextField
            label="Drop-off Location"
            name="dropoffLocation"
            fullWidth
            value={formData.dropoffLocation}
            onChange={handleChange}
            disabled={!isEditable}
            sx={{ borderRadius: "4px" }}
          />
        </Grid>

        {/* Map for Pickup Location */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ color: "darkgrey" }}>
            Select Pickup Location
          </Typography>
          <LoadScript googleMapsApiKey="AIzaSyD_lhBUF7rZ651jBwwIn6ZTmnxD5_1zd1A">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={{
                lat: formData.pickupLatitude || 6.9271,
                lng: formData.pickupLongitude || 79.8612,
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
          <Typography variant="subtitle1" sx={{ color: "darkgrey" }}>
            Select Drop-off Location
          </Typography>
          <LoadScript googleMapsApiKey="AIzaSyD_lhBUF7rZ651jBwwIn6ZTmnxD5_1zd1A">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={{
                lat: formData.dropoffLatitude || 6.9271,
                lng: formData.dropoffLongitude || 79.8612,
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
          <StyledTextField
            label="Pickup Date & Time"
            type="datetime-local"
            name="pickupDate"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.pickupDate}
            onChange={handleChange}
            disabled={!isEditable}
            sx={{ borderRadius: "4px" }}
          />
        </Grid>

        {/* Delivery Date and Time */}
        <Grid item xs={12}>
          <StyledTextField
            label="Expected Delivery Date & Time"
            type="datetime-local"
            name="deliveryDate"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.deliveryDate}
            onChange={handleChange}
            disabled={!isEditable}
            sx={{ borderRadius: "4px" }}
          />
        </Grid>

        {/* Package Type */}
        <Grid item xs={12}>
          <StyledTextField
            label="Package Type"
            name="packageType"
            fullWidth
            value={formData.packageType}
            onChange={handleChange}
            disabled={!isEditable}
            sx={{ borderRadius: "4px" }}
          />
        </Grid>

        {/* Quantity */}
        <Grid item xs={12}>
          <StyledTextField
            label="Quantity"
            type="number"
            name="quantity"
            fullWidth
            value={formData.quantity}
            onChange={handleChange}
            disabled={!isEditable}
            sx={{ borderRadius: "4px" }}
          />
        </Grid>

        {/* Driver Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ borderRadius: "4px" }}>
            <InputLabel>Driver</InputLabel>
            <Select
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              label="Driver"
              disabled={!isEditable}
              sx={{ borderRadius: "4px" }}
            >
              <MenuItem value="Driver A">Driver A</MenuItem>
              <MenuItem value="Driver B">Driver B</MenuItem>
              <MenuItem value="Driver C">Driver C</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Special Instructions */}
        <Grid item xs={12}>
          <StyledTextField
            label="Special Instructions"
            name="specialInstructions"
            fullWidth
            multiline
            rows={3}
            value={formData.specialInstructions}
            onChange={handleChange}
            disabled={!isEditable}
            sx={{ borderRadius: "4px" }}
          />
        </Grid>

        {/* Edit/Save and Cancel Buttons */}
        <Grid item xs={1} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            onClick={toggleEditMode}
            sx={{
              background: "linear-gradient(to right, #8e2de2, #4a00e0)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(to right, #4a00e0, #8e2de2)",
              },
            }}
          >
            {isEditable ? "Save" : "Edit"}
          </Button>

          {isEditable && (
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                color: "#4a00e0",
                borderColor: "#4a00e0",
                marginLeft:1,
                "&:hover": {
                  borderColor: "#8e2de2",
                  color: "#8e2de2",
                },
              }}
            >
              Cancel
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

export default NewDeliverySchedule;
