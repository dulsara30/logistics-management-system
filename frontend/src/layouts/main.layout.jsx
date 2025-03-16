import { Outlet } from "react-router-dom";
import Sidebar from "../component/sidebar";
import Header from "../component/Header";
import DashboardLayoutBasic from "../component/DashBoard";

function MainLayout(){

    return(

        <div className="">
               <Header/>
               <Sidebar/>
                    
            <main className="flex-1 p-6">
                <Outlet/>
            </main>
        </div>
    )
}

export default MainLayout;