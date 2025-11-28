import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockResetIcon from '@mui/icons-material/LockReset';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

export default function People() {
  const navigate = useNavigate();

  return (

    <>
    
  <Card
  sx={{
    marginTop:4,
    width:"90%",
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
    marginTop:4,
    width:"90%",
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
    marginTop:4,
    width:"90%",
    mx: "auto",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    alignItems: "center",
    border: "2px solid #ccc",     
    borderRadius: "12px",         
    padding: "4px",              
  }}
  onClick={() => navigate("/descargarapp")}
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



</>


  );
}
