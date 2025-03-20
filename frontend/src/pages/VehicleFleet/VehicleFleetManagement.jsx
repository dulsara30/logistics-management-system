import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



const StyledTableHead = styled(TableHead)(() => ({
  backgroundColor: '#f0f0f0',
 
}));

const StyledTableCell = styled(TableCell)(() => ({
  color: '#333333',
  fontWeight: 'bold',
  fontSize: 15,
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:hover': {
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
  },
}));



// Dummy Data
function createData(Number, Type, Brand, Owner, Drivers, Availability) {
  return { Number, Type, Brand, Owner, Drivers, Availability };
}

const rows = [
  createData('PQ-3536', 'Lorry', 'TATA', 'Kamal Perera', 'Amal Silva', 'Yes'),
  createData('AQ-3530', 'Van', 'Toyota', 'Nimal Rathnayake', 'Sunil Kumara', 'Yes'),
  createData('KQ-3567', 'Truck', 'Ashok Leyland', 'Lal Wickramasinghe', 'Nuwan', 'Yes'),
  createData('PL-8536', 'Bike', 'Bajaj', 'Ruwan Dias', 'Gihan', 'Yes'),
  createData('PT-3596', 'Car', 'Suzuki', 'Tharindu', 'Kasun', 'Yes'),
];

export default function VehicleFleetManagement() {
  const navi = useNavigate();

  return (
    <Box sx={{ p: 4, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      
      <Typography variant="h5" gutterBottom sx={{ color: '#2E2E2E', fontWeight: 'bold', mb: 2 }}>
        Registered Vehicles
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
       
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>Vehicle Registration Number</StyledTableCell>
              <StyledTableCell align="right">Vehicle Type</StyledTableCell>
              <StyledTableCell align="right">Vehicle Brand</StyledTableCell>
              <StyledTableCell align="right">Owner's Name</StyledTableCell>
              <StyledTableCell align="right">Driver's Name</StyledTableCell>
            </TableRow>
          </StyledTableHead>

          <TableBody>
            {rows.map((row) => (
              <StyledTableRow
                key={row.Number}
                onClick={() => navi('VehicleProfile')}
              >
                <TableCell component="th" scope="row">
                  {row.Number}
                </TableCell>
                <TableCell align="right">{row.Type}</TableCell>
                <TableCell align="right">{row.Brand}</TableCell>
                <TableCell align="right">{row.Owner}</TableCell>
                <TableCell align="right">{row.Drivers}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button
          variant="contained"
          onClick={() => navi('vehicleRegistration')}
          sx={{
            background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
            color: '#FFFFFF',
            fontWeight: 'bold',
            borderRadius: '12px',
            paddingX: 3,
            paddingY: 1,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(to right, #7b1fa2, #311b92)',
            },
          }}
        >
          + New Vehicle Registration
        </Button>
      </Box>
    </Box>
  );
}
