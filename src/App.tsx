import React, { JSX, useEffect, useState } from "react";
import SideBarMenu from "./layouts/SideBarMenu";
import MobileBottomNav from "./layouts/TabBarMenuNavegation";
import "./assets/styles/StyleApp.css";
import AppRouter from "./routers/appRouters/AppRouters";
import { useNomencladores } from "./nomencladores/useNomencladores";
import { syncNomencladores } from "./nomencladores/syncNomencladores";

function App(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    syncNomencladores(); // 👈 carga y guarda automáticamente
  }, []);
  const nomencladores = useNomencladores();

  return (
    <div className={`app-root ${isOpen ? "sidebar-open" : ""}`}>
      <div className="desktop-only">
        <SideBarMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      <div className="main-area">
        <div className="mobile-only">
          <MobileBottomNav />
        </div>

        <main className="main-content min-h-screen">
          <AppRouter />
        </main>
      </div>
    </div>
  );
}

export default App;
