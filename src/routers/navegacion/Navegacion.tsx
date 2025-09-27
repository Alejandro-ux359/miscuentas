import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/inicio">Inicio</Link>
      <Link to="/notificacion">Notificaciones</Link>
      <Link to="/negocios">Negocios</Link>
      <Link to="/calculadora">Calculadora</Link>
      <Link to="/configuracion">Configuración</Link>
      <Link to="/ingresosgastos">Ingresos y Gastos</Link>
    </nav>
  );
}

export default Navbar;
