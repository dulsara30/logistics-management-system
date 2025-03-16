import { Button } from "@mui/material";
import VehicleRegistrationForm from './VehicleRegistration.jsx'
import { Routes, Route, useNavigate , Outlet ,Link  } from "react-router-dom";



export default function VehicleFleetManagement(){

    const navi = useNavigate();

    return(

        <div className="p-16">
        <h1>Vehicle Fleet Management</h1>

   
        <Link to="vehicleRegistration">Go to User Management</Link>
        
    
        </div>
    )
}

