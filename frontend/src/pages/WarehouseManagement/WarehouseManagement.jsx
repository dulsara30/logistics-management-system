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

export default function WarehouseManagement() {
  const navi = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const warehouses = [
    { id: 1, name: 'Warehouse 1', category: 'AC' },
    { id: 2, name: 'Warehouse 2', category: 'Non-AC' },
    { id: 3, name: 'Warehouse 3', category: 'Green' },
    { id: 4, name: 'Warehouse 4', category: 'High Security' },
    { id: 5, name: 'Warehouse 5', category: 'AC' },
  ];

  const filteredWarehouses =
    selectedCategory === 'All'
      ? warehouses
      : warehouses.filter((w) => w.category === selectedCategory);

  return (
    <Box sx={{ padding: 2 }}>
      {/* Category Buttons */}
      <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
        {['All', 'AC', 'Non-AC', 'Green', 'High Security'].map((category) => (
          <Button variant="filled"
            key={category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </Stack>

      {/* Maintenance Button */}
      <Box sx={{ position: 'absolute', top: 110, right: 130 }}>
        <Button variant="contained" color="primary" sx={{bgcolor:'#ab47bc'}} onClick={() => navi('Maintainance')}>
          Maintenance
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} /> {/*devide top bar from card*/}


      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {/* "Add Warehouse" Card */}
        <Card
          variant="outlined"
          sx={{
            
            maxWidth: 360,
            marginBottom: 2, //add card size
            display: 'flex', //plus icon center
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFf',
            border: '2px lined #CCCCCC', //border line
            cursor: 'pointer',
          }}
          onClick={() => navi('warehouse-form')}
        >
          <Tooltip title="Add Warehouse">
            <Fab color="primary" aria-label="add" sx={{ backgroundColor: 'white', color: 'black' }}>
                <AddIcon /> {/*plus mark */}
            </Fab>
          </Tooltip>
        </Card>

        {/* Display Filtered Warehouses */}
        {filteredWarehouses.map((warehouse) => (
          <Card key={warehouse.id} variant="outlined" sx={{ maxWidth: 360, marginBottom: 2}}>
            <Box sx={{ p: 2 }}>

              <Typography gutterBottom variant="h5" component="div">
                {warehouse.name}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Category: {warehouse.category}
              </Typography>

            </Box>
            <Divider />

            <Box sx={{ p: 2 }}>
              <Stack direction="row" spacing={1}>

                <Button variant="contained" size="small" color="#ab47bc"sx={{ fontSize: '0.5rem' }}onClick={() => navi('warehouse-form')}>
                  Edit
                </Button>

                <Button variant="contained" size="small" sx={{ fontSize: '0.5rem',bgcolor:'#ab47bc' }}>
                  View
                </Button>

                <Button variant="contained" size="small" sx={{ backgroundColor: '#FF0000', fontSize: '0.5rem' }}>
                  Delete
                </Button>
                
              </Stack>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
