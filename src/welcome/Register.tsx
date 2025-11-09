import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import CallIcon from "@mui/icons-material/Call";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./Register.css";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://api-miscuentas.onrender.com";

interface Errors {
  username?: string;
  email?: string;
  mobile?: string;
  password?: string;
}

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalShowClose, setModalShowClose] = useState(false);

  const navigate = useNavigate();

  const showModal = (title: string, message: string, showCloseButton = false) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalShowClose(showCloseButton);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, username: "Nombre es obligatorio" }));
    } else if (!/^[a-zA-Z0-9_-]+$/.test(value.trim())) {
      setErrors((prev) => ({ ...prev, username: "Solo letras, números, _ y -" }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.username;
        return newErrors;
      });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email es obligatorio" }));
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Email no válido" }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMobile(value);

    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, mobile: "Número es obligatorio" }));
    } else if (!/^\d+$/.test(value.trim())) {
      setErrors((prev) => ({ ...prev, mobile: "Solo puede contener dígitos" }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.mobile;
        return newErrors;
      });
    }
  };

  const validateFields = (): boolean => {
    const newErrors: Errors = {};

    if (!username.trim()) newErrors.username = "Nombre es obligatorio";
    else if (!/^[a-zA-Z0-9_-]+$/.test(username.trim()))
      newErrors.username = "Solo letras, números, _ y -";

    if (!email.trim()) newErrors.email = "Email es obligatorio";
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
      newErrors.email = "Email no válido";

    if (!mobile.trim()) newErrors.mobile = "Número es obligatorio";
    else if (!/^\d+$/.test(mobile.trim()))
      newErrors.mobile = "Solo puede contener dígitos";

    if (!password) newErrors.password = "Contraseña obligatoria";
    else if (password.length < 8)
      newErrors.password = "Debe tener al menos 8 caracteres";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      newErrors.password = "Debe contener al menos un carácter especial";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;
    setLoading(true);

    try {
      const nuevoUsuario = {
        id_codigounico: Date.now(),
        avatar: "default.png",
        nombre: username.trim(),
        cel_usuario: Number(mobile),
        correo_usuario: email.trim().toLowerCase(),
        password: password,
      };

      const res = await fetch(`${API_URL}/sync/loginregistre`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([nuevoUsuario]),
      });

      const result = await res.json();

      if (!res.ok) {
        showModal(
          "Error",
          result.message || "No se pudo registrar el usuario. Intenta nuevamente.",
          true
        );
        setLoading(false);
        return;
      }

      // Registro exitoso
      showModal("Registro exitoso", "¡Tu cuenta se ha creado correctamente!", false);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("❌ Error registrando usuario:", err);
      showModal("Error", "Ocurrió un error al registrar el usuario. Intenta nuevamente.", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <Stack spacing={2} width="100%">
          <Typography className="register-title">Regístrate</Typography>
          <Typography className="register-subtitle">
            Por favor completa los datos para continuar
          </Typography>

          <TextField
            fullWidth
            placeholder="Nombre de usuario *"
            value={username}
            onChange={handleUsernameChange}
            error={!!errors.username}
            helperText={errors.username}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PermIdentityIcon sx={{ color: "#8c98a4" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            placeholder="Email *"
            value={email}
            onChange={handleEmailChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailIcon sx={{ color: "#8c98a4" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            placeholder="Número móvil *"
            value={mobile}
            onChange={handleMobileChange}
            error={!!errors.mobile}
            helperText={errors.mobile}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CallIcon sx={{ color: "#8c98a4" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            placeholder="Contraseña *"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOpenIcon sx={{ color: "#8c98a4" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ minWidth: 0, padding: 0 }}
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                </InputAdornment>
              ),
            }}
          />

          <Stack spacing={4} width="100%" mt={2}>
            <Button
              fullWidth
              className="register-button"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </Button>
            <Typography className="register-link">
              ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
            </Typography>
          </Stack>
        </Stack>
      </div>

      {/* Modal */}
      <Dialog open={modalOpen}>
        <DialogTitle>{modalTitle}</DialogTitle>
        <DialogContent>
          <Typography>{modalMessage}</Typography>
        </DialogContent>
        {modalShowClose && (
          <DialogActions>
            <Button onClick={handleCloseModal}>Cerrar</Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
};

export default RegisterPage;
