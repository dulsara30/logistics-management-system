import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Grid2, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(Section,Size)
   {
    return { Section, Size };
   }
  
  const rows = [
    createData('Bulky item sections', 2),
    createData('Hazardous item section', 1),
    createData('Perishable Items section', 1),
    createData('Spare Parts and Components item section', 1),
    createData('Other items', 2),
  ];

  const totalSize = rows.reduce((sum, row) => sum + row.Size, 0);
  

export default function WarehouseForm(){
    
    /*const [Capacity, setCapacity] = useState('');

  const handleChange = (event) => {
    setCapacity(event.target.value);
  };*/
    
    return(
       <Grid2 className="p-16" sx={{ padding: '16px', maxWidth: '800px', margin: 'auto' }} >
       <Box>
        <Typography variant="h5" sx={{marginBottom: '20px',mb: 2, fontWeight: 'bold', textAlign: 'center'}}>
            Warehouse1
        </Typography>
                        {/*without two rows  gridTemplateColumns:'repeat(2 , 2fr )'*/}
            <Box sx={{display:'grid',gridTemplateColumns:'repeat(2 , 2fr )', gap:2,minWidth: 120}}>
            <Box><TextField id="outlined-basic" label="WarehouseID" variant="filled" sx={{ width: '100%' }}/></Box>
            <Box><TextField id="outlined-basic" label="StreetName" variant="filled" sx={{width: '100%'}}/></Box>
            <Box><TextField id="outlined-basic" label="City" variant="filled" sx={{width: '100%'}}/></Box>
            <Box><TextField id="outlined-basic" label="Province" variant="filled" sx={{width: '100%'}}/></Box>
            
            <Box><TextField id="outlined-basic" label="Special Instruction" variant="filled" sx={{width: '100%'}}multiline rows={4}/></Box>
            <Box><TextField id="outlined-basic" label="Description" variant="filled" sx={{width: '100%'}}multiline rows={4}/></Box>
            <Box> 

          {/* <Grid2 item xs={12}>
            <Typography component={'h5'} sx={{color:'000000'}}> Section </Typography>
            </Grid2>          
            <Box>Bulky Items Section<Checkbox {...label} defaultChecked /></Box>
            <Box >Hazardous Items Section<Checkbox {...label} defaultChecked /></Box>
            <Box >Perishable Items Section<Checkbox {...label} defaultChecked /></Box>
            <Box >Spare Parts and Components Items Section<Checkbox {...label} defaultChecked /></Box>*/}
            </Box> 
            
            </Box>
            </Box>
            <Box >
            <TableContainer component={Paper} sx={{marginright: '100px',overflowX: 'auto' }}>
            <Table sx={{ minWidth: '100%',textAlign: 'left'}} aria-label="simple table">
                <TableHead>
                <TableRow sx={{backgroundColor:'#e0e0e0'}}>
                    <TableCell><Typography component={'h2'} sx={{color:'000000'}}> Section </Typography></TableCell>
                    <TableCell align="right"> Size (m^3)</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.Section} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                    <TableCell component="th" scope="row">{row.Section}
                    </TableCell>
                    <TableCell align="right">{row.Size}</TableCell>
                    </TableRow>
                ))}

                    <TableRow>
                    <TableCell colSpan={2} style={{ borderBottom: '3px solid black' }} />
                    </TableRow>

                    <TableRow>
                    <TableCell style={{ fontWeight: 'bold' ,backgroundColor:'#e0e0e0'}}>Total</TableCell>
                    <TableCell align="right" style={{ fontWeight: 'bold',backgroundColor:'#e0e0e0' }}>{totalSize}</TableCell>
                    </TableRow>

                </TableBody>
            </Table>
            </TableContainer>
            </Box>

        <Button sx={{
            margin:'auto',
            fontSize: '18px',
            marginBottom: '20px',
            backgroundColor: '#ab47bc',
            color: '#000000',
            marginTop: '20px',
                
        }}>Submit</Button>


</Grid2>
    );
}



