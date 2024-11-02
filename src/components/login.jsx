import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [usuario, setUsuario] = React.useState("");
  const [contrasena, setContrasena] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await api.post("/login", {
        usuario,
        contrasena,
      });

      const { access_token } = response.data;

      localStorage.setItem("token", access_token);

      // Decodificar el token para obtener el rol del usuario
      const decodedToken = JSON.parse(atob(access_token.split(".")[1]));
      const rol_id = decodedToken.rol_id;

      // Redirigir según el rol
      switch (rol_id) {
        case 1:
          navigate("/admin");
          break;
        case 2:
          navigate("/medicos");
          break;
        case 3:
          navigate("/enfermeros");
          break;
        default:
          setError("No se encontró el rol asociado");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Credenciales incorrectas");
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#405D72",
        color: "white",
        borderRadius: 2,
        boxShadow: 24,
      }}
    >
      <Typography variant="h5" sx={{ color: "white", marginBottom: 2 }}>
        Log In
      </Typography>
      <TextField
        label="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        variant="outlined"
        margin="normal"
        fullWidth
        InputLabelProps={{
          style: { color: "white" },
        }}
        InputProps={{
          style: { color: "white", borderColor: "white" },
        }}
      />
      <TextField
        label="Contraseña"
        type="password"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        variant="outlined"
        margin="normal"
        fullWidth
        InputLabelProps={{
          style: { color: "white" },
        }}
        InputProps={{
          style: { color: "white", borderColor: "white" },
        }}
      />
      {error && (
        <Typography variant="body2" sx={{ color: "red", marginBottom: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        onClick={handleLogin}
        fullWidth
        sx={{ backgroundColor: "#758694" }}
      >
        Ingresar
      </Button>
    </Box>
  );
}
