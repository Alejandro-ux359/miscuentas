// src/routers/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../../pages/home/Home";
import NotificationPage from "../../pages/notificaciones/Notificaciones";
import Calculadora from "../../pages/calculadora/Calculadora";
import Negocios from "../../pages/bussines/Negocios";
import IngresosGastos from "../../pages/ingresosGastos/IngresosGastos";
import Configuracion from "../../pages/configuracion/Configuracion";
import Estadisticas from "../../pages/estadisticas/Estadisticas";
import WelcomePage from "../../welcome/Welcome";
import LoginPage from "../../welcome/Login";
import RegisterPage from "../../welcome/Register";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/inicio" element={<Home />} />
      <Route path="/notificacion" element={<NotificationPage />} />
      <Route path="/calculadora" element={<Calculadora />} />
      <Route path="/negocios" element={<Negocios />} />
      <Route path="/ingresosgastos" element={<IngresosGastos />} />
      <Route path="/estadisticas" element={<Estadisticas />} />
      <Route path="/configuracion" element={<Configuracion />} />
    </Routes>
  );
}

export default AppRouter;
