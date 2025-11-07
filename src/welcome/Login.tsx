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
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    console.log("Username:", username, "Password:", password);
    navigate("/inicio");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Typography className="login-title">Iniciar sesión</Typography>
        <Typography className="login-subtitle">
          Porfavor inicie sesión para continuar
        </Typography>

        {/* Campo de usuario */}
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
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
          placeholder="Password"
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

        <Button fullWidth onClick={handleSignIn} className="login-button">
          Iniciar sesión
        </Button>

        <Typography className="login-link">
          ¿No tienes una cuenta? <a href="/register">Regístrate</a>
        </Typography>
      </div>
    </div>
  );
};

export default LoginPage;
