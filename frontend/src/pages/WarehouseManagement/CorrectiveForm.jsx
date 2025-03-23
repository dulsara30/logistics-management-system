import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CombinedMaintenanceForm = () => {
  const navi = useNavigate();
  
  const [formData, setFormData] = useState({
    id: "",
    warehouse: "",
    date: "",
    description: "",
    otherCharges: "",
  });

  const [items, setItems] = useState([{ name: "", qty: "", price: "" }]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  const addNewRow = () => {
    setItems([...items, { name: "", qty: "", price: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== "otherCharges") {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log("Form Submitted:", formData, "Items:", items);
    navigate("/CorrectiveSubmit");
  };

  return (
    <Box sx={{ width: 600, margin: "auto", padding: 3, boxShadow: 3, bgcolor: "#FFFFFF", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "#333" }}>
        Corrective Maintenance Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="ID" name="id" fullWidth value={formData.id} onChange={handleChange} error={!!errors.id} helperText={errors.id} />
          <TextField label="Warehouse" name="warehouse" fullWidth value={formData.warehouse} onChange={handleChange} error={!!errors.warehouse} helperText={errors.warehouse} />
          <TextField label="Date" type="date" name="date" fullWidth value={formData.date} onChange={handleChange} error={!!errors.date} helperText={errors.date} InputLabelProps={{ shrink: true }} />
          <TextField label="Maintenance Description" name="description" fullWidth multiline rows={4} value={formData.description} onChange={handleChange} error={!!errors.description} helperText={errors.description} />
          <TextField label="Price of Other Service Charges" name="otherCharges" fullWidth multiline rows={3} value={formData.otherCharges} onChange={handleChange} />
          
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
                      <TextField name="name" value={item.name} onChange={(e) => handleItemChange(index, e)} fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField name="qty" type="number" value={item.qty} onChange={(e) => handleItemChange(index, e)} fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField name="price" type="number" value={item.price} onChange={(e) => handleItemChange(index, e)} fullWidth />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Button variant="contained" color="primary" onClick={addNewRow}>
            Add more item
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: "#ab47bc", color: "#FFF" }} fullWidth onClick={() => navi('CorrectiveSubmit')}> 
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CombinedMaintenanceForm;
