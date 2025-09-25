import { useState, useRef, useEffect } from "react";
import "../assets/styles/TabBarMenuNavegation.css";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import HomeIcon from "@mui/icons-material/Home";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";

export default function TabBarMenuNavegation() {
  const [activeTab, setActiveTab] = useState("home");
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [circlePosition, setCirclePosition] = useState(0);

  const tabs = [
    { id: "income", icon: <AttachMoneyIcon style={{ color: "inherit" }}/>, label: "" },
    { id: "business", icon: <WorkOutlineIcon style={{ color: "inherit" }}/>, label: "" },
    { id: "home", icon: <HomeIcon style={{ color: "inherit" }}/>, label: "" },
    { id: "calculate", icon: <CalculateIcon style={{ color: "inherit" }}/>, label: "" },
    { id: "settings", icon: <SettingsIcon style={{ color: "inherit" }}/>, label: "" },
  ];

  useEffect(() => {
    const updatePosition = () => {
      const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
      if (tabRefs.current[activeIndex]) {
        const tabElement = tabRefs.current[activeIndex];
        const position =
          tabElement.offsetLeft + tabElement.offsetWidth / 1000 - 195;
        setCirclePosition(position);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [activeTab, tabs]);

  return (
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
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}
