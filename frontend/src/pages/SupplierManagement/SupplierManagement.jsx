import AddSupplier from "./AddSupplier.jsx";
import { useState } from "react";
import SupplierDetails from "./SupplierDetails.jsx";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";


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
    <div>
    <div>

    
    <div className="pb-4">
    <Link to={'Add-Supplier'} >
    <button className="bg-indigo-400 text-white px-4 py-2  rounded-lg hover:bg-indigo-600">
        + Add Suppliers
</button>
</Link>
    </div>

<SupplierDetails/>

</div>

<main>
  <Outlet/>
</main>
</div>

  );
}

export default SupplierManagement;
