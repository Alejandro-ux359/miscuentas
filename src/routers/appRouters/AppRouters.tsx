// src/routers/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../../pages/home/Home";
import NotificationPage from "../../pages/notificaciones/Notificaciones";
import Calculadora from "../../pages/calculadora/Calculadora";
import Negocios from "../../pages/bussines/Negocios";
import IngresosGastos from "../../pages/ingresosGastos/IngresosGastos";
import Configuracion from "../../pages/configuracion/Configuracion";



function AppRouter() {
  return (
    <Routes>
      <Route path="/inicio" element={<Home />} />
      <Route path="/notificacion" element={<NotificationPage />} />
      <Route path="/calculadora" element={<Calculadora />} />
      <Route path="/negocios" element={<Negocios />} />
      <Route path="/ingresosgastos" element={<IngresosGastos />} />
      <Route path="/configuracion" element={<Configuracion />} />

   </Routes>
  );
}

export default AppRouter;
