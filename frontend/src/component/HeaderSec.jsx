import React, { useState, useEffect } from 'react';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Avatar from '@mui/material/Avatar';
import Breadcrumbs from './Breadcrumbs';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function HeaderSec(){


  const NAVIGATION = [
    { path: '/', title: 'Dashboard'},
    { path: '/warehouse', title: 'Warehouse Management'},
    { path: '/fleet', title: 'Vehicle Fleet Management'},
    { path: '/delivery', title: 'Delivery Management'},
    { path: '/inventory', title: 'Inventory Management'},
    { path: '/staff', title: 'Staff Management'},
    { path: '/suppliers', title: 'Supplier Management'},
    { path: '/returns', title: 'Return & Damage Handling'},
    { path: '/help', title: 'Help'}
  ];

  const navigate = useNavigate();
  const [error, setError] = React.useState();
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");


      if(!token){
        setError("You must be logged in to view this page");
        navigate("/login");
        return;
      }

      try{
        const decoded = jwtDecode(token);
        if(!decoded.fullName){
          alert("Something went wrong. please try again");
          navigate("/login");
        }

        setFullName(decoded.fullName);

        }catch{

          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        }finally{
          setIsLoading(false);
        }
        

  } , [navigate]);

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  }

  const firstLetter = fullName.charAt(0);

    return(

        <header className="h-20 bg-white shadow-sm flex items-center px-6 justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {NAVIGATION.find(item => item.path === location.pathname)?.title}
          </h1>
          <Breadcrumbs/>
        </div>

                  <div className='flex p-5'>
                    <div className='p-3'>
                      <Link to={"profile"}>
                    <Avatar>{firstLetter}</Avatar>
                    </Link>
                    </div>
                    <div className='p-3'>
                      <Badge badgeContent={4} color="primary">
                        <MailIcon color="action" />
                      </Badge>
                    </div>
        
                  </div>
        </header>
    )
}

export default HeaderSec;