import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/Configuracion.css";
import People from "./people";

export default function ConfiguracionPage() {
  const navigate = useNavigate();

  return (
    <div className="configuracion-page">
      <div className="configuracion-header">
        <ArrowBackIosNewIcon
          className="back-icon"
          onClick={() => navigate(-1)}
        />
        <h2>Configuración</h2>
      </div>

      <People />
    </div>
  );
}
