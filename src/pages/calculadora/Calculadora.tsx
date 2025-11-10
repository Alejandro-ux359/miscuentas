import { useState } from "react";
import "../../pages/calculadora/Calculadora.css";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionMarkRoundedIcon from "@mui/icons-material/QuestionMarkRounded";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";

function Calculadora() {
  const monedas = [1000, 500, 200, 100, 50, 20, 10, 5, 3, 1];
  const [cantidades, setCantidades] = useState<number[]>(Array(monedas.length).fill(""));
  const [openModal, setOpenModal] = useState(false);

  const formatSubtotal = (num: number) =>
    num >= 10000 ? num.toExponential(0) : num;

  const formatTotal = (num: number) =>
    num >= 100000 ? num.toExponential(0) : num;

  const total = monedas.reduce(
    (acc, moneda, index) => acc + moneda * (Number(cantidades[index]) || 0),
    0
  );

  const handleCantidadChange = (index: number, valor: number) => {
    const nuevasCantidades = [...cantidades];
    nuevasCantidades[index] = valor;
    setCantidades(nuevasCantidades);
  };

  const handleEliminarTodo = () => {
    setCantidades(Array(monedas.length).fill(0));
  };

  return (
    <div className="calculadora">
      

      <div className="calculadora-header">
        <h3>Total: ${formatTotal(total)}</h3>
        <Button
          className="icono-eliminar"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleEliminarTodo}
        />
      </div>

      <hr />

      {monedas.map((moneda, index) => (
        <div key={index} className="fila">
          <span>{moneda}</span>
          <span>x</span>
          <input
            type="number"
            value={cantidades[index]}
            onChange={(e) => handleCantidadChange(index, Number(e.target.value))}
          />
          <span>= {formatSubtotal(moneda * (cantidades[index] || 0))}</span>
        </div>
      ))}

      {/* Footer con botón circular */}
      <div className="calculadora-footer">
        <IconButton
          className="explicacion"
          onClick={() => setOpenModal(true)}
          aria-label="explicacion"
          sx={{
            width: 45,
            height: 45,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
            },
          }}
        >
          <QuestionMarkRoundedIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </div>

      {/* Modal estilizado */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            width: "500px",
            maxWidth: "90vw",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            fontWeight: 600,
            textAlign: "center",
            padding: "12px 16px",
          }}
        >
          Explicación de la Calculadora
        </DialogTitle>

        {/* CONTENT */}
        <DialogContent sx={{ padding: "20px 24px" }}>
          <Typography variant="body1" sx={{ color: "#333", lineHeight: 1.6 }}>
            En esta interfaz contamos con un cuadro numérico (campo de entrada)
            donde el usuario puede introducir un valor denominado <b>X</b>. Este
            valor representa una cantidad o factor que será utilizado para
            realizar un cálculo automático.
            <br />
            <br />
            Al ingresar el valor <b>X</b>, el sistema toma esa cifra y la
            multiplica por el número que se encuentra a la izquierda de la
            pantalla, el cual representa el valor nominal de un billete o
            denominación específica (por ejemplo: 1, 5, 10, 20, 50, 100, etc.).
            <br />
            <br />
            Como resultado de esa multiplicación, el sistema muestra en la
            columna derecha la cantidad total correspondiente a esa
            denominación, y en la parte superior se calcula automáticamente el
            monto total general.
          </Typography>
        </DialogContent>

        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />

        {/* FOOTER */}
        <DialogActions
          sx={{
            justifyContent: "center",
            padding: "12px 16px",
            backgroundColor: "#f0f2f5",
          }}
        >
          <Button
            onClick={() => setOpenModal(false)}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd1 0%, #6c3b9e 100%)",
              },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Calculadora;
