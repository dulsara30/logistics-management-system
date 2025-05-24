import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Create axios instance with interceptor
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust to 3001 if backend uses that port
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

const DeliveryManagement = () => {
  const [deliveryData, setDeliveryData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await api.get('/Delivery');
        setDeliveryData(response.data);
      } catch (error) {
        console.error('Error fetching delivery data:', error);
        alert(`Failed to fetch deliveries: ${error.response?.data?.message || 'Unknown error'}`);
      }
    };

    fetchDeliveryData();
  }, []);

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

  return (
    <Box sx={{ padding: 4, backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#2E2E2E', fontWeight: 'bold', mb: 2 }}>
        Delivery Management
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableCellHead>Delivery ID</StyledTableCellHead>
              <StyledTableCellHead>Package</StyledTableCellHead>
              <StyledTableCellHead>Driver</StyledTableCellHead>
              <StyledTableCellHead>Pickup</StyledTableCellHead>
              <StyledTableCellHead>Destination</StyledTableCellHead>
              <StyledTableCellHead>Date</StyledTableCellHead>
              <StyledTableCellHead>Status</StyledTableCellHead>
            </TableRow>
          </StyledTableHead>

          <TableBody>
            {deliveryData.map((row) => (
              <StyledTableRow key={row.deliveryScheduleId} onClick={() => navigate(`/delivery/DeliveryProfile/${row.deliveryScheduleId}`)}>
                <TableCell>{row.deliveryScheduleId}</TableCell>
                <TableCell>{row.packageType}</TableCell>
                <TableCell>{row.driverName}</TableCell>
                <TableCell>{row.pickupLocation}</TableCell>
                <TableCell>{row.dropoffLocation}</TableCell>
                <TableCell>{new Date(row.deliveryDate).toLocaleString()}</TableCell>
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
          onClick={() => navigate('/delivery/NewDeliveryScheduling')}
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
          + New Delivery Schedule
        </Button>
      </Box>
    </Box>
  );
};

export default DeliveryManagement;