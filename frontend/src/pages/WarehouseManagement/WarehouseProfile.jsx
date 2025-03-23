import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

export default function WarehouseForm() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const { WarehouseID } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/warehouse/${WarehouseID}`);
        setFormData(response.data); // Set the data to state
        console.log('Fetched Data:', response.data); // Log fetched data
      } catch (error) {
        console.error('Error fetching warehouse:', error);
      }
    };

    fetchData(); // Call the async function
  }, [WarehouseID]); // Ensure effect runs when WarehouseID changes

  // Log formData after it has been set in state
  useEffect(() => {
    console.log('formData after state update:', formData);
  }, [formData]); // This will log each time formData changes

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
    setEditMode(false);
    navigate("/WarehouseSubmit"); // Ensure the correct route path
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this warehouse profile?")) {
      console.log("Warehouse profile deleted.");
    }
  };

  console.log(formData.warehouseId);

  return (

    
    <Grid container spacing={2} sx={{ padding: "16px", maxWidth: "800px", margin: "auto" }}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
          Warehouse Profile
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2 , 1fr)", gap: 2 }}>
          <TextField label="Warehouse ID" name="warehouseId" value={formData.warehouseId || ''} variant="filled" disabled fullWidth />
          <TextField label="Street Name" name="streetName" value={formData.streetName || ''} onChange={handleChange} variant="filled" InputProps={{ readOnly: !editMode }} fullWidth />
          <TextField label="City" name="city" value={formData.city || ''} onChange={handleChange} variant="filled" InputProps={{ readOnly: !editMode }} fullWidth />
          <TextField label="Province" name="province" value={formData.province || ''} onChange={handleChange} variant="filled" InputProps={{ readOnly: !editMode }} fullWidth />
          <TextField label="Special Instruction" name="instruction" value={formData.instruction || ''} onChange={handleChange} variant="filled" InputProps={{ readOnly: !editMode }} fullWidth multiline rows={4} />
          <TextField label="Description" name="description" value={formData.description || ''} onChange={handleChange} variant="filled" InputProps={{ readOnly: !editMode }} fullWidth multiline rows={4} />
        </Box>

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
