import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Stack } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");  // Celular del usuario
  const [password, setPassword] = useState("");  // Contraseña
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),  // Enviamos solo el número de celular y la contraseña
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage("Móvil o contraseña incorrectos");
        setOpenErrorModal(true);
        return;
      }

      console.log("Login exitoso:", data.user);
      navigate("/inicio");  // Redirigir al inicio si el login es exitoso
    } catch (err) {
      console.error(err);
      setErrorMessage("Error del servidor. Intenta nuevamente.");
      setOpenErrorModal(true);
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

        {/* Campo de celular */}
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}  // Celular del usuario
          placeholder="Número de celular *"
          InputLabelProps={{ shrink: false }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PermIdentityIcon sx={{ color: "#8c98a4", mr: 1 }} />
              </InputAdornment>
            ),
            sx: {
              paddingLeft: "5px",
              "& input": {
                paddingLeft: "0px",
              },
              height: "50px",
            },
          }}
        />

        {/* Campo de contraseña */}
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
            sx: {
              paddingLeft: "5px",
              "& input": {
                paddingLeft: "0px",
              },
              height: "50px",
            },
          }}
        />

        {/* Contenedor para recordar y olvidar contraseña */}
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
          <Button fullWidth onClick={handleSignIn} className="login-button">
            Iniciar sesión
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
