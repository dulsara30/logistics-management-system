import React, { useState } from 'react';
import {
  TextField, FormControl, MenuItem, Box, InputLabel,
  Select, Autocomplete, List, ListItem, ListItemButton,
  ListItemText, ListItemAvatar, Avatar, Checkbox
} from '@mui/material';

export default function VehicleRegistrationForm() {
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [loadCapacity, setLoadCapacity] = useState('');
  const [checked, setChecked] = useState([1]);

  const handleTypeChange = (event) => {
    setVehicleType(event.target.value);
  };

  const handleLoadChange = (event) => {
    setLoadCapacity(event.target.value);
  };



  {/* handling the driver selection */}
  
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
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        {/* Vehicle Registration Number */}
        <TextField
          label="Vehicle Registration Number"
          variant="outlined"
          fullWidth
        />

        {/* Vehicle Type */}
        <FormControl fullWidth>
          <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
          <Select
            labelId="vehicle-type-label"
            value={vehicleType}
            label="Vehicle Type"
            onChange={handleTypeChange}
          >
            <MenuItem value="">-- Select any vehicle type --</MenuItem>
            <MenuItem value="Lorry">Lorry</MenuItem>
            <MenuItem value="Van">Van</MenuItem>
            <MenuItem value="Three wheeler">Three Wheeler</MenuItem>
          </Select>
        </FormControl>

        {/* Vehicle Brand */}
        <FormControl fullWidth>
          <Autocomplete
            freeSolo
            options={vehicleBrandOptions}
            value={vehicleBrand}

            onChange={(event, newValue) => setVehicleBrand(newValue)}

            onInputChange={(event, newInputValue) => setVehicleBrand(newInputValue)}

            renderInput={(params) => (
              <TextField {...params} label="Vehicle Brand" variant="outlined" />
            )}

          />
        </FormControl>

        {/* Load Capacity */}
        <TextField
          label="Load Capacity"
          variant="filled"
          type="number"
          value={loadCapacity}
          onChange={handleLoadChange}
          fullWidth
        />
      </Box>

      {/* Checkbox Driver selection */}

      <Box mt={4}>

        <h3>Assign Driver to the vehicle:</h3>

        <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>

          {[0, 1, 2, 3].map((value) => {

            const labelId = `checkbox-list-secondary-label-${value}`;
            return (

              <ListItem
                key={value}
               
                secondaryAction={
                 
                  <Checkbox
                    edge="end"
                    onChange={handleToggle(value)}
                    checked={checked.includes(value)}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />

                }
                disablePadding
              >

                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar alt={`Avatar ${value + 1}`} src={`/static/images/avatar/${value + 1}.jpg`} />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={`Driver ${value + 1}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>


    </div>
  );
}
