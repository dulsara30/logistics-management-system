import React, { useState } from 'react';
import {
  TextField, FormControl, MenuItem, Box, InputLabel,
  Select, Autocomplete, List, ListItem, ListItemButton,
  ListItemText, ListItemAvatar, Avatar, Checkbox,
  Typography, Paper, Button
} from '@mui/material';
import axios from 'axios'; 
import { validateNIC, validateName, validateContactNumber, validateAddress, 
  validateEmail, validateVehicleNumber,
   validateVehicleTypeAndFuelType, validateVehicleBrand, 
   validateLoadCapacity, validateDriverSelection } from './vehicleValidations'

export default function VehicleRegistrationForm() {
  // Vehicle owner details
  const [ownersNIC, setOwnersNIC] = useState('');
  const [ownersName, setOwnersName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  // Vehicle details
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [loadCapacity, setLoadCapacity] = useState('');

  // Driver selection
  const [checked, setChecked] = useState([]);

  const handleToggle = (value) => () => {
    setChecked([value]); // only one driver allowed
  };


  //Validations

  const handleSubmit = async () => {
  // Validate inputs
  let validationMessage = validateNIC(ownersNIC) || 
                          validateName(ownersName) || validateContactNumber(contactNumber) || 
                          validateAddress(address) || validateEmail(email) || 
                          validateVehicleNumber(vehicleNumber) || 
                          validateVehicleTypeAndFuelType(vehicleType, fuelType) || 
                          validateVehicleBrand(vehicleBrand) || validateLoadCapacity(loadCapacity) ||
                          validateDriverSelection(checked);

  if (validationMessage) {
    alert(validationMessage);
    return;
  }

  const driverID = `Driver${checked[0] + 1}`;

    const vehicleData = {
      OwnersNIC: ownersNIC,
      OwnersName: ownersName,
      ContactNumber: contactNumber,
      Address: address,
      Email: email,
      VehicleNumber: vehicleNumber,
      VehicleType: vehicleType,
      FuelType: fuelType,
      VehicleBrand: vehicleBrand,
      LoadCapacity: parseInt(loadCapacity),
      DriverID: driverID,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/vehicles', vehicleData); // Adjust endpoint
      console.log('Vehicle created:', response.data);
      alert("Vehicle created successfully!");
      window.location.href = "/fleet"; 
    } catch (error) {
      console.error('Error creating vehicle:', error);
      alert("Failed to create vehicle!");
    }
  };

  const vehicleBrandOptions = ['Toyota', 'Nissan', 'Mitzubhishi', 'Isuzu', 'Benz', 
                              'Hyundai', 'Honda', 'Bajaj', 'TATA', 'Leyland', 'Piageo'];

  return (
    <div className="p-16">

     <Paper elevation={3} sx={{ p: 4, margin: 'auto', mt: 5 , borderRadius: 3}}>

        <Typography variant='h6' sx={{ mb: 2 }}>Vehicle owner details</Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>

          <TextField label="Vehicle Owner's NIC" 
          variant="outlined" 
          fullWidth value={ownersNIC} onChange={(e) => setOwnersNIC(e.target.value)} />

          <TextField label="Vehicle Owner's Name" 
          variant="outlined" 
          fullWidth value={ownersName} onChange={(e) => setOwnersName(e.target.value)} />

          <TextField label="Contact number" 
          variant="outlined" type="tel" 
          fullWidth value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
          
          <TextField label="Address"
           variant="outlined" 
           type="text" fullWidth value={address} onChange={(e) => setAddress(e.target.value)} />
          
          <TextField label="Email address" 
          variant="outlined" type="text" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />

          
        </Box>

      </Paper>

      <Paper elevation={3} sx={{ p: 4, margin: 'auto', mt: 5 , borderRadius: 3}}>

        <Typography variant='h6' sx={{ mb: 2 }}>Vehicle details</Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>

          <TextField label="Vehicle Registration Number" 
          variant="outlined" fullWidth value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />

          <FormControl fullWidth>

            <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>

            <Select labelId="vehicle-type-label" 
            value={vehicleType} label="Vehicle Type" onChange={(e) => setVehicleType(e.target.value)}>

              <MenuItem value="">-- Select any vehicle type --</MenuItem>
              <MenuItem value="Lorry">Lorry</MenuItem>
              <MenuItem value="Van">Van</MenuItem>
              <MenuItem value="Three wheeler">Three Wheeler</MenuItem>

            </Select>

          </FormControl>

          <FormControl fullWidth>

            <InputLabel id="fuel-type-label">Fuel Type</InputLabel>

            <Select labelId="fuel-type-label" 
            value={fuelType} label="Fuel Type" onChange={(e) => setFuelType(e.target.value)}>

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

          <TextField label="Load Capacity" 
          variant="outlined" type="number" 
          fullWidth value={loadCapacity} onChange={(e) => setLoadCapacity(e.target.value)} />

        </Box>

      </Paper>

      <Paper elevation={3} sx={{ p: 4, margin: 'auto', mt: 5 , borderRadius: 3}}>
      <Box mt={4}>

        <Typography variant='h6' sx={{ mb: 2 }}>Assign Driver to the vehicle</Typography>

        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>

          {[0, 1, 2, 3].map((value) => (

            <ListItem key={value} disablePadding>

              <ListItemButton>

                <ListItemAvatar>

                  <Avatar alt={`Driver ${value + 1}`} src={`/static/images/avatar/${value + 1}.jpg`} />

                </ListItemAvatar>

                <ListItemText primary={`Driver ${value + 1}`} />

              </ListItemButton>

              <Checkbox edge="end" onChange={handleToggle(value)} checked={checked.includes(value)} />

            </ListItem>
          ))}
        </List>
      </Box>
      </Paper>

      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Register Vehicle</Button>
      </Box>
      
    </div>
  );
}
