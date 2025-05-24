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
    CircularProgress,
} from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Create axios instance with interceptor
const api = axios.create({
    baseURL: "http://localhost:8000/api", // Adjust to 3001 if backend uses that port
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
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
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

const NewDeliverySchedule = () => {
    const { ScheduleID } = useParams();
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
        status: "",
    });

    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [drivers, setDrivers] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    // Fetch existing data and drivers on mount
    useEffect(() => {
        setLoading(true);
        api
            .get(`/Delivery/${ScheduleID}`)
            .then((response) => {
                setFormData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError("Error fetching delivery schedule");
                toast.error("Error fetching delivery schedule");
                setLoading(false);
            });

        const fetchDrivers = async () => {
            try {
                const response = await api.get("/drivers");
                setDrivers(response.data);
            } catch (error) {
                console.error("Error fetching drivers:", error);
                toast.error("Error fetching drivers");
            }
        };

        fetchDrivers();
    }, [ScheduleID]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "driverUsername") {
            const selectedDriver = drivers.find((driver) => driver._id === value);
            setFormData((prevData) => ({
                ...prevData,
                driverUsername: value,
                driverName: selectedDriver ? selectedDriver.fullName : "",
            }));
            setValidationErrors((prevErrors) => ({ ...prevErrors, driverUsername: "" }));
            return;
        }

        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

        if (name === "status" && !isEditable) {
            api
                .put(`/Delivery/${ScheduleID}`, { status: value })
                .then(() => {
                    toast.success("Status updated successfully");
                })
                .catch((error) => {
                    setError("Error updating status");
                    toast.error("Error updating status");
                });
        }
    };

    const handleMapClick = (event, isPickup) => {
        if (!isEditable) return;
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
                    setValidationErrors((prevErrors) => ({ ...prevErrors, pickupLocation: "" }));
                } else {
                    setFormData({
                        ...formData,
                        dropoffLatitude: lat,
                        dropoffLongitude: lng,
                        dropoffLocation: address,
                    });
                    setValidationErrors((prevErrors) => ({ ...prevErrors, dropoffLocation: "" }));
                }
            }
        });
    };

    const handleSave = () => {
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

        setValidationErrors(newErrors);

        if (!hasErrors) {
            setLoading(true);
            api
                .put(`/Delivery/${ScheduleID}`, formData)
                .then(() => {
                    setIsEditable(false);
                    toast.success("Schedule updated successfully!");
                    setLoading(false);
                })
                .catch((error) => {
                    setError("Error updating delivery schedule");
                    toast.error("Error updating delivery schedule");
                    setLoading(false);
                });
        } else {
            toast.error("Please fix the validation errors before saving.");
        }
    };

    const toggleEditMode = () => {
        setIsEditable(!isEditable);
        setValidationErrors({});
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this delivery schedule?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            await api.delete(`/Delivery/${ScheduleID}`);
            toast.success("Delivery schedule deleted successfully");
            navigate("/delivery");
        } catch (error) {
            setError("Error deleting delivery schedule");
            toast.error("Error deleting delivery schedule");
        } finally {
            setLoading(false);
        }
    };

    const formattedDeliveryDate = formData.deliveryDate
        ? new Date(formData.deliveryDate).toISOString().slice(0, 16)
        : "";

    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyD_lhBUF7rZ651jBwwIn6ZTmnxD5_1zd1A";

    return (
        <form style={{ padding: 20 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#333", mb: 4 }}>
                Delivery Schedule
            </Typography>

            {loading && (
                <Grid container justifyContent="center">
                    <CircularProgress />
                </Grid>
            )}

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Grid container spacing={2}>
                {/* Pickup Location */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Pickup Location"
                        name="pickupLocation"
                        fullWidth
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        disabled={!isEditable}
                        multiline
                        rows={2}
                        error={!!validationErrors.pickupLocation}
                        helperText={validationErrors.pickupLocation}
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
                        disabled={!isEditable}
                        multiline
                        rows={2}
                        error={!!validationErrors.dropoffLocation}
                        helperText={validationErrors.dropoffLocation}
                    />
                </Grid>

                {/* Google Map for Pickup and Dropoff Locations */}
                <Grid item xs={12} sm={6} style={{ height: "400px" }}>
                    <LoadScript googleMapsApiKey={googleMapsApiKey}>
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "100%" }}
                            center={{ lat: formData.pickupLatitude || 6.9271, lng: formData.pickupLongitude || 79.8612 }}
                            zoom={14}
                            onClick={(event) => handleMapClick(event, true)}
                        >
                            <Marker position={{ lat: formData.pickupLatitude || 6.9271, lng: formData.pickupLongitude || 79.8612 }} />
                        </GoogleMap>
                    </LoadScript>
                </Grid>

                <Grid item xs={12} sm={6} style={{ height: "400px" }}>
                    <LoadScript googleMapsApiKey={googleMapsApiKey}>
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "100%" }}
                            center={{ lat: formData.dropoffLatitude || 6.9271, lng: formData.dropoffLongitude || 79.8612 }}
                            zoom={14}
                            onClick={(event) => handleMapClick(event, false)}
                        >
                            <Marker position={{ lat: formData.dropoffLatitude || 6.9271, lng: formData.dropoffLongitude || 79.8612 }} />
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
                        disabled={!isEditable}
                        inputProps={{
                            min: new Date().toISOString().slice(0, 16),
                        }}
                        error={!!validationErrors.deliveryDate}
                        helperText={validationErrors.deliveryDate}
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
                        disabled={!isEditable}
                        error={!!validationErrors.packageType}
                        helperText={validationErrors.packageType}
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
                        disabled={!isEditable}
                        error={!!validationErrors.quantity}
                        helperText={validationErrors.quantity}
                    />
                </Grid>

                {/* Driver Selection */}
                <Grid item xs={12}>
                    {isEditable ? (
                        <FormControl fullWidth error={!!validationErrors.driverUsername}>
                            <InputLabel>Driver</InputLabel>
                            <Select
                                name="driverUsername"
                                label="Driver"
                                value={formData.driverUsername || ""}
                                onChange={handleChange}
                                disabled={!isEditable}
                            >
                                {drivers.map((driver) => (
                                    <MenuItem key={driver._id} value={driver._id}>
                                        {driver.fullName} ({driver.driverId || driver.username})
                                    </MenuItem>
                                ))}
                            </Select>
                            {validationErrors.driverUsername && (
                                <Typography variant="caption" color="error">
                                    {validationErrors.driverUsername}
                                </Typography>
                            )}
                        </FormControl>
                    ) : (
                        <TextField
                            label="Driver"
                            value={formData.driverName || ""}
                            fullWidth
                            disabled
                        />
                    )}
                </Grid>

                {/* Status */}
                <Grid item xs={12}>
                    <FormControl fullWidth sx={{ borderRadius: "4px" }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            label="Status"
                            value={formData.status || ""}
                            onChange={handleChange}
                            disabled={isEditable}
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="In Transit">In Transit</MenuItem>
                            <MenuItem value="Done">Done</MenuItem>
                            <MenuItem value="Canceled">Canceled</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Buttons */}
                <Grid item xs={12} display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        onClick={isEditable ? handleSave : toggleEditMode}
                        disabled={loading}
                    >
                        {isEditable ? "Save" : "Edit"}
                    </Button>
                    {isEditable && (
                        <Button variant="outlined" onClick={toggleEditMode} disabled={loading}>
                            Cancel
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Delete
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default NewDeliverySchedule;