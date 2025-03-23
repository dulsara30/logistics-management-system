import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DamageForm from "./DamageForm.jsx";
import ItemList from "./ItemList.jsx";
import ReturnList from "./ReturnList.jsx";
import { Outlet, useLocation } from "react-router-dom";

function ReturnDamageHandling({ onSubmit }) {

  const location = useLocation();

  const isBaseRoute = location.pathname === '/returns';
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    dateReported: new Date(),
    damageType: 'physical',
    description: '',
    location: '',
    reportedBy: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      itemName: '',
      quantity: '',
      dateReported: new Date(),
      damageType: 'physical',
      description: '',
      location: '',
      reportedBy: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (

    <div>

    {isBaseRoute && (
        <DamageForm/>
    )}  
<main className="p-3">

  <Outlet/>
</main>
</div>


  );
}

export default ReturnDamageHandling;

