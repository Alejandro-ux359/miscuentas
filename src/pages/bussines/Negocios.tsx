import React, { useState } from "react";
import "../bussines/Negocios.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Modal, Box, TextField, Button } from "@mui/material";

interface Negocio {
  nombre: string;
  categoria: string;
  balance: number;
}

const Negocios: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoNegocio: Negocio = {
      nombre: formData.nombre,
      categoria: formData.categoria,
      balance: 0,
    };
    setNegocios([...negocios, nuevoNegocio]);
    setFormData({ nombre: "", categoria: "" });
    handleClose();
  };

  return (
    <div className="negocios-container">
      {/* Lista de negocios */}
      <div className="tarjetas-container">
        {negocios.map((neg, index) => (
          <div key={index} className="tarjeta-negocio">
            <h3>{neg.nombre}</h3>
            <p>{neg.categoria}</p>
            <h2>${neg.balance.toFixed(2)}</h2>
          </div>
        ))}
      </div>

      {/* Botón flotante */}
      <button className="floating-button" onClick={handleOpen}>
        <AddCircleIcon fontSize="large" />
      </button>

      {/* Modal con formulario */}
      <Modal open={open} onClose={handleClose}>
        <Box className="modal-box">
          <h2>Agregar negocio</h2>
          <form onSubmit={handleSubmit} className="formulario">
            <TextField
              label="Nombre del negocio"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Categoría"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              fullWidth
              required
            />
            <div className="form-buttons">
              <Button type="submit" variant="contained" color="primary">
                Guardar
              </Button>
              <Button onClick={handleClose} variant="outlined" color="secondary">
                Cancelar
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Negocios;
