import React, { Children } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    //if the token and role is not in local storage it will riderect to login
    if(!token || !role){
        return <Navigate to="/login"/>;
    }

    //if particular role is not allowed to enter that page it will riderect to this page 
    if(!allowedRoles.includes(role)){
        return <Navigate to="/unauthorized" />;
    }

    //if all done the authentication and authorization complete successfully then it render the children
    return children;

};

export default ProtectedRoute;