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
} from "@mui/material";

function Calculadora() {
  const monedas = [1000, 500, 200, 100, 50, 20, 10, 5, 3, 1];
  const [cantidades, setCantidades] = useState<number[]>(
    Array(monedas.length).fill("")
  );
  const [openModal, setOpenModal] = useState(false);

  // Calcular suma total
  const total = monedas.reduce(
    (acc, moneda, index) => acc + moneda * cantidades[index],
    0
  );

  // Cambiar cantidad de una fila
  const handleCantidadChange = (index: number, valor: number) => {
    const nuevasCantidades = [...cantidades];
    nuevasCantidades[index] = valor;
    setCantidades(nuevasCantidades);
  };

  // Eliminar todas las cantidades
  const handleEliminarTodo = () => {
    setCantidades(Array(monedas.length).fill(0));
  };

  return (
    <div className="calculadora">
      <h2>💰 Calculadora de Monedas</h2>

      {/* Encabezado con total y botón eliminar */}
      <div className="calculadora-header">
        <h3>Total: ${total}</h3>
        <Button
          className="eliminar"
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleEliminarTodo}
        />
      </div>

      <hr />

      {/* Filas de monedas */}
      {monedas.map((moneda, index) => (
        <div key={index} className="fila">
          <span>{moneda}</span>
          <span>x</span>
          <input
            type="number"
            value={cantidades[index]}
            onChange={(e) =>
              handleCantidadChange(index, Number(e.target.value))
            }
          />
          <span>= {moneda * cantidades[index]}</span>
        </div>
      ))}

      {/* Botón explicación */}
      <div className="calculadora-footer">
        <Button
          className="explicacion"
          variant="contained"
          color="info"
          startIcon={<QuestionMarkRoundedIcon />}
          onClick={() => setOpenModal(true)}
        />
      </div>

      {/* Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>ℹ️ Explicación</DialogTitle>
        <DialogContent>
          <p>
            En el cuadro numerico vamos a introducir un valor (X) el cual se nos
            va a multiplicar por la cifra que tenemos a nuestra izquierda de la
            pantalla dandonos a ver los resultados de la cantidad de billetes
            que tenemos a nuestras derecha, y en la parte superior podemos
            apreciar la suma de los campos introdicidos dandonos a conocer el
            total de billetes
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Calculadora;
