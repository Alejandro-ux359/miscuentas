import SideBarMenu from "./components/SideBarMenu";
import MobileBottomNav from "./components/TabBarMenuNavegation";
import "./assets/styles/StyleApp.css";

function App() {
  return (
    <>
      {/* Sidebar solo en PC */}
      <div className="desktop-only">
        <SideBarMenu />
      </div>

      {/* Navegación inferior solo en móviles/tablets */}
      <div className="mobile-only">
        <MobileBottomNav />
      </div>

      {/* Contenido principal */}
      <main style={{ paddingLeft: "70px", paddingBottom: "80px" }}>
        {/* Aquí va tu contenido */}
      </main>
    </>
  );
}

export default App;
