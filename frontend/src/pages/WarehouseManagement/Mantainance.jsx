import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Maintenance data for the chart
const data = [
  { name: 'January', maintenance: 400 },
  { name: 'February', maintenance: 300 },
  { name: 'March', maintenance: 500 },
  { name: 'April', maintenance: 400 },
  { name: 'May', maintenance: 600 },
];

export default function Maintenance() {
  const navi = useNavigate();

  return (
    <Box sx={{ width: '90%', margin: 'auto', textAlign: 'center', mt: 4 }}>
      {/* Buttons for different maintenance forms */}
      <Stack spacing={2} direction="row" justifyContent="center">
        <Button variant="contained" sx={{ bgcolor: '#ab47bc' }} onClick={() => navi('Corrective-Form')}>
          Corrective
        </Button>
        <Button variant="contained" sx={{ bgcolor: '#ab47bc' }} onClick={() => navi('Routing-Form')}>
          Routing
        </Button>
      </Stack>

      <Typography variant="h6" sx={{ mt: 3, color: 'grey.800' }}>
        Maintenance Data
      </Typography>

      {/* Responsive Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="maintenance" stroke="#6a1b9a" strokeWidth={2} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
