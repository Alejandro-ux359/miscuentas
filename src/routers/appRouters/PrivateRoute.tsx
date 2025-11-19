// src/routers/PrivateRoute.tsx
import React, { JSX, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { usuario } = useContext(AuthContext);

  if (!usuario) {
    // No está logueado → redirige a login
    return <Navigate to="/login" replace />;
  }

  // Está logueado → muestra el componente
  return children;
};

export default PrivateRoute;
