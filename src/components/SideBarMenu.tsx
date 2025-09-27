import { useState } from "react";
import "../assets/styles/SidebarMenu.css";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "inicio", icon: <HomeIcon />, label: "Inicio", path: "/inicio" },
    { id: "notificacion", icon: <NotificationsIcon />, label: "Notificación", path: "/notificacion" },
    { id: "ingresosgastos", icon: <AttachMoneyIcon />, label: "Ingresos", path: "/ingresosgastos" },
    { id: "negocios", icon: <WorkOutlineIcon />, label: "Negocios", path: "/negocios" },
    { id: "calculadora", icon: <CalculateIcon />, label: "Calculadora", path: "/calculadora" },
    { id: "configuracion", icon: <SettingsIcon />, label: "Configuración", path: "/configuracion" },
  ];

  // Determinar la pestaña activa según la ruta actual
  const activeTab = tabs.find(tab => tab.path === location.pathname)?.id || "";

  return (
    <div className={`sidebar-container ${isOpen ? "open" : "closeup"}`}>
      <div className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
        {isOpen && <span className="sidebar-user-label">Mis Cuentas</span>}
      </div>

      <nav className="sidebar-menu">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`sidebar-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => navigate(tab.path)}
          >
            <div className="sidebar-icon">{tab.icon}</div>
            {isOpen && <span className="sidebar-label">{tab.label}</span>}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <hr className="sidebar-divider" />
        <div className={`sidebar-version ${isOpen ? "visible" : "hidden"}`}>
          Versión 1.0.0
        </div>
      </div>
    </div>
  );
}
