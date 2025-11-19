// src/routers/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../../pages/home/Home";
import NotificationPage from "../../pages/notificaciones/Notificaciones";
import Calculadora from "../../pages/calculadora/Calculadora";
import Negocios from "../../pages/bussines/Negocios";
import IngresosGastos from "../../pages/ingresosGastos/IngresosGastos";
import Configuracion from "../../pages/configuracion/Configuracion";
import Estadisticas from "../../pages/estadisticas/Estadisticas";
import WelcomePage from "../../auth/Welcome";
import LoginPage from "../../auth/Login";
import RegisterPage from "../../auth/Register";
import PrivateRoute from "./PrivateRoute";


function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas privadas */}
      <Route
        path="/inicio"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/notificacion"
        element={
          <PrivateRoute>
            <NotificationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/calculadora"
        element={
          <PrivateRoute>
            <Calculadora />
          </PrivateRoute>
        }
      />
      <Route
        path="/negocios"
        element={
          <PrivateRoute>
            <Negocios />
          </PrivateRoute>
        }
      />
      <Route
        path="/ingresosgastos"
        element={
          <PrivateRoute>
            <IngresosGastos />
          </PrivateRoute>
        }
      />
      <Route
        path="/estadisticas"
        element={
          <PrivateRoute>
            <Estadisticas />
          </PrivateRoute>
        }
      />
      <Route
        path="/configuracion"
        element={
          <PrivateRoute>
            <Configuracion />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;
