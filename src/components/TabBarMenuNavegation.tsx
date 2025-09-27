import { useState, useRef, useEffect } from "react";
import "../assets/styles/TabBarMenuNavegation.css";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import HomeIcon from "@mui/icons-material/Home";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate, useLocation } from "react-router-dom";

export default function TabBarMenuNavegation() {
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [circlePosition, setCirclePosition] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Tabs con rutas correctas
  const tabs = [
    { id: "ingresosgastos", icon: <AttachMoneyIcon style={{ color: "inherit" }} />, path: "/ingresosgastos" },
    { id: "negocios", icon: <WorkOutlineIcon style={{ color: "inherit" }} />, path: "/negocios" },
    { id: "inicio", icon: <HomeIcon style={{ color: "inherit" }} />, path: "/inicio" },
    { id: "calculadora", icon: <CalculateIcon style={{ color: "inherit" }} />, path: "/calculadora" },
    { id: "configuracion", icon: <SettingsIcon style={{ color: "inherit" }} />, path: "/configuracion" },
  ];

  // Determinar el tab activo según la ruta actual
  const activeTab = tabs.find(tab => tab.path === location.pathname)?.id || "inicio";

  // Mover el círculo animado cuando cambie el tab activo
  useEffect(() => {
    const updatePosition = () => {
      const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
      if (tabRefs.current[activeIndex]) {
        const tabElement = tabRefs.current[activeIndex];
        const position = tabElement.offsetLeft + tabElement.offsetWidth / 1000-195; 
        setCirclePosition(position);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [activeTab, tabs]);

  return (
    <div className="bottom-menu-container">
      {/* Círculo flotante */}
      <div
        className="floating-circle"
        style={{ transform: `translateX(${circlePosition}px)` }}
      >
        <div className="circle-inner">
          {tabs.find(tab => tab.id === activeTab)?.icon}
        </div>
      </div>

      {/* Menú */}
      <nav className="bottom-menu" ref={menuRef}>
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            ref={el => {tabRefs.current[index] = el}}
            className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => navigate(tab.path)} // ✅ Ahora navega correctamente
          >
            <span className="tab-icon">{tab.icon}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}
