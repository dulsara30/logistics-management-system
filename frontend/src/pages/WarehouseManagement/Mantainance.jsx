import React, { useEffect, useState } from 'react';
import { Card, Box, Typography, Stack, Button, Divider, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import reportgenarate from './Report'; // Import the report generation function
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import MuiTooltip from '@mui/material/Tooltip';

export default function Maintenance() {
  const navigate = useNavigate();
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [routingmaintenanceData, setRoutingData] = useState([]);

  // Fetch maintenance and routing data when the component mounts
  useEffect(() => {
    fetchMaintenanceData();
    fetchRoutingData();
  }, []);


  const fetchMaintenanceData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/maintenance');
      setMaintenanceData(response.data);
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
    }
  };


  const fetchRoutingData = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/routingmaintenance');
      console.log('💡 routing maintenance raw data:', data);
      setRoutingData(data);
    } catch (err) {
      console.error('Error fetching routing maintenance data:', err);
    }
  };


  // Function to handle report generation
  const handleGenerateReportClick = async () => {
    try {
      await reportgenarate();
    } catch (error) {
      console.error('Error during report generation in component:', error);
    }
  };



  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Maintenance Management
      </Typography>
      <Divider sx={{ my: 3 }} />


      {/* Buttons */}
      <Button
        variant="filled"
        sx={{ bgcolor: '#2e7d32', color: 'white', marginBottom: 2, mr: 2 }}
        onClick={handleGenerateReportClick}
      >
        Generate Report
      </Button>

      <Button
        variant="filled"
        sx={{ bgcolor: '#2e7d32', color: 'white', marginBottom: 2 }}
        onClick={() => navigate('Routing-Form')}
      >
        Routing
      </Button>



      {/* === Maintenance Section === */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Maintenance Requests
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {/* Add Maintenance Button Card */}
        <Grid item>
          <Card
            variant="outlined"
            sx={{
              width: 300,
              height: 150,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '2px solid #CCCCCC',
              cursor: 'pointer',
              '&:hover': { boxShadow: 6 },
            }}
            onClick={() => navigate('/warehouse/Maintainance/AddMaintenance')}
          >
            <MuiTooltip title="Schedule Maintenance">
              <Fab color="primary" aria-label="add" sx={{ backgroundColor: 'white', color: 'black' }}>
                <AddIcon />
              </Fab>
            </MuiTooltip>
          </Card>
        </Grid>

        {/* filter Maintenance Data  */}
        {maintenanceData.map((m) => (
          <Grid item key={m.requestId}>
            <Card
              variant="outlined"
              onClick={() => navigate(`AddMaintenance/${m.requestId}`)}
              sx={{
                width: 360,
                cursor: 'pointer',
                '&:hover': { boxShadow: 6, backgroundColor: '#f5f5f5' },
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography gutterBottom variant="h6">
                  {m.warehouseId}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Maintenance ID: {m.requestId}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {m.issueDescription}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>



      {/* === Routing Maintenance Section === */}
      <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
        Routing Maintenance Records
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {/* Routing Maintenance Cards */}
        {routingmaintenanceData.map((r) => (
          <Grid item key={r.RID}>
            <Card
              variant="outlined"
              
              sx={{
                width: 360,
                cursor: 'pointer',
                '&:hover': { boxShadow: 6, backgroundColor: '#f5f5f5' },
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography gutterBottom variant="h6">
                  {r.warehouse}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  RoutingMaintenance ID: {r.RID}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Date: {new Date(r.date).toLocaleDateString()}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
