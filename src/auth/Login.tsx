import React, { useState, useContext } from "react";
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
import "./Login.css";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUsuario } = useContext(AuthContext); // ✅ usar contexto

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

      console.log("Login exitoso:", data.user);

      // ✅ Actualizar contexto y guardar en localStorage
      setUsuario(data.user);
      localStorage.setItem("usuario", JSON.stringify(data.user));

      navigate("/inicio");
    } catch (err) {
      console.error(err);
      setErrorMessage("Error del servidor. Intenta nuevamente.");
      setOpenErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
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
          type="password"
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Iniciar sesión"}
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
