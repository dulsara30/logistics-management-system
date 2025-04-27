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
import { useParams } from "react-router-dom";

const NewDeliverySchedule = () => {
    const { ScheduleID } = useParams();
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
        pickupLatitude: 0,
        pickupLongitude: 0,
        dropoffLatitude: 0,
        dropoffLongitude: 0,
        status: "",
    });

    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(false); // For loading state
    const [error, setError] = useState(""); // For error handling
    const [drivers, setDrivers] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    // Fetch existing data on component mount
    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:8000/api/Delivery/${ScheduleID}`)
            .then((response) => {
                setFormData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError("Error fetching data");
                setLoading(false);
                alert("Error fetching data", error);
            });

        const fetchDrivers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/drivers');
                setDrivers(response.data);
            } catch (error) {
                console.error("Error fetching drivers:", error);
            }
        };

        fetchDrivers();
    }, [ScheduleID]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // First, update the driverUsername
        if (name === "driverUsername") {
            const selectedDriver = drivers.find(driver => driver._id === value); // Assuming _id is the driver's unique ID
            // Set driverName along with driverUsername in the formData
            setFormData((prevData) => ({
                ...prevData,
                driverUsername: value,
                driverName: selectedDriver ? selectedDriver.fullName : "", // Assuming fullName is the driver's name
            }));
            setValidationErrors((prevErrors) => ({ ...prevErrors, driverUsername: "" }));
            return;
        }

        // Update other fields normally
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

        // Handle status update separately
        if (name === "status" && !isEditable) { // Only allow status updates when not in edit mode
            axios
                .put(`http://localhost:8000/api/Delivery/${ScheduleID}`, { status: value })
                .then(() => {
                    alert("Status updated successfully");
                })
                .catch((error) => {
                    setError("Error updating status");
                    alert("Error updating status");
                });
        }
    };


    const handleMapClick = (event, isPickup) => {
        if (!isEditable) return; // Prevent map clicks when not in edit mode
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
            axios
                .put(`http://localhost:8000/api/Delivery/${ScheduleID}`, formData)
                .then(() => {
                    setIsEditable(false); // Switch back to view mode
                    alert("Schedule updated successfully!");
                    setLoading(false);
                })
                .catch((error) => {
                    setError("Error updating delivery schedule");
                    alert("Error updating delivery schedule");
                    setLoading(false);
                });
        } else {
            alert("Please fix the validation errors before saving.");
        }
    };

    const toggleEditMode = () => {
        setIsEditable(!isEditable);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this delivery schedule?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            await axios.delete(`http://localhost:8000/api/Delivery/${ScheduleID}`);
            alert("Delivery schedule deleted successfully");
            window.location.href = "/delivery"; // Redirect after deletion
        } catch (error) {
            setError("Error deleting delivery schedule");
            alert("Error deleting delivery schedule");
        } finally {
            setLoading(false);
        }
    };

    const formattedDeliveryDate = formData.deliveryDate
        ? new Date(formData.deliveryDate).toISOString().slice(0, 16)
        : "";

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

            {error && alert(error)}

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
                        disabled={!isEditable}
                        inputProps={{
                            min: new Date().toISOString().slice(0, 16), // Set min value to the current date and time
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
                                value={formData.driverUsername}
                                onChange={handleChange}
                                disabled={!isEditable}
                            >
                                {drivers.map((driver) => (
                                    <MenuItem key={driver._id} value={driver._id}> {/* Assuming _id is the unique identifier */}
                                        {driver.fullName} ({driver.driverId || driver.username}) {/* Display fullName and a unique identifier */}
                                    </MenuItem>
                                ))}
                            </Select>
                            {validationErrors.driverUsername && <Typography variant="caption" color="error">{validationErrors.driverUsername}</Typography>}
                        </FormControl>
                    ) : (
                        <TextField
                            label="Driver"
                            value={formData.driverName} // Display the driver's name
                            fullWidth
                            disabled={!isEditable}
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
                            displayEmpty
                            disabled={!isEditable} // Disable status editing when in edit mode
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="In Transit">In Transit</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                            <MenuItem value="Cancel">Canceled</MenuItem>
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