import React, { useState, useEffect } from "react";
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
import axios from 'axios';
import { useParams } from 'react-router-dom';



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
    pickupLatitude: 0,
    pickupLongitude: 0,
    dropoffLatitude: 0,
    dropoffLongitude: 0,
  });



  const [isEditable, setIsEditable] = useState(false);  // edit mode

  const {ScheduleID} = useParams();

  useEffect(() => {
    

    axios.get(`http://localhost:8000/api/Delivery/${ScheduleID}`) 
      .then(response => {
        setFormData(response.data);  
      })
      .catch(error => {
        console.error("Error fetching data", error);
      });
  }, []);  



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
    setIsEditable(false);
  };

  const formattedDeliveryDate = formData.deliveryDate
  ? new Date(formData.deliveryDate).toISOString().slice(0, 16)
  : "";

  return (


    <form style={{ padding: 20 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#333' , mb:4 }}>
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
              onClick={isEditable ? (event) => handleMapClick(event, true) : undefined} 
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
              onClick={isEditable ? (event) => handleMapClick(event, true) : undefined} // False for dropoff
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

        {/* Delivery Date and Time */}
        <Grid item xs={12}>
          <StyledTextField
            label="Expected Delivery Date & Time"
            type="datetime-local"
            name="deliveryDate"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formattedDeliveryDate}
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

        {isEditable ? (
          <FormControl fullWidth sx={{ borderRadius: "4px" }}>
            <InputLabel>Driver</InputLabel>
            <Select
              name="driver"
              value={formData.driver} 
              onChange={handleChange}
              label="Driver"
              sx={{ borderRadius: "4px" }}
            >
              <MenuItem value="Driver A">Driver A</MenuItem>
              <MenuItem value="Driver B">Driver B</MenuItem>
              <MenuItem value="Driver C">Driver C</MenuItem>
            </Select>
          </FormControl>
          ) : (
            <StyledTextField
              label="Driver"
              value={
                formData.driverName && formData.driverUsername
                  ? `${formData.driverName} (${formData.driverUsername})`
                  : ""
              }
              fullWidth
              disabled
    />
  )}
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
