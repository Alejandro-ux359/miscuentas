import React, { JSX, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { usuario, loading } = useContext(AuthContext);

  // Mientras carga el usuario desde localStorage, NO redirigir
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no hay usuario una vez cargado → redirigir
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
