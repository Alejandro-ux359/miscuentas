import { useState } from "react";
import "../assets/styles/SidebarMenu.css";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    {
      id: "home",
      icon: <HomeIcon style={{ color: "inherit" }} />,
      label: "Inicio",
    },
    {
      id: "notification",
      icon: <NotificationsIcon style={{ color: "inherit" }} />,
      label: "Notificación",
    },
    {
      id: "income",
      icon: <AttachMoneyIcon style={{ color: "inherit" }} />,
      label: "Ingresos",
    },
    {
      id: "business",
      icon: <WorkOutlineIcon style={{ color: "inherit" }} />,
      label: "Negocios",
    },
    {
      id: "calculate",
      icon: <CalculateIcon style={{ color: "inherit" }} />,
      label: "Calculadora",
    },
    {
      id: "settings",
      icon: <SettingsIcon style={{ color: "inherit" }} />,
      label: "Configuración",
    },
  ];

  return (
    <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
      <div className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
        {isOpen && <span className="sidebar-user-label">Mis Cuentas</span>}
      </div>

      <nav className="sidebar-menu">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`sidebar-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
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
