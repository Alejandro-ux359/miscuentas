import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Card, CardContent, Divider, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockResetIcon from "@mui/icons-material/LockReset";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

export default function People() {
  const navigate = useNavigate();
  const disabled = true;

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* CONTENIDO SCROLLABLE */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: 4, // deja espacio para el footer
        }}
      >
        <Card
          sx={{
            marginTop: 4,
            width: "90%",
            mx: "auto",
            cursor: "pointer",
            position: "relative",
            display: "flex",
            alignItems: "center",
            border: "2px solid #ccc",
            borderRadius: "12px",
            padding: "4px",
          }}
          onClick={() => navigate("/perfil")}
        >
          <CardContent
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <AccountCircleIcon fontSize="large" />
            <Typography variant="h6">Mi perfil</Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            marginTop: 4,
            width: "90%",
            mx: "auto",
            cursor: "pointer",
            position: "relative",
            display: "flex",
            alignItems: "center",
            border: "2px solid #ccc",
            borderRadius: "12px",
            padding: "4px",
          }}
          onClick={() => navigate("/contrasenya")}
        >
          <CardContent
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <LockResetIcon fontSize="large" />
            <Typography variant="h6">Cambiar contraseña</Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            marginTop: 4,
            width: "90%",
            mx: "auto",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.7 : 1,
            pointerEvents: disabled ? "none" : "auto",
            position: "relative",
            display: "flex",
            alignItems: "center",
            border: "2px solid #ccc",
            borderRadius: "12px",
            padding: "4px",
          }}
          onClick={!disabled ? () => navigate("/descargarapp") : undefined}
        >
          <CardContent
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <CloudDownloadIcon fontSize="large" />
            <Typography variant="h6">Descargar APP</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* FOOTER FIJO ABAJO */}
      <Box sx={{ textAlign: "center", paddingBottom: 2 }}>
        <Divider
          sx={{
            width: "80%",
            mx: "auto",
            borderStyle: "dashed",
            borderColor: "#ccc",
            marginBottom: 2,
          }}
        />

        <Typography
          variant="h6"
          sx={{
            opacity: 0.7,
          }}
        >
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
}
