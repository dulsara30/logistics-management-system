import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const MaintenanceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id: id || "",
    warehouse: "",
    date: "",
    maintenanceType: "",
    description: "",
    serviceProvider: "",
    cost: "",
    nextServiceDate: "",
    status: "Pending",
    remarks: "",
    attachments: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      // Fetch existing maintenance record if editing
      axios.get(`http://localhost:8000/api/maintenance/${id}`)
        .then((response) => {
          const data = response.data;
          setFormData({
            ...data,
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
            nextServiceDate: data.nextServiceDate ? new Date(data.nextServiceDate).toISOString().split('T')[0] : ''
          });
        })
        .catch((error) => console.error("Error fetching maintenance:", error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Here you would typically upload the files to your server/storage
    // and get back URLs to store in the attachments array
    // For now, we'll just store the file names
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...files.map(file => file.name)]
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.warehouse) newErrors.warehouse = "Warehouse is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.maintenanceType) newErrors.maintenanceType = "Maintenance type is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.serviceProvider) newErrors.serviceProvider = "Service provider is required";
    if (!formData.cost) newErrors.cost = "Cost is required";
    if (!formData.nextServiceDate) newErrors.nextServiceDate = "Next service date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (id) {
        // Update existing record
        await axios.put(`http://localhost:8000/api/maintenance/${id}`, formData);
      } else {
        // Create new record
        await axios.post("http://localhost:8000/api/maintenance", formData);
      }
      navigate("/maintenance"); // Redirect to maintenance list
    } catch (error) {
      console.error("Error saving maintenance:", error);
      alert("Error saving maintenance record");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "auto" }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {id ? "Edit Maintenance Record" : "Create Maintenance Record"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              name="warehouse"
              label="Warehouse"
              value={formData.warehouse}
              onChange={handleChange}
              error={!!errors.warehouse}
              helperText={errors.warehouse}
              required
            />

            <TextField
              name="date"
              label="Maintenance Date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
              required
            />


            

            <FormControl required error={!!errors.maintenanceType}>
              <InputLabel>Maintenance Type</InputLabel>
              <Select
                name="maintenanceType"
                value={formData.maintenanceType}
                onChange={handleChange}
                label="Maintenance Type"
              >
                <MenuItem value="Preventive">Preventive</MenuItem>
                <MenuItem value="Corrective">Corrective</MenuItem>
                <MenuItem value="Emergency">Emergency</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              required
            />

            <TextField
              name="serviceProvider"
              label="Service Provider"
              value={formData.serviceProvider}
              onChange={handleChange}
              error={!!errors.serviceProvider}
              helperText={errors.serviceProvider}
              required
            />

            <TextField
              name="cost"
              label="Cost"
              type="number"
              value={formData.cost}
              onChange={handleChange}
              error={!!errors.cost}
              helperText={errors.cost}
              required
            />

            <TextField
              name="nextServiceDate"
              label="Next Service Date"
              type="date"
              value={formData.nextServiceDate}
              onChange={handleChange}
              error={!!errors.nextServiceDate}
              helperText={errors.nextServiceDate}
              InputLabelProps={{ shrink: true }}
              required
            />

            <FormControl required error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="remarks"
              label="Remarks"
              multiline
              rows={2}
              value={formData.remarks}
              onChange={handleChange}
            />

            <Button
              variant="contained"
              component="label"
            >
              Upload Attachments
              <input
                type="file"
                hidden
                multiple
                onChange={handleFileChange}
              />
            </Button>

            {formData.attachments.length > 0 && (
              <Box>
                <Typography variant="subtitle2">Attachments:</Typography>
                {formData.attachments.map((file, index) => (
                  <Typography key={index} variant="body2">{file}</Typography>
                ))}
              </Box>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate("/maintenance")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {id ? "Update" : "Create"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default MaintenanceForm;



