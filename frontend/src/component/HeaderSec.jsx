import * as React from 'react';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Avatar from '@mui/material/Avatar';
import Breadcrumbs from './Breadcrumbs';

function HeaderSec({ array }){
    return(

        <header className="h-20 bg-white shadow-sm flex items-center px-6 justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {array.find(item => item.path === location.pathname)?.title}
          </h1>
          <Breadcrumbs/>
        </div>

                  <div className='flex p-5'>
                    <div className='p-3'>
                    <Avatar>K</Avatar>
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