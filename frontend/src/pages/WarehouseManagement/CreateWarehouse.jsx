import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Grid, TextField, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';



// enne na
function createData(Section, Size) {
  return { Section, Size };
}

const rows = [
  createData('Bulky item sections', 2),
  createData('Hazardous item section', 1),
  createData('Perishable Items section', 1),
  createData('Spare Parts and Components item section', 1),
  createData('Other items', 2),
];

const totalSize = rows.reduce((sum, row) => sum + row.Size, 0);

export default function CreateWarehouse() {
    
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    warehouseId: '',
    streetName: '',
    city: '',
    province: '',
    instruction: '',
    description: '',
  });

  

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    console.log('Submitted Data:', formData);
    navigate('/WarehouseSubmit'); // your routing path
  };

  return (
    <Grid container spacing={2} sx={{ padding: '16px', maxWidth: '800px', margin: 'auto' }}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
          Warehouse Profile Form
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2 , 1fr)', gap: 2 }}>
          <TextField
            label="Warehouse ID"
            name="warehouseId"
            onChange={handleChange}
            variant="filled"
            fullWidth
          />
          <TextField
            label="Street Name"
            name="streetName"
            onChange={handleChange}
            variant="filled"
            fullWidth
          />
          <TextField
            label="City"
            name="city"
            onChange={handleChange}
            variant="filled"
            fullWidth
          />
          <TextField
            label="Province"
            name="province"
            onChange={handleChange}
            variant="filled"
            fullWidth
        />
        
        <TextField
            label="Special Instruction"
            name="instruction"
            value={formData.instruction}
            onChange={handleChange}
            variant="filled"
            fullWidth
            multiline
            rows={4}
          />
          
          <TextField
            label="Description"
            name="description"
            onChange={handleChange}
            variant="filled"
            fullWidth
            multiline
            rows={4}
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: '100%' }} aria-label="sections table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                  <TableCell><strong>Section</strong></TableCell>
                  <TableCell align="right"><strong>Size (m³)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.Section}>
                    <TableCell>{row.Section}</TableCell>
                    <TableCell align="right">{row.Size}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} style={{ borderBottom: '2px solid black' }} />
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>
                    {totalSize}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" sx={{ backgroundColor: '#ab47bc' }} onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}
