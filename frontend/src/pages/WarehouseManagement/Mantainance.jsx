import React, { useEffect, useState } from 'react';
import { Card, Box, Typography, Stack, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import reportgenarate from './Report'; // Import the report generation function
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import MuiTooltip from '@mui/material/Tooltip';

export default function Maintenance() {




  const navigate = useNavigate();
  const [maintenanceData, setMaintenanceData] = useState([]);

  useEffect(() => {
    fetchMaintenanceData();
  }, []);






  const fetchMaintenanceData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/maintenance');
      setMaintenanceData(response.data);
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
    }
  };






  const handleGenerateReportClick = async () => {
    try {
      await reportgenarate(); // Call the imported function
    } catch (error) {
      // Optionally handle any errors that might have been re-thrown
      console.error('Error during report generation in component:', error);
    }
  };





  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Maintenance Management
      </Typography>
      <Divider sx={{ my: 3 }} />



      {/* Generate Report Button */}
      <Button
      
        variant="contained"
        sx={{ bgcolor: '#2e7d32', color: 'white', marginBottom: 2, left: 310 }}
        onClick={handleGenerateReportClick}
      >
        Generate Report
      </Button>





      {/* Display Maintenance Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 300,
            marginBottom: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            border: '2px solid #CCCCCC',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/warehouse/Maintainance/AddMaintenance')}
        >
          <MuiTooltip title="Schedule">
            <Fab
              color="primary"
              aria-label="add"
              sx={{ backgroundColor: 'white', color: 'black' }}
            >
              <AddIcon />
            </Fab>
          </MuiTooltip>
        </Card>







        {/* Display Filtered Warehouses */}
        {maintenanceData.map((m) => (
          <Card
            key={m.requestId}
            variant="outlined"
            onClick={() => navigate(`AddMaintenance/${m.requestId}`)}
            sx={{
              maxWidth: 360,
              marginBottom: 2,
              cursor: 'pointer',
              '&:hover': { boxShadow: 6, backgroundColor: '#f5f5f5' },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography gutterBottom variant="h5">
                {m.requestId}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {m.status}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>





      {/* Corrective & Routing Buttons on Right Side */}
      <Stack spacing={2} direction="row" sx={{ position: 'absolute', bottom: 30, right: 50 }}>
        <Button variant="contained" sx={{ bgcolor: '#ab47bc' }} onClick={() => navigate('Corrective-Form')}>
          Corrective
        </Button>
        <Button variant="contained" sx={{ bgcolor: '#ab47bc' }} onClick={() => navigate('Routing-Form')}>
          Routing
        </Button>
      </Stack>
    </Box>
  );
}