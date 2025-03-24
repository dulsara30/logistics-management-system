import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CombinedMaintenanceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from the URL
  const [formData, setFormData] = useState({
    id: id || "",  // Pre-fill if ID exists in URL
    warehouse: "",
    date: "",
    description: "",
    otherCharges: "",
  });

  const [items, setItems] = useState([{ name: "", qty: "", price: "" }]);
  const [errors, setErrors] = useState({});
  const [maintenanceData, setMaintenanceData] = useState([]);

  // Fetch maintenance data from backend
  useEffect(() => {
    axios.get("http://localhost:8000/api/maintenance")
      .then((response) => {
        setMaintenanceData(response.data); // Set maintenance data
      })
      .catch((error) => console.error("Error fetching maintenance:", error));
  }, []);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Handle maintenance selection
  const handleMaintenanceSelect = (e) => {
    const selectedID = e.target.value;
    const selectedMaintenance = maintenanceData.find((m) => m.ID === selectedID);

    if (selectedMaintenance) {
      setFormData({
        id: selectedID,
        warehouse: selectedMaintenance.warehouse || "",
        date: selectedMaintenance.date || "",
        description: selectedMaintenance.description || "",
        otherCharges: selectedMaintenance.otherCharges || "",
      });
    }
  };

  // Handle item changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  // Add new row to items
  const addNewRow = () => {
    setItems([...items, { name: "", qty: "", price: "" }]);
  };

  // Form validation
  const validateForm = () => {
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== "otherCharges") {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Form Submitted:", formData, "Items:", items);
    
    // Send data to backend
    axios.post("http://localhost:8000/api/submit-maintenance", {
      ...formData,
      items,
    })
    .then(() => navigate("/CorrectiveSubmit"))
    .catch((error) => console.error("Error submitting form:", error));
  };

  return (
    <Box sx={{ width: 600, margin: "auto", padding: 3, boxShadow: 3, bgcolor: "#FFFFFF", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "#333333" }}>
        Corrective Maintenance Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Maintenance Selection */}
          <TextField
            select
            label="Select Maintenance ID"
            name="id"
            value={formData.id}
            onChange={handleMaintenanceSelect}
            fullWidth
            error={!!errors.id}
            helperText={errors.id}
          >
            {maintenanceData.map((m) => (
              <MenuItem key={m.ID} value={m.ID}>
                {m.ID} - {m.warehouse}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Warehouse"
            name="warehouse"
            fullWidth
            value={formData.warehouse}
            onChange={handleChange}
            error={!!errors.warehouse}
            helperText={errors.warehouse}
          />

          <TextField
            label="Date"
            type="date"
            name="date"
            fullWidth
            value={formData.date}
            onChange={handleChange}
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Maintenance Description"
            name="description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />

          <TextField
            label="Price of Other Service Charges"
            name="otherCharges"
            fullWidth
            multiline
            rows={3}
            value={formData.otherCharges}
            onChange={handleChange}
          />

          {/* Items Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price per Item</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        name="name"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, e)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="qty"
                        type="number"
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, e)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="price"
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, e)}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add Item Button */}
          <Button variant="contained" color="primary" onClick={addNewRow}>
            Add more item
          </Button>

          {/* Submit Button */}
          <Button type="submit" variant="contained" sx={{ bgcolor: "#ab47bc", color: "#FFF" }} fullWidth 
          onClick={() => navigate('CorrectiveSubmit')}>
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CombinedMaintenanceForm;



