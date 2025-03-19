import { Button, Box, Typography} from "@mui/material";

import { useNavigate   } from "react-router-dom";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell) (({ theme }) => ({

            [`&.${tableCellClasses.head}`]: {
                backgroundColor: theme.palette.info.main,
                color: theme.palette.common.white,
                fontSize: 18,
                
            },
            [`&.${tableCellClasses.body}`]: {
                fontSize: 16,
                
            },

        })
    );

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.info.dark.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



function createData(Number,Type,Brand, Owner, Drivers,Availability) {
  return { Number,Type,Brand, Owner, Drivers,Availability };
}

const rows = [
  createData('PQ-3536', 159, 6.0, 24, 4.0,'yes'),
  createData('AQ-3530', 237, 9.0, 37, 4.3,'yes'),
  createData('KQ-3567', 262, 16.0, 24, 6.0,'yes'),
  createData('PL-8536', 305, 3.7, 67, 4.3,'yes'),
  createData('PT-3596', 356, 16.0, 49, 3.9,'yes'),
];



export default function VehicleFleetManagement(){

    const navi = useNavigate();

    return(

        <div className="p-16">
          

          <Box sx={{mb:2}}>
            <Button variant="contained" onClick={()=>navi('vehicleRegistration')} > New vehicle registration </Button>
          </Box>
          

          <TableContainer component={Paper}>

          <Table sx={{ minWidth: 700 }} aria-label="customized table">

            <TableHead>
              <TableRow>
                <StyledTableCell>Vehicle Registration Number</StyledTableCell>
                <StyledTableCell align="right">Vehicle Type</StyledTableCell>
                <StyledTableCell align="right">Vehicle Brand</StyledTableCell>
                <StyledTableCell align="right">Owners Name</StyledTableCell>
                <StyledTableCell align="right">Drivers Name</StyledTableCell>

              </TableRow>
            </TableHead>


            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.Number} 
                hover
                onClick={()=>navi('VehicleProfile') } 
                style={{ cursor: 'pointer' }}>

                  <StyledTableCell component="th" scope="row">{row.Number}</StyledTableCell>
                  <StyledTableCell align="right">{row.Type}</StyledTableCell>
                  <StyledTableCell align="right">{row.Brand}</StyledTableCell>
                  <StyledTableCell align="right">{row.Owner}</StyledTableCell>
                  <StyledTableCell align="right">{row.Drivers}</StyledTableCell>
 
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    
    
        </div>
    )
}

