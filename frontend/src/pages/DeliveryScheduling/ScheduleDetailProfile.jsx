import React, { useState } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  Grid,
} from '@mui/material';

export default function DeliveryScheduleProfile() {
  const [delivery, setDelivery] = useState({
    id: 101,
    destination: 'Colombo',
    date: '2025-03-20',
    status: 'Pending',
  });

  const [editMode, setEditMode] = useState(false);

  
  const handleChange = (e) =>
    setDelivery({ ...delivery, [e.target.name]: e.target.value });

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, margin: 'auto', mt: 5 }}>
      <Typography variant="h6" gutterBottom>
        Delivery Schedule Profile
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Schedule ID"
            value={delivery.id}
            fullWidth
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Destination"
            name="destination"
            value={delivery.destination}
            onChange={handleChange}
            fullWidth
            InputProps={{ readOnly: !editMode }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Date"
            type="date"
            name="date"
            value={delivery.date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: !editMode }}
          />
        </Grid>

        <Grid item xs={12}>
          {editMode ? (
            <TextField
              select
              label="Status"
              name="status"
              value={delivery.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Transit">In Transit</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </TextField>
          ) : (
            <TextField
              label="Status"
              value={delivery.status}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          {!editMode ? (
            <Button variant="contained" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          ) : (
            <Button variant="contained" onClick={() => setEditMode(false)}>
              Save
            </Button>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
