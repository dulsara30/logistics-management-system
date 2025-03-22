import React, { useState } from 'react';
import {
  TextField, FormControl, MenuItem, Box, InputLabel,
  Select, Autocomplete, List, ListItem, ListItemButton,
  ListItemText, ListItemAvatar, Avatar, Checkbox,
  Typography,
  Paper
} from '@mui/material';

export default function VehicleRegistrationForm() {
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [loadCapacity, setLoadCapacity] = useState('');
  const [checked, setChecked] = useState([]);
  const [FuelType, setFuelType] = useState('');

  const handleTypeChange = (event) => {
    setVehicleType(event.target.value);
  };

  const handleLoadChange = (event) => {
    setLoadCapacity(event.target.value);
  };

  const handleFuelTypeChange = (event) => {
    setFuelType(event.target.value);
  };

  const handleToggle = (value) => () => {
    setChecked([value]);
  };

  const vehicleBrandOptions = [
    'Toyota', 'Nissan', 'Mitzubhishi', 'Isuzu',
    'Benz', 'Hyundai', 'Honda', 'Bajaj',
    'TATA', 'Leyland', 'Piageo'
  ];

  return (
    <div className="p-16">

      <Paper elevation={0} sx={{ padding: '18px', paddingBottom: '24px' }}>



        <Typography variant='h6' sx={{ mb: 2 }}>Vehicle owner details </Typography>


        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>

          <TextField label="Vehicle Owner's NIC" variant="outlined" fullWidth />

          <TextField label="Vehicle Owner's Name" variant="outlined" fullWidth />

          <TextField
            label="Contact number"
            variant="outlined"
            type="number"
            sx={{
              '& input[type=number]': { MozAppearance: 'textfield' },
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none', margin: 0,
              }
            }}
            fullWidth
          />

          <TextField label="Address" variant="outlined" type="text" fullWidth />

          <TextField label="Email address" variant="outlined" type="text" fullWidth />

        </Box>

      </Paper>



      <Paper elevation={0} sx={{ padding: '18px', paddingBottom: '24px', mt: 4 }}>

        <Typography variant='h6' sx={{ mb: 2 }}>Vehicle details </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>

          <TextField label="Vehicle Registration Number" variant="outlined" fullWidth />

          <FormControl fullWidth>

            <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>

            <Select labelId="vehicle-type-label" value={vehicleType} label="Vehicle Type" onChange={handleTypeChange}>

              <MenuItem value="">-- Select any vehicle type --</MenuItem>
              <MenuItem value="Lorry">Lorry</MenuItem>
              <MenuItem value="Van">Van</MenuItem>
              <MenuItem value="Three wheeler">Three Wheeler</MenuItem>

            </Select>

          </FormControl>



          <FormControl fullWidth>

            <InputLabel id="Fuel-type-label">Fuel Type</InputLabel>

            <Select labelId="Fuel-type-label" value={FuelType} label="Fuel Type" onChange={handleFuelTypeChange}>

              <MenuItem value="">-- Select fuel type--</MenuItem>
              <MenuItem value="Diesel">Diesel</MenuItem>
              <MenuItem value="Petrol">Petrol</MenuItem>
              <MenuItem value="EV">EV</MenuItem>

            </Select>

          </FormControl>

          <FormControl fullWidth>

            <Autocomplete
              freeSolo
              options={vehicleBrandOptions}
              value={vehicleBrand}
              onChange={(event, newValue) => setVehicleBrand(newValue)}
              onInputChange={(event, newInputValue) => setVehicleBrand(newInputValue)}
              renderInput={(params) => <TextField {...params} label="Vehicle Brand" variant="outlined" />}
            />

          </FormControl>

          <TextField label="Load Capacity" variant="outlined" type="number" value={loadCapacity} onChange={handleLoadChange} fullWidth />
       
        </Box>

      </Paper>

      <Box mt={4}>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>

          <Typography variant='h6' sx={{ m: 2 }}>Assign Driver to the vehicle</Typography>

          {[0, 1, 2, 3].map((value) => (

            <ListItem key={value} disablePadding>

              <ListItemButton>

                <ListItemAvatar>
                  <Avatar alt={`Driver ${value + 1}`} src={`/static/images/avatar/${value + 1}.jpg`} />
                </ListItemAvatar>

                <ListItemText primary={`Driver ${value + 1}`} />

              </ListItemButton>

              <Checkbox 
                edge="end" 
                onChange={handleToggle(value)} 
                checked={checked.includes(value)} 
              />

            </ListItem>

          ))}

        </List>
        </Box>


   
    </div>
  );
}