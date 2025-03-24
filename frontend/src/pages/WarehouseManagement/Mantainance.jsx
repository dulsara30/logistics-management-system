import React, { useEffect, useState } from 'react';
import { Card, Box, Typography, Stack, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Maintenance() {
  const navigate = useNavigate();
  const [maintenanceData, setMaintenanceData] = useState([]);

  // getting maintenance data from backend
  useEffect(() => {
    axios.get('http://localhost:8000/api/maintenance')
      .then((response) => setMaintenanceData(response.data)) //set data to state
      .catch((error) => console.error('Error fetching maintenance data:', error));
  }, []);

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>

      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Maintenance Management
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Display Maintenance Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {maintenanceData.map((m) => (
          <Card
            key={m.ID}
            variant="outlined"
            onClick={() => navigate(`/warehouse/Maintainance/CorrectiveDetails/${m.ID}`)}
            sx={{
              maxWidth: 360,
              marginBottom: 2,
              cursor: 'pointer',
              '&:hover': { boxShadow: 6, backgroundColor: '#f5f5f5' },
            }} 
          >
            <Box sx={{ p: 2 }}>
              <Typography gutterBottom variant="h5">
                {m.Type} Maintenance
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Status: {m.Status}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Maintenance Chart at Bottom */}
      <Box sx={{ width: '100%', marginTop: 4 }}>
        <Typography variant="h6" sx={{ mb: 6 }}>
          Maintenance Data 
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={maintenanceData}>
            <CartesianGrid strokeDasharray="4 6" />
            <XAxis dataKey="Month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Cost" stroke="#6a1b9a" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
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
