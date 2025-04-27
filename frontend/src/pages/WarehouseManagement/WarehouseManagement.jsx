import * as React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';

export default function WarehouseManagement() {
  const navi = useNavigate();
  
  //const [selectedCategory, setSelectedCategory] = React.useState('All');

//warehouse varibale have the database data set
  const [warehouse, setWarehouse] = React.useState([]);


  //getting data from backend
  React.useEffect(() => {

    axios.get('http://localhost:8000/api/warehouse').then((response) => {

      setWarehouse(response.data); // Set the data to state

      }).catch((error) => {

        console.error('Error fetching warehouse:', error);

      },[]);
    })

  return (
    <Box sx={{ padding: 2 }}>

      {/* Maintenance Button */}
      <Box sx={{ position: 'absolute', top: 100, right: 130 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ bgcolor: '#ab47bc' }}
          onClick={() => navi('Maintainance')}
        >
          Maintenance
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />


      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>



        {/* "Add schedule" Card */}
        <Card
          variant="outlined"
          sx={{
            maxWidth: 360,
            marginBottom: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            border: '2px solid #CCCCCC',
            cursor: 'pointer',
          }}
          onClick={() => navi('Addwarehouse')}
        >
          <Tooltip title="Add Warehouse">
            <Fab
              color="primary"
              aria-label="add"
              sx={{ backgroundColor: 'white', color: 'black' }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Card>





        {/* Display Filtered Warehouses */}
        {warehouse.map((w) => (
          <Card
            key={w.WarehouseID}
            variant="outlined"
            onClick={() => navi(`WarehouseDetails/${w.WarehouseID}`)}
            sx={{
              maxWidth: 360,
              marginBottom: 2,
              cursor: 'pointer',
              '&:hover': { boxShadow: 6, backgroundColor: '#f5f5f5' },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography gutterBottom variant="h5" component="div">
                {w.WarehouseID}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Description: {w.Description}
               
              </Typography>
              City: {w.City}
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
