import { useState, useRef, useEffect } from "react";
import "../assets/styles/TabBarMenuNavegation.css";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import HomeIcon from "@mui/icons-material/Home";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightIcon from "@mui/icons-material/Nightlight";

import { useNavigate, useLocation } from "react-router-dom";

export default function TabBarMenuNavegation() {
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [circlePosition, setCirclePosition] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: "ingresosgastos",
      icon: <AttachMoneyIcon style={{ color: "inherit" }} />,
      path: "/ingresosgastos",
    },
    {
      id: "negocios",
      icon: <WorkOutlineIcon style={{ color: "inherit" }} />,
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
      id: "configuracion",
      icon: <SettingsIcon style={{ color: "inherit" }} />,
      path: "/configuracion",
    },
  ];

  const activeTab =
    tabs.find((tab) => tab.path === location.pathname)?.id || "inicio";

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
     if (!isDarkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  };

  useEffect(() => {
    const updatePosition = () => {
      const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
      const tabElement = tabRefs.current[activeIndex];

      if (tabElement) {
        const tabCenter = tabElement.offsetLeft + tabElement.offsetWidth / 2;
        const circleSize = 56;
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
   <div className="top-bar">
  <div className={`custom-toggle ${isDarkMode ? "dark" : "light"}`} onClick={toggleTheme}>
    <div className="toggle-ball">
      {isDarkMode ? (
        <div className="moon" />
      ) : (
        <div className="sun" />
      )}
    </div>
  </div>
  <NotificationsNoneIcon
  className="notification-icon"
  onClick={() => navigate("/notificacion")}
/>
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
