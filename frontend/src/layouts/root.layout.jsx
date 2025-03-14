import { Outlet } from "react-router-dom";
import Header from "../component/Header";

function RootLayout(){
    return(
        <div className="h-screen flex">
                  
            <Outlet/>
        </div>
    )
}

export default RootLayout;