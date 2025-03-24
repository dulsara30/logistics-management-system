import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

export default function WarehouseForm() {
  const navigate = useNavigate();

  // Initialize formData with empty values
  const [formData, setFormData] = useState({
    WarehouseName: "",
    StreetName: "",
    City: "",
    Province: "",
    SpecialInstruction: "",
    Description: "",
    WarehouseSize: "",
    Bulkysecsize: "",
    Hazardoussecsize: "",
    Perishablesecsize: "",
    Sparesecsize: "",
    Otheritems: ""
  });

  // Handle input field changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  

  // Handle form submission (Create)
  const handleSubmit = () => {
    axios
      .post("http://localhost:8000/api/warehouse", formData)
      .then((response) => {
        alert("Warehouse created successfully!" ,response );
        navigate("/WarehouseSubmit");
      })
      .catch((error) => {
        alert("Error creating warehouse:", error);
      });
  };

  return (
    <Grid container spacing={2} sx={{ padding: "16px", maxWidth: "800px", margin: "auto" }}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
          Create Warehouse
        </Typography>

        {/* Warehouse Details */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2 , 1fr)", gap: 2 }}>
        
         
          <TextField
            label="Warehouse Name"
            name="WarehouseName"
            value={formData.WarehouseName}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Street Name"
            name="StreetName"
            value={formData.StreetName}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="City"
            name="City"
            value={formData.City}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Province"
            name="Province"
            value={formData.Province}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Special Instruction"
            name="SpecialInstruction"
            value={formData.SpecialInstruction}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={2}
          />
          
          
        </Box>

        {/* Section Sizes */}
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
                      <TextField
                        name={row.field}
                        type="number"
                        value={formData[row.field] || ""}
                        onChange={handleChange}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create Warehouse
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/WarehouseSubmit")}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}
