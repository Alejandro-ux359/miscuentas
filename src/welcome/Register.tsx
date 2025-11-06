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
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import CallIcon from "@mui/icons-material/Call";
import "./Register.css";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = () => {
    console.log("Username:", username, "Mobile:", mobile, "Password:", password);
    navigate("/home");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <Typography className="register-title">Registrese</Typography>
        <Typography className="register-subtitle">
          Porfavor registrese para continuar
        </Typography>

        <TextField
          variant="outlined"
          fullWidth
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PermIdentityIcon sx={{ color: "#8c98a4" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          variant="outlined"
          fullWidth
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CallIcon sx={{ color: "#8c98a4" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          variant="outlined"
          fullWidth
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOpenIcon sx={{ color: "#8c98a4" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* <div className="remember-row">
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Remind me next time"
          />
        </div> */}

        <Button
          fullWidth
          className="register-button"
          onClick={handleSignUp}
        >
          Sign Up
        </Button>

        <Typography className="register-link">
          "Esta cuenta ya existe".  <a href="/login">Sign In</a>
        </Typography>
      </div>
    </div>
  );
};

export default RegisterPage;
