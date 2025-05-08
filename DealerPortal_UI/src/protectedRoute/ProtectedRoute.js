import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
    const isAuthenticated = localStorage.getItem('isUserAuthenticated') === "true";
    const persist = localStorage.getItem("persist:pmo_user");
    const userRole = localStorage.getItem('loggedUserRole');

    if (isAuthenticated && persist) {
        if (!requiredRole || userRole == requiredRole) {
            return <Outlet />;
        } else {
            return <Navigate to="/Login" replace />;
        }
    }

    return <Navigate to="/Login" replace />;
};

export default ProtectedRoute;
