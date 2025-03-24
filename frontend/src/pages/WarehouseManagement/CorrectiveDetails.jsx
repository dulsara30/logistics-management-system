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
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function CorrectiveMaintenancePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get maintenance ID from the URL
  const [editMode, setEditMode] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    warehouse: "",
    date: "",
    description: "",
    otherCharges: "",
  });

  const [items, setItems] = useState([{ name: "", qty: "", price: "" }]);
  const [errors, setErrors] = useState({});

  // Fetch maintenance records
  useEffect(() => {
    axios.get("http://localhost:8000/api/maintenance")
      .then((response) => {
        setMaintenanceData(response.data);
      })
      .catch((error) => console.error("Error fetching maintenance:", error));
  }, []);

  // When selecting a maintenance record, auto-fill fields
  const handleSelectMaintenance = (e) => {
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

      setItems(selectedMaintenance.items || []);
    }
  };

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle item changes
  const handleItemChange = (index, e) => {
    const updatedItems = [...items];
    updatedItems[index][e.target.name] = e.target.value;
    setItems(updatedItems);
  };

  // Add new row to items
  const addNewRow = () => {
    setItems([...items, { name: "", qty: "", price: "" }]);
  };

  // Enable edit mode
  const handleEdit = () => {
    setEditMode(true);
  };

  // Cancel edit mode
  const handleCancel = () => {
    setEditMode(false);
  };

  // Handle form validation
  const validateForm = () => {
    let newErrors = {};
    if (!formData.warehouse) newErrors.warehouse = "Warehouse is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (update maintenance record)
  const handleSubmit = () => {
    if (!validateForm()) return;

    axios.put(`http://localhost:8000/api/maintenance/${formData.id}`, { ...formData, items })
      .then(() => {
        alert("Maintenance record updated successfully!");
        setEditMode(false);
        navigate("/maintenance");
      })
      .catch((error) => alert("Error updating maintenance:", error));
  };

  // Handle delete maintenance record
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this maintenance record?")) {
      axios.delete(`http://localhost:8000/api/maintenance/${formData.id}`)
        .then(() => {
          alert("Maintenance record deleted successfully!");
          navigate("/maintenance");
        })
        .catch((error) => alert("Error deleting maintenance:", error));
    }
  };

  return (
    <Box sx={{ padding: "16px", maxWidth: "800px", margin: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
        Corrective Maintenance Details
      </Typography>

      {/* Dropdown to Select Maintenance Record */}
      <TextField
        select
        label="Select Maintenance Record"
        value={formData.id}
        onChange={handleSelectMaintenance}
        fullWidthc
        sx={{ mb: 2 }}
      >
        {maintenanceData.map((record) => (
          <MenuItem key={record.ID} value={record.ID}>
            {record.warehouse} - {record.date}
          </MenuItem>
        ))}
      </TextField>

      {/* Maintenance Details Form */}
      <TextField
        label="Warehouse"
        name="warehouse"
        value={formData.warehouse}
        onChange={handleChange}
        variant="filled"
        disabled={!editMode}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        variant="filled"
        disabled={!editMode}
        fullWidth
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        variant="filled"
        disabled={!editMode}
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Other Charges"
        name="otherCharges"
        value={formData.otherCharges}
        onChange={handleChange}
        variant="filled"
        disabled={!editMode}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Maintenance Items Table */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: "bold" }}>
        Maintenance Items
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Item Name</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
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
                    disabled={!editMode}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="qty"
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleItemChange(index, e)}
                    disabled={!editMode}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="price"
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                    disabled={!editMode}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editMode && <Button onClick={addNewRow} sx={{ mt: 2 }}>Add New Item</Button>}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
        {!editMode ? (
          <>
            <Button variant="contained" color="secondary" onClick={handleEdit}>Edit</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </>
        ) : (
          <>
            <Button variant="contained" onClick={handleSubmit}>Save</Button>
            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
          </>
        )}
      </Box>
    </Box>
  );
}
