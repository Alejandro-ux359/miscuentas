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
          className="icono-eliminar"
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
            En esta interfaz contamos con un cuadro numérico (campo de entrada)
            donde el usuario puede introducir un valor denominado X. Este valor
            representa una cantidad o factor que será utilizado para realizar un
            cálculo automático. Al ingresar el valor X, el sistema toma esa
            cifra y la multiplica por el número que se encuentra a la izquierda
            de la pantalla, el cual representa el valor nominal de un billete o
            denominación específica (por ejemplo: 1, 5, 10, 20, 50, 100, etc.).
            
            Como resultado de esa multiplicación, el sistema muestra en la
            columna derecha la cantidad total correspondiente a esa
            denominación, es decir, el monto total en billetes de ese valor.

            Además, en la parte superior de la pantalla se encuentra un campo
            que suma automáticamente todos los totales de las distintas
            denominaciones, mostrando así el monto total de billetes
            introducidos. Este valor global permite conocer de forma inmediata
            el total general del dinero contado o registrado.
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
