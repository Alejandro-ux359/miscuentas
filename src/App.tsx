import SideBarMenu from "./components/SideBarMenu";
import MobileBottomNav from "./components/TabBarMenuNavegation";
import "./assets/styles/StyleApp.css";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Negocios } from "./routers/business/Negocios";
import { Home } from "./routers/home/Home";
import { Calculadora } from "./routers/calculadora/Calculadora";
import { Configuracion } from "./routers/configuracion/Configuracion";
import { Notification } from "./routers/notificaciones/Notificaciones";
import { IngresosGastos } from "./routers/ingresosGastos/IngresosGastos";
import NotificationPage from "./components/NotificationPage";

function App() {
  return (
    <>
      {/*Sidebar solo en PC*/}
      <div className="desktop-only">
        <SideBarMenu />
      </div>

      {/* Navegación inferior solo en móviles/tablets */}
      <div className="mobile-only">
        <MobileBottomNav />
      </div>

      {/* Contenido principal */}
      <main style={{ paddingLeft: "70px", paddingBottom: "80px" }}>
        {/* Enrutado */}

        <Routes>
          <Route path="/inicio" element={<Home />} />
          <Route path="/negocios" element={<Negocios />} />
          <Route path="/calculadora" element={<Calculadora />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/notificacion" element={<NotificationPage />} />
          <Route path="/ingresosgastos" element={<IngresosGastos />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
