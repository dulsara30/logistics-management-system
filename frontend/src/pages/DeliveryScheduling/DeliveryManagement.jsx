import React from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const deliveryData = [
  { id: 1, pickup: 'Malabe', destination: 'Colombo', date: '2025-03-20', status: 'Pending' },
  { id: 2, pickup: 'Malabe', destination: 'Kandy', date: '2025-03-21', status: 'In Transit' },
  { id: 3, pickup: 'Malabe', destination: 'Galle', date: '2025-03-22', status: 'Done' },
  { id: 4, pickup: 'Malabe', destination: 'Matara', date: '2025-03-23', status: 'Pending' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return '#f57c00';
    case 'In Transit':
      return '#0288d1';
    case 'Done':
      return '#2e7d32';
    default:
      return '#616161';
  }
};



const StyledTableHead = styled(TableHead)(() => ({
  backgroundColor: '#f0f0f0',
}));

const StyledTableCellHead = styled(TableCell)(() => ({
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

export default function DeliveryManagement() {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 4, backgroundColor: '#ffffff', minHeight: '100vh' }}>

      <Typography variant="h5"  gutterBottom sx={{ color: '#2E2E2E', fontWeight: 'bold', mb: 2 }}>
        Delivery Management
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableCellHead>ID</StyledTableCellHead>
              <StyledTableCellHead>Pickup</StyledTableCellHead>
              <StyledTableCellHead>Destination</StyledTableCellHead>
              <StyledTableCellHead>Date</StyledTableCellHead>
              <StyledTableCellHead>Status</StyledTableCellHead>
            </TableRow>
          </StyledTableHead>

          <TableBody>
            {deliveryData.map((row) => (
              <StyledTableRow key={row.id} onClick={() => navigate('DeliveryProfile')}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.pickup}</TableCell>
                <TableCell>{row.destination}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Typography sx={{ color: getStatusColor(row.status), fontWeight: 500 }}>
                    {row.status}
                  </Typography>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

       <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Button
                variant="contained"
                onClick={() => navigate('NewDeliveryScheduling')}
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
                + New Delivery schedule
              </Button>
            </Box>
    </Box>
  );
}
