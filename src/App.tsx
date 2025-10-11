import React, { JSX, useState } from "react";
import SideBarMenu from "./components/SideBarMenu";
import MobileBottomNav from "./components/TabBarMenuNavegation";
import "./assets/styles/StyleApp.css";
import AppRouter from "./routers/appRouters/AppRouters";
import InstallButton from "./assets/InstallButton";

function App(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={`app-root ${isOpen ? "sidebar-open" : ""}`}>
      {/* Sidebar solo en PC */}
      <div className="desktop-only">
        <SideBarMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* Área principal: navegación móvil + contenido */}
      <div className="main-area">
        {/* Navegación inferior solo en móviles/tablets */}
        <div className="mobile-only">
          <MobileBottomNav />
        </div>

        {/* Contenido principal */}
        <main className="main-content min-h-screen">
          <AppRouter />
        </main>
      </div>

      {/* 👇 Botón flotante para instalar la PWA */}
      <InstallButton />
    </div>
  );
}

export default App;
