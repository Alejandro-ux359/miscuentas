import React, { useState, useContext, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ importar contexto
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./Login.css";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUsuario } = useContext(AuthContext); // ✅ usar contexto
  const { setRecoveryMode } = useContext(AuthContext);

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://api-miscuentas.onrender.com";

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage("Móvil o contraseña incorrectos");
        setOpenErrorModal(true);
        setLoading(false);
        return;
      }

      // 👉 Guardar número de usuario si marcó "Recordar"
      if (rememberMe) {
        localStorage.setItem("rememberUser", username);
      } else {
        localStorage.removeItem("rememberUser");
      }

      console.log("Login exitoso:", data.user);

      // ✅ Actualizar contexto y guardar en localStorage
      const usuarioLimpio = {
        id_usuario: data.user.id_usuario,
        nombre: data.user.nombre,
        correo: data.user.correo,
        celular: data.user.celular,
        foto_perfil: data.user.avatar || "",
      };

      // Guardar en contexto y localStorage
      setUsuario(usuarioLimpio);
      localStorage.setItem("usuario", JSON.stringify(usuarioLimpio));

      navigate("/inicio");
    } catch (err) {
      console.error(err);
      setErrorMessage("Error de conexión. Intenta nuevamente.");
      setOpenErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const savedUser = localStorage.getItem("rememberUser");
  if (savedUser) {
    setUsername(savedUser);
    setRememberMe(true);
  }
}, []);

  const handleForgotPassword = () => {
    setRecoveryMode(true); // ✅ activar modo recuperación
    navigate("/contrasenya"); // ✅ ir a la página de cambio de contraseña
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Dialog open={openErrorModal} onClose={() => setOpenErrorModal(false)}>
          <DialogTitle>Error de inicio de sesión</DialogTitle>
          <DialogContent>
            <Typography>{errorMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenErrorModal(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>

        <Typography className="login-title">Iniciar sesión</Typography>
        <Typography className="login-subtitle">
          Por favor, inicie sesión para continuar
        </Typography>

        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Número de celular *"
          InputLabelProps={{ shrink: false }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PermIdentityIcon sx={{ color: "#8c98a4", mr: 1 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña *"
          InputLabelProps={{ shrink: false }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOpenIcon sx={{ color: "#8c98a4", mr: 1 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {showPassword ? (
                  <VisibilityOff
                    sx={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Visibility
                    sx={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </InputAdornment>
            ),
          }}
        />

        <div className="options-row">
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Recordar"
          />

          <Typography
            className="forgot-password-link"
            onClick={handleForgotPassword}
          >
            ¿Se te olvidó tu contraseña?
          </Typography>
        </div>

        <Stack spacing={3} width="100%" mt={2}>
          <Button
            fullWidth
            onClick={handleSignIn}
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Iniciar sesión"
            )}
          </Button>

          <Typography className="login-link">
            ¿No tienes una cuenta? <a href="/register">Regístrate</a>
          </Typography>
        </Stack>
      </div>
    </div>
  );
};

export default LoginPage;
