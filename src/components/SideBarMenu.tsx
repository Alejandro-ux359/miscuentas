import { useState } from "react";
import "../assets/styles/SidebarMenu.css";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { useNavigate, useLocation } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";

// 1️⃣ Definimos el tipo de props
interface SidebarMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideBarMenu({ isOpen, setIsOpen }: SidebarMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "inicio", icon: <HomeIcon />, label: "Inicio", path: "/inicio" },
    { id: "notificacion", icon: <NotificationsIcon />, label: "Notificación", path: "/notificacion" },
    { id: "ingresosgastos", icon: <AttachMoneyIcon />, label: "Ingresos", path: "/ingresosgastos" },
    { id: "negocios", icon: <StorefrontIcon />, label: "Negocios", path: "/negocios" },
    { id: "calculadora", icon: <CalculateIcon />, label: "Calculadora", path: "/calculadora" },
    { id: "estadisticas", icon: <QueryStatsIcon />, label: "Estadisticas", path: "/estadisticas" },
    { id: "configuracion", icon: <SettingsIcon />, label: "Configuración", path: "/configuracion" },
  ];

  const activeTab = tabs.find(tab => tab.path === location.pathname)?.id || "";

  return (
    <div className={`sidebar-container ${isOpen ? "open" : "closeup"}`}>
      {/* Botón abrir/cerrar sidebar */}
      <div className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
        {isOpen && <span className="sidebar-user-label">Mis Cuentas</span>}
      </div>

      {/* Menú de navegación */}
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

      {/* Footer */}
      <div className="sidebar-footer">
        <hr className="sidebar-divider" />
        <div className={`sidebar-version ${isOpen ? "visible" : "hidden"}`}>
          Versión 1.0.0
        </div>
      </div>
    </div>
  );
}
