import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import "../assets/styles/NotificationPage.css"; 

export default function NotificationPage() {
  const navigate = useNavigate();

  return (
    <div className="notification-page">
      <div className="notification-header">
        <ArrowBackIosNewIcon
          className="back-icon"
          onClick={() => navigate(-1)} 
        />
        <h2>Notificaciones</h2>
      </div>

      <div className="notification-content">
        <p>No tienes notificaciones nuevas.</p>
      </div>
    </div>
  );
}
