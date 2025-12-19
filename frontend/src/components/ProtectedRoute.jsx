import React from "react";
import { Navigate, useLocation } from "react-router-dom";


export const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("x-auth-token");
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};