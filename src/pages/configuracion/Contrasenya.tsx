import { useState, useContext, useEffect } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Contrasenya() {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const [notifVisible, setNotifVisible] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<"success" | "error">("success");

  const handleGuardar = async () => {
    if (nueva !== confirmar) {
      setNotifMessage("La nueva contraseña no coincide");
      setNotifType("error");
      setNotifVisible(true);
      return;
    }

    if (!usuario?.id_usuario) {
      setNotifMessage("No se encontró usuario activo");
      setNotifType("error");
      setNotifVisible(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/sync/loginregistre/actualizar-password",
        {
          id_usuario: usuario.id_usuario,
          password: nueva,
        }
      );

      if (response.data?.message) {
        setNotifMessage("Contraseña actualizada correctamente");
        setNotifType("success");
        setNotifVisible(true);
        setNueva("");
        setConfirmar("");
      }
    } catch (err: any) {
      console.error(err);
      setNotifMessage(
        err.response?.data?.message ||
          "Ocurrió un error al actualizar la contraseña"
      );
      setNotifType("error");
      setNotifVisible(true);
    }
  };

  // Cuando la notificación se muestra, se oculta después de 3 segundos y se hace navigate(-1)
  useEffect(() => {
    if (notifVisible) {
      const timer = setTimeout(() => {
        setNotifVisible(false);
        navigate(-1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notifVisible, navigate]);

  return (
    <div
      style={{
        position: "fixed",
        alignItems: "center",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "#F1F2F6",
        overflowX: "hidden",
        overflowY: "auto",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "20px",
          paddingTop: "35px",
          background: "linear-gradient(135deg, #1D4ED8, #7E22CE)",
          display: "flex",
          alignItems: "center",
          color: "white",
        }}
      >
        <IconButton onClick={() => navigate(-1)} style={{ color: "white" }}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography variant="h5" style={{ marginLeft: 10, fontWeight: "bold" }}>
          Cambiar Contraseña
        </Typography>
      </div>

      <Card
        sx={{
          width: "80%",
          mx: "auto",
          maxWidth: 420,
          mt: 4,
          borderRadius: 3,
          padding: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <CardContent>
          <TextField
            label="Nueva contraseña"
            type={showNueva ? "text" : "password"}
            fullWidth
            margin="normal"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNueva(!showNueva)}>
                    {showNueva ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirmar contraseña"
            type={showConfirmar ? "text" : "password"}
            fullWidth
            margin="normal"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmar(!showConfirmar)}>
                    {showConfirmar ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              background: "linear-gradient(135deg, #1D4ED8 0%, #7E22CE 100%)",
              padding: "10px",
            }}
            onClick={handleGuardar}
          >
            Guardar
          </Button>
        </CardContent>
      </Card>

    {/* Overlay semitransparente */}
{notifVisible && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)", // negro con 30% de opacidad
      zIndex: 9999,
    }}
  ></div>
)}

{/* Tarjeta de notificación */}
{notifVisible && (
  <Card
    sx={{
      position: "fixed",
      top: "30%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      minWidth: 300,
      maxWidth: 400,
      borderRadius: 2,
      p: 2,
      textAlign: "center",
      background: notifType === "success" ? "#3f7cd7ff" : "#F44336",
      color: "white",
      boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
      zIndex: 10000, // encima del overlay
    }}
  >
    <Typography variant="subtitle1">{notifMessage}</Typography>
  </Card>
)}

    </div>
  );
}
