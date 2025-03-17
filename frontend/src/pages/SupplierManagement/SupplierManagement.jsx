import AddSupplier from "./AddSupplier.jsx";
import { useState } from "react";


function SupplierManagement() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    productCategory: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (

            <AddSupplier/>

  );
}

export default SupplierManagement;
