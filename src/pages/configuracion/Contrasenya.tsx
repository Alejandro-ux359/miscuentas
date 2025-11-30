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
  const { usuario, setRecoveryMode } = useContext(AuthContext);

  const [emailOrPhone, setEmailOrPhone] = useState(""); // Para usuario no logueado
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [correoOCel, setCorreoOCel] = useState("");
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<"success" | "error">("success");

  const API_URL = "http://localhost:3000"; // Cambiar en producción

  const isPasswordStrong = (pwd: string) =>
    /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(pwd);

  const handleGuardar = async () => {
    if (nueva !== confirmar) {
      setNotifMessage("La nueva contraseña no coincide");
      setNotifType("error");
      setNotifVisible(true);
      return;
    }

    if (!isPasswordStrong(nueva)) {
      setNotifMessage(
        "La contraseña debe tener al menos 8 caracteres y un símbolo"
      );
      setNotifType("error");
      setNotifVisible(true);
      return;
    }

    try {
      // Construir payload dinámico
      const payload: any = { password: nueva };

      if (usuario?.id_usuario) {
        payload.id_usuario = usuario.id_usuario;
      } else {
        if (!correoOCel) {
          setNotifMessage("Por favor ingresa tu correo o teléfono");
          setNotifType("error");
          setNotifVisible(true);
          return;
        }

        // Detectar si es número o correo
        if (/^\d+$/.test(correoOCel)) {
          payload.cel_usuario = correoOCel;
        } else {
          payload.correo_usuario = correoOCel;
        }
      }

      const response = await axios.post(
        `${API_URL}/sync/loginregistre/actualizar-password`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );

      if (response.data?.message) {
        setNotifMessage("Contraseña actualizada correctamente");
        setNotifType("success");
        setNotifVisible(true);
        setNueva("");
        setConfirmar("");
        if (!usuario) setCorreoOCel(""); // limpiar campo si estaba en modo recuperación
      }
    } catch (err: any) {
      console.error("Axios error:", err);
      setNotifMessage(
        err.response?.data?.message ||
          "Ocurrió un error al actualizar la contraseña"
      );
      setNotifType("error");
      setNotifVisible(true);
    }
  };

  // Ocultar notificación después de 4 segundos
  useEffect(() => {
    if (notifVisible) {
      const timer = setTimeout(() => {
        setNotifVisible(false);
        if (notifType === "success") {
          setRecoveryMode(false);
          if (usuario && usuario.id_usuario !== undefined) {
            navigate(-1);
          } else {
            navigate("/login");
          }
        }
      }, 4000); // ⬅ 4 segundos
      return () => clearTimeout(timer);
    }
  }, [notifVisible, notifType, navigate, setRecoveryMode, usuario]);

  return (
    <div
      style={{
        position: "fixed",
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
      {/* Header */}
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

      {/* Formulario */}
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
          {!usuario && (
            <TextField
              label="Correo o teléfono"
              type="text"
              fullWidth
              margin="normal"
              value={correoOCel}
              onChange={(e) => setCorreoOCel(e.target.value)}
            />
          )}

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
            backgroundColor: "rgba(0,0,0,0.3)",
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
            zIndex: 10000,
          }}
        >
          <Typography variant="subtitle1">{notifMessage}</Typography>
        </Card>
      )}
    </div>
  );
}
