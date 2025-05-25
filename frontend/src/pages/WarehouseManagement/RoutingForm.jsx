import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function RoutingMaintenanceForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    warehouse: "",
    date: "",
    waterBill: "",
    currentBill: "",
    description: "",
  });
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make sure this matches your backend URL + mount point
    axios
      .get("http://localhost:8000/api/Warehouse")
      .then((response) => {
        console.log("Fetched warehouses:", response.data);
        setWarehouses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching warehouses:", error);
        alert("Failed to load warehouses.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


// Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form Submitted:", formData);

  try {
    const response = await axios.post("http://localhost:8000/api/routingmaintenance", {
      warehouse: formData.warehouse,
      date: new Date(formData.date).getTime(),  // because your backend expects a **number**, not a string
      waterbill: parseFloat(formData.waterBill),
      currentbill: parseFloat(formData.currentBill),
      description: formData.description,
    });

    console.log("Routing Maintenance Created:", response.data);
    alert("Routing Maintenance Created Successfully!");
    navigate('/warehouse/Maintainance');
  } catch (error) {
    console.error("Error creating Routing Maintenance:", error);
    alert("Failed to create routing maintenance. Please try again.");
  }
};




  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography>Loading warehouses…</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#fff",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          Routing Maintenance Form
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* Warehouse Dropdown */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="warehouse-label">Select Warehouse</InputLabel>
            <Select
              labelId="warehouse-label"
              id="warehouse"
              name="warehouse"
              value={formData.warehouse}
              onChange={handleChange}
              label="Select Warehouse"
              required
            >
              {warehouses.map((w) => (
                <MenuItem key={w.WarehouseID} value={w.WarehouseID}>
                  {w.WarehouseID} — {w.City}, {w.Province}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date Field */}
          <TextField
            label="Maintenance Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            required
          />

          {/* Water Bill Field */}
          <TextField
            label="Water Bill"
            name="waterBill"
            type="number"
            value={formData.waterBill}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            required
          />

          {/* Current Bill Field */}
          <TextField
            label="Current Bill"
            name="currentBill"
            type="number"
            value={formData.currentBill}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            required
          />

          {/* Description Field */}
          <TextField
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 3 }}
          />

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
}
