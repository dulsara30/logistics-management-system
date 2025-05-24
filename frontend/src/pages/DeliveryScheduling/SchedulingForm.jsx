import React, { useState, useEffect } from "react";
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
import { useNavigate } from 'react-router-dom';

// Create axios instance with interceptor
const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Adjust to 3001 if backend uses that port
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const NewDeliverySchedule = () => {
    const navigate = useNavigate();
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
        pickupLatitude: 6.9271, // Default: Colombo, Sri Lanka
        pickupLongitude: 79.8612,
        dropoffLatitude: 6.9271,
        dropoffLongitude: 79.8612,
    });

    const [drivers, setDrivers] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await api.get('/drivers');
                setDrivers(response.data);
            } catch (error) {
                console.error("Error fetching drivers:", error);
                alert("Failed to fetch drivers. Please try again.");
            }
        };

        fetchDrivers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

        if (name === "driverUsername") {
            const selectedDriver = drivers.find((driver) => driver._id === value);
            setFormData((prevData) => ({
                ...prevData,
                driverName: selectedDriver ? selectedDriver.fullName : "",
                driverUsername: value,
            }));
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
                    setErrors((prevErrors) => ({ ...prevErrors, pickupLocation: "" }));
                } else {
                    setFormData({
                        ...formData,
                        dropoffLatitude: lat,
                        dropoffLongitude: lng,
                        dropoffLocation: address,
                    });
                    setErrors((prevErrors) => ({ ...prevErrors, dropoffLocation: "" }));
                }
            }
        });
    };

    const handleSubmit = async () => {
        let hasErrors = false;
        const newErrors = {};

        if (!formData.pickupLocation.trim()) {
            newErrors.pickupLocation = "Pickup location is required";
            hasErrors = true;
        }

        if (!formData.dropoffLocation.trim()) {
            newErrors.dropoffLocation = "Drop-off location is required";
            hasErrors = true;
        }

        if (!formData.deliveryDate) {
            newErrors.deliveryDate = "Delivery date is required";
            hasErrors = true;
        }

        if (!formData.packageType.trim()) {
            newErrors.packageType = "Package type is required";
            hasErrors = true;
        }

        if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
            newErrors.quantity = "Quantity must be a number greater than 0";
            hasErrors = true;
        }

        if (!formData.driverUsername) {
            newErrors.driverUsername = "Please select a driver";
            hasErrors = true;
        }

        setErrors(newErrors);

        if (hasErrors) {
            alert("Please fix the validation errors before submitting.");
            return;
        }

        try {
            await api.post("/Delivery", formData);
            alert("Delivery schedule created successfully");
            navigate("/delivery");
        } catch (error) {
            console.error("Error creating delivery schedule:", error);
            alert(`Error creating delivery schedule: ${error.response?.data?.message || 'Unknown error'}`);
        }
    };

    const formattedDeliveryDate = formData.deliveryDate
        ? new Date(formData.deliveryDate).toISOString().slice(0, 16)
        : "";

    // Fallback API key (remove in production)
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyD_lhBUF7rZ651jBwwIn6ZTmnxD5_1zd1A";

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
                        error={!!errors.pickupLocation}
                        helperText={errors.pickupLocation}
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
                        error={!!errors.dropoffLocation}
                        helperText={errors.dropoffLocation}
                    />
                </Grid>

                {/* Google Map for Pickup Location */}
                <Grid item xs={12} sm={6} style={{ height: "400px" }}>
                    <LoadScript googleMapsApiKey={googleMapsApiKey}>
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
                    <LoadScript googleMapsApiKey={googleMapsApiKey}>
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
                            min: new Date().toISOString().slice(0, 16),
                        }}
                        error={!!errors.deliveryDate}
                        helperText={errors.deliveryDate}
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
                        error={!!errors.packageType}
                        helperText={errors.packageType}
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
                        error={!!errors.quantity}
                        helperText={errors.quantity}
                    />
                </Grid>

                {/* Driver Selection */}
                <Grid item xs={12}>
                    <FormControl fullWidth error={!!errors.driverUsername}>
                        <InputLabel>Driver</InputLabel>
                        <Select
                            name="driverUsername"
                            label="Driver"
                            value={formData.driverUsername}
                            onChange={handleChange}
                        >
                            {drivers.map((driver) => (
                                <MenuItem key={driver._id} value={driver._id}>
                                    {driver.fullName} ({driver.driverId || driver.username})
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.driverUsername && (
                            <Typography variant="caption" color="error">
                                {errors.driverUsername}
                            </Typography>
                        )}
                    </FormControl>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12} display="flex" justifyContent="space-between">
                    <Button variant="contained" onClick={handleSubmit}>
                        Create Delivery Schedule
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default NewDeliverySchedule;