import { Outlet } from "react-router-dom";
import Dashboard from "../pages/StaffMember/Dashboard";
import HeaderSec from "../component/HeaderSec";

function StaffLayout(){

    return(

        <div >
            <HeaderSec/>
            <Dashboard/>
            
        </div>
    )
}

export default StaffLayout;