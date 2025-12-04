import { useState, useEffect, useContext } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../bdDexie";
import LogoutIcon from "@mui/icons-material/Logout";

export default function PerfilPage() {
  const navigate = useNavigate();
  const { usuario, setUsuario, cerrarSesion } = useContext(AuthContext);

  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const cargarUsuario = async () => {
      if (!usuario) return;

      setName(usuario.nombre);
      setEmail(usuario.correo || "");
      setPhone(usuario.celular || "");
      setAvatar(usuario.foto_perfil || "");

      const userDb = await db.loginregistre.get(usuario.id_usuario);
      if (userDb) {
        setPhone(userDb.cel_usuario?.toString() || usuario.celular || "");
        setPassword(userDb.password || "");
      }
    };

    cargarUsuario();
  }, [usuario]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

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

      setUsuario({
        ...usuario,
        nombre: name,
        correo: email,
        celular: phone,
        foto_perfil: avatar || undefined,
      });

      alert("Datos actualizados correctamente");
    } catch (err) {
      alert("Error actualizando usuario: " + err);
    }
  };

const eliminarCuenta = async () => {
  if (!usuario?.id_usuario) return alert("Usuario no válido");

  try {
    const API_URL =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : "https://api-miscuentas.onrender.com";

    const respuesta = await fetch(
      `${API_URL}/sync/deleteusuario/${Number(usuario.id_usuario)}`,
      { method: "DELETE" }
    );

    const data = await respuesta.json(); // directamente JSON
    console.log("RESPUESTA DELETE:", data);

    if (!respuesta.ok || !data?.message) {
      throw new Error(data?.error || "Error eliminando usuario");
    }

    // Eliminar usuario local en Dexie
    await db.loginregistre.delete(Number(usuario.id_usuario));

    // Cerrar sesión y redirigir
    cerrarSesion();
    alert("Cuenta eliminada correctamente");
    navigate("/login");
  } catch (e: any) {
    console.error("Error al eliminar cuenta:", e);
    alert("Error al eliminar la cuenta: " + e.message);
  }
};




  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "#F1F2F6",
        overflowY: "auto",
        overflowX: "hidden", // evita scroll horizontal
        zIndex: 9999,
        boxSizing: "border-box", // importante
      }}
    >
      {/* 🔵 Barra superior con degradado + botón atrás */}
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

        <Typography
          variant="h5"
          style={{
            marginLeft: 10,
            fontWeight: "bold",
          }}
        >
          Mi Perfil
        </Typography>
      </div>

      {/* 🔽 Contenedor blanco centrado */}
      <div style={{ padding: 20, boxSizing: "border-box" }}>
        <Card
          style={{
            borderRadius: 12,
            width: "100%",
            maxWidth: 500,
            boxSizing: "border-box", // importante
            margin: "0 auto",
          }}
        >
          <CardContent>
            <div style={{ textAlign: "center" }}>
              <Avatar
                src={avatar || undefined}
                sx={{ width: 110, height: 110, margin: "auto" }}
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
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Correo electrónico"
              value={email}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Teléfono"
              value={phone}
              fullWidth
              margin="normal"
              disabled
            />

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                background: "linear-gradient(135deg, #1D4ED8 0%, #7E22CE 100%)",
                padding: "10px",
              }}
              onClick={handleGuardarCambios}
            >
              Guardar foto
            </Button>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: "flex", // ← necesario
            flexDirection: "column", // ← uno debajo del otro
            alignItems: "center", // ← centrados horizontalmente
            mt: 3,
            gap: 1, // ← espacio entre botones
          }}
        >
          <CardContent>
            <Button
              sx={{
                color: "red",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              onClick={cerrarSesion}
            >
              Cerrar Sesión
              <LogoutIcon />
            </Button>
          </CardContent>

          <CardContent>
            <Button
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                color: "red",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              onClick={eliminarCuenta} // <-- CONECTADO AQUÍ
            >
              Eliminar Cuenta
              <DeleteIcon />
            </Button>
          </CardContent>
        </Box>
      </div>
    </div>
  );
}
