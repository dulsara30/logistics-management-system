import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function RoutingSubmit() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 400,
        margin: 'auto',
        padding: 5,
        boxShadow: 3,
        borderRadius: 2,
        textAlign: 'center',
        bgcolor: 'background.paper', // Light background for contrast
      }}
    >
      <Typography variant="h5" sx={{ color: 'grey.800', mb: 2 }}>
        Form Submitted Successfully!
      </Typography>
      
      <Button variant="contained" sx={{ bgcolor: '#ab47bc', '&:hover': { bgcolor: '#4a148c' } }} onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </Box>
  );
}
