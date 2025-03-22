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
import axios from 'axios';


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



export default function VehicleFleetManagement() {

  const navi = useNavigate();

  const [vehicles, setVehicles] = React.useState([]); // State to store vehicles



  // Fetch vehicles from the backend
  React.useEffect(() => {

    axios.get('http://localhost:8000/api/vehicles').then((response) => {

        setVehicles(response.data); // Set the data to state

      }).catch((error) => {

        console.error('Error fetching vehicles:', error);

      });


  }, []); // Empty dependency array means this runs only once when the component mounts


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

            {vehicles.map((vehi) => (

              <StyledTableRow
                key={vehi.VehicleNumber}
                onClick={() => navi(`VehicleProfile/${vehi.VehicleNumber} `)}
              >
                <TableCell component="th" scope="row">{vehi.VehicleNumber}</TableCell>
                <TableCell align="right">{vehi.VehicleType}</TableCell>
                <TableCell align="right">{vehi.VehicleBrand}</TableCell>
                <TableCell align="right">{vehi.OwnersName}</TableCell>
                <TableCell align="right">{vehi.DriverID}</TableCell>
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
