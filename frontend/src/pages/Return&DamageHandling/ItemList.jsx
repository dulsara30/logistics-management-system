import React from "react";
import { format } from "date-fns";
import ReturnList from "./ReturnList.jsx";
import { Link, Outlet, useLocation } from "react-router-dom";
import Items from "./items.jsx";



function ItemsList() {

  const location = useLocation();

  const isBaseRoute = location.pathname === '/returns/item-list';

  return (
    <div>
      
      {isBaseRoute && (
        <Items/>
    )}  

      <main>
        <Outlet/>
      </main>
    </div>
  );
}

export default ItemsList;
