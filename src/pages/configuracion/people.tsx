import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function People() {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        cursor: "pointer",
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
      onClick={() => navigate("/perfil")}
    >
      <CardContent sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <AccountCircleIcon fontSize="large" />
        <Typography variant="h6">Mi perfil</Typography>
      </CardContent>
    </Card>
  );
}
