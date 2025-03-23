import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';


export default function WarehouseForm() {

  const navigate = useNavigate();
  const { WarehouseID } = useParams(); // Get the WarehouseID from the URL params
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({}); // Initialize as an empty object

  useEffect(() => {
    // Fetch warehouse data by ID from the backend
    axios.get(`http://localhost:8000/api/warehouse/${WarehouseID}`)
      .then((response) => {
        setFormData(response.data); // Set the fetched data in state
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching warehouse:', error);
      });
  }, [WarehouseID]); // Re-fetch when WarehouseID changes

  // Handle input field changes (if editing)
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle editing mode
  const handleEdit = () => {
    setEditMode(true);
  };

  // Handle canceling edit mode
  const handleCancel = () => {
    setEditMode(false);
  };

  // Handle form submission (save data)
  const handleSubmit = () => {

    axios
    .put(`http://localhost:8000/api/warehouse/${WarehouseID}`, formData)
    .then((response) => {
      alert("Warehouse updated successfully:", response.data);
      setEditMode(false);
      navigate("/WarehouseSubmit"); // Navigate after successful update
    })
    .catch((error) => {
      alert("Error updating warehouse:", error);
    });

  };

  // Handle delete action
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this warehouse profile?")) {
      console.log("Warehouse profile deleted.");
    }
  };

  return (
    <Grid container spacing={2} sx={{ padding: "16px", maxWidth: "800px", margin: "auto" }}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
          Warehouse Profile
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2 , 1fr)", gap: 2 }}>
          {/* Display Warehouse ID */}
          <TextField
            label="Warehouse ID"
            name="WarehouseID"
            value={formData.WarehouseID || ''}
            variant="filled"
            disabled
            fullWidth
          />
          {/* Editable fields */}
          <TextField
            label="Street Name"
            name="StreetName"
            value={formData.StreetName || ''}
            onChange={handleChange}
            variant="filled"
            disabled={!editMode}
            fullWidth
          />
          <TextField
            label="City"
            name="City"
            value={formData.City || ''}
            onChange={handleChange}
            variant="filled"
            disabled={!editMode}
            fullWidth
          />
          <TextField
            label="Province"
            name="Province"
            value={formData.Province || ''}
            onChange={handleChange}
            variant="filled"
            disabled={!editMode}
            fullWidth
          />
          <TextField
            label="Special Instruction"
            name="SpecialInstruction"
            value={formData.SpecialInstruction || ''}
            onChange={handleChange}
            variant="filled"
            disabled={!editMode}
            fullWidth
            multiline
            rows={4}
          />
          <TextField
            label="Description"
            name="Description"
            value={formData.Description || ''}
            onChange={handleChange}
            variant="filled"
            disabled={!editMode}
            fullWidth
            multiline
            rows={4}
          />
        </Box>

        <Box sx={{ mt: 4 }}>
  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
    Section Sizes
  </Typography>

  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><strong>Section</strong></TableCell>
          <TableCell><strong>Size (sq ft)</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[
          { label: "Bulky Items", field: "Bulkysecsize" },
          { label: "Hazardous Items", field: "Hazardoussecsize" },
          { label: "Perishables", field: "Perishablesecsize" },
          { label: "Spare Parts", field: "Sparesecsize" },
          { label: "Other Items", field: "Otheritems" }
        ].map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.label}</TableCell>
            <TableCell>
              {editMode ? (
                <TextField

                  name={row.field}
                  type="number"
                  value={formData[row.field] || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [row.field]: e.target.value
                    }))
                  }
                  
                  size="small"
                  variant="outlined"
                />
              ) : (
                formData[row.field] || 0
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>


        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
          {!editMode ? (
            <>
              <Button variant="contained" color="secondary" onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" sx={{ backgroundColor: "#ab47bc" }} onClick={handleSubmit}>
                Save
              </Button>
              <Button variant="outlined" color="inherit" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Grid>
  );
}
