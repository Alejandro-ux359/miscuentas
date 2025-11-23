import { useState, useEffect, useContext } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Importa tu contexto
import { db, LoginRegistre } from "../../bdDexie";

export default function PerfilPage() {
  const navigate = useNavigate();
  const { usuario, setUsuario } = useContext(AuthContext);

  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Cargar datos del usuario desde Dexie
useEffect(() => {
  const cargarUsuario = async () => {
    if (usuario) {
      setName(usuario.nombre);
      setPhone(usuario.celular || "");
      setEmail(usuario.correo || ""); 
      setAvatar(usuario.foto_perfil || "");

      
        // Traer password desde Dexie usando id_usuario
        const userDb = await db.loginregistre.get(usuario.id_usuario);
        if (userDb) {
          setPassword(userDb.password);
        } 
    }
  };

  cargarUsuario();
}, [usuario]);



  // 🔹 Cambiar avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  // 🔹 Guardar cambios
  const handleGuardarCambios = async () => {
    if (!usuario) return;

    try {
      await db.loginregistre.update(Number(usuario.id_usuario), {
        nombre: name,
        cel_usuario: Number(phone),
        correo_usuario: email,
        password,
        avatar: avatar || "default.png",
      });

      // Actualizar contexto
      setUsuario({
        ...usuario,
        nombre: name,
        celular: phone,
        foto_perfil: avatar || undefined,
      });

      alert("Datos actualizados correctamente");
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      alert("Error actualizando usuario: " + err);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "20px auto" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <ArrowBackIosNewIcon
          style={{ cursor: "pointer", marginRight: 10 }}
          onClick={() => navigate(-1)}
        />
        <Typography variant="h5">Mi Perfil</Typography>
      </div>

      <Card>
        <CardContent>
          <div style={{ textAlign: "center" }}>
            <Avatar
              src={avatar || undefined}
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
            <div style={{ marginTop: 10 }}>
              <IconButton component="label">
                <PhotoCameraIcon />
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleAvatarChange}
                />
              </IconButton>
              {avatar && (
                <IconButton color="error" onClick={() => setAvatar(null)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          </div>

          <TextField
            label="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ 
              mt: 2,
             background: "linear-gradient(135deg, #1D4ED8 0%, #7E22CE 100%)",
            }}
            onClick={handleGuardarCambios}
          >
            Guardar cambios
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
