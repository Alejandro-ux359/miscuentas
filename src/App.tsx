import React, { JSX, useState } from "react";
import SideBarMenu from "./layouts/SideBarMenu";
import MobileBottomNav from "./layouts/TabBarMenuNavegation";
import "./assets/styles/StyleApp.css";
import AppRouter from "./routers/appRouters/AppRouters";

function App(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
