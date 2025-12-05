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
  Fade,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { db, eliminarUsuarioLocal } from "../../bdDexie";

// Avatares
import hombre1 from "../../../public/avatar/menAvatar.png";
import hombre2 from "../../../public/avatar/menAVatar (2).png";
import hombre3 from "../../../public/avatar/MenAvatar (3).png";
import mujer1 from "../../../public/avatar/WomanAvatr.png";
import mujer2 from "../../../public/avatar/WomanAVatar (2).png";
import mujer3 from "../../../public/avatar/womanAvatar.png";

export default function PerfilPage() {
  const navigate = useNavigate();
  const { usuario, setUsuario, cerrarSesion } = useContext(AuthContext);

  const [avatar, setAvatar] = useState<string>(hombre1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [notificacion, setNotificacion] = useState(false);

  const avatares = [hombre1, hombre2, hombre3, mujer1, mujer2, mujer3];

  // Cargar usuario al montar
  useEffect(() => {
    const cargarUsuario = async () => {
      if (!usuario) return;

      const userDb = await db.loginregistre.get(usuario.id_usuario);
      const avatarDB = userDb?.avatar || hombre1;

      setAvatar(avatarDB);
      setName(usuario.nombre);
      setEmail(usuario.correo || "");
      setPhone(userDb?.cel_usuario?.toString() || usuario.celular || "");
      setPassword(userDb?.password || "");

      setUsuario({
        ...usuario,
        foto_perfil: avatarDB,
      });
    };

    cargarUsuario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar avatar seleccionado
  const handleGuardarCambios = async () => {
    if (!usuario || !avatar) return;

    try {
      await db.loginregistre.update(Number(usuario.id_usuario), {
        avatar,
      });

      setUsuario({
        ...usuario,
        foto_perfil: avatar,
      });

      // Mostrar notificación
      setNotificacion(true);
      setTimeout(() => setNotificacion(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error actualizando foto: " + err);
    }
  };

  // Eliminar cuenta
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

      const data = await respuesta.json();
      if (!respuesta.ok || !data?.message) {
        throw new Error(data?.error || "Error eliminando usuario");
      }

      await eliminarUsuarioLocal(Number(usuario.id_usuario));
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
        overflowX: "hidden",
        zIndex: 9999,
        boxSizing: "border-box",
      }}
    >
      {/* Barra superior */}
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
          Mi Perfil
        </Typography>
      </div>

      {/* Contenedor principal */}
      <div style={{ padding: 20, boxSizing: "border-box" }}>
        <Card
          style={{
            borderRadius: 12,
            width: "100%",
            maxWidth: 500,
            margin: "50px auto",
          }}
        >
          <CardContent>
            <div style={{ textAlign: "center" }}>
              <Avatar
                src={avatar}
                sx={{ width: 110, height: 110, margin: "auto" }}
              />
            </div>

            {/* Avatares */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 60px)",
                  gridTemplateRows: "repeat(2, 60px)",
                  gap: "10px",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                {avatares.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`avatar-${idx}`}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      border:
                        avatar === img ? "3px solid #1D4ED8" : "2px solid #ccc",
                      cursor: "pointer",
                    }}
                    onClick={() => setAvatar(img)}
                  />
                ))}
              </div>
            </Box>

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
          </CardContent>
        </Card>

        {/* Botones Cerrar Sesión / Eliminar Cuenta */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 3,
            gap: 1,
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
              onClick={eliminarCuenta}
            >
              Eliminar Cuenta
              <DeleteIcon />
            </Button>
          </CardContent>
        </Box>
      </div>

      {/* Notificación */}
      <Fade in={notificacion}>
        <Card
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#1D4ED8",
            color: "white",
            padding: "20px 30px",
            borderRadius: 12,
            zIndex: 99999,
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            textAlign: "center",
            minWidth: 280,
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          ¡Foto de perfil actualizada correctamente!
        </Card>
      </Fade>
    </div>
  );
}
