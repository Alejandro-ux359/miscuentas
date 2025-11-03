import { useState, useRef, useEffect } from "react";
import "../assets/styles/TabBarMenuNavegation.css";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HomeIcon from "@mui/icons-material/Home";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import StorefrontIcon from "@mui/icons-material/Storefront";

import { useNavigate, useLocation } from "react-router-dom";

export default function TabBarMenuNavegation() {
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [circlePosition, setCirclePosition] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  const tabs = [
    {
      id: "ingresosgastos",
      icon: <AttachMoneyIcon style={{ color: "inherit" }} />,
      path: "/ingresosgastos",
    },
    {
      id: "negocios",
      icon: <StorefrontIcon style={{ color: "inherit" }} />,
      path: "/negocios",
    },
    {
      id: "inicio",
      icon: <HomeIcon style={{ color: "inherit" }} />,
      path: "/inicio",
    },
    {
      id: "calculadora",
      icon: <CalculateIcon style={{ color: "inherit" }} />,
      path: "/calculadora",
    },
    {
      id: "estadisticas",
      icon: <QueryStatsIcon style={{ color: "inherit" }} />,
      path: "/estadisticas",
    },
  ];

  const activeTab =
    tabs.find((tab) => tab.path === location.pathname)?.id || "inicio";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
      const tabElement = tabRefs.current[activeIndex];

      if (tabElement) {
        const tabCenter = tabElement.offsetLeft + tabElement.offsetWidth / 2;
        const circleSize = 45;
        const position = tabCenter - circleSize / 2;

        setCirclePosition(position);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [activeTab, tabs]);

  return (
    <>
      <div
        className="top-bar"
        style={{
          background: "linear-gradient(135deg, #1D4ED8 0%, #7E22CE 100%)",
        }}
      >
        <div className="user-avatar">
          <img
            src={user?.avatarUrl || "https://i.pravatar.cc/100"} // puedes poner una imagen por defecto
            alt="Usuario"
          />
        </div>

        <div className="icon-container">
          <NotificationsNoneIcon
            className="notification-icon"
            onClick={() => navigate("/notificacion")}
          />
          <SettingsIcon
            className="setting-icon"
            onClick={() => navigate("/configuracion")}
          />
        </div>
      </div>

      <div className="bottom-menu-container">
        <div
          className="floating-circle"
          style={{ transform: `translateX(${circlePosition}px)` }}
        >
          <div className="circle-inner">
            {tabs.find((tab) => tab.id === activeTab)?.icon}
          </div>
        </div>

        <nav className="bottom-menu" ref={menuRef}>
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => navigate(tab.path)}
            >
              <span className="tab-icon">{tab.icon}</span>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
