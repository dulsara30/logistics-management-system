import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';




// Sample delivery data
const deliveryData = [
  { id: 1, pickup:"Malabe", destination: "Colombo", date: "2025-03-20", status: "Pending" },
  { id: 2, pickup:"Malabe",destination: "Kandy", date: "2025-03-21", status: "In Transit" },
  { id: 3, pickup:"Malabe",destination: "Galle", date: "2025-03-22", status: "Done" },
  { id: 4, pickup:"Malabe",destination: "Matara", date: "2025-03-23", status: "Pending" },
];

// Function to return a colored chip based on status
const getStatus = (status) => {

  let color;
  switch (status) {
    case "Pending":
      color = "warning";
      break;
    case "In Transit":
      color = "info";
      break;
    case "Done":
      color = "success";
      break;
    default:
      color = "default";
  }
  return  <Typography color={color} sx={{fontWeight:'bold'}}>{status}</Typography> ;
};



export default function Deliveryanagement(){

  const navi = useNavigate();

   return(

        <div className="p-16">
        <h1>DeliveryManagement</h1>
        
        <Button onClick={()=>navi('NewDeliveryScheduling')}>Create Schedule</Button>

        <TableContainer component={Paper}>

          <Table>

            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Pickup</strong></TableCell>
                <TableCell><strong>Destination</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>


            <TableBody>
              {deliveryData.map((row) => (
                <TableRow key={row.id} 
                hover
                onClick={()=>navi('DeliveryProfile') } 
                style={{ cursor: 'pointer' }}>

                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.pickup}</TableCell>
                  <TableCell>{row.destination}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{getStatus(row.status)}</TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>

        </TableContainer>

        </div>

    )
}

