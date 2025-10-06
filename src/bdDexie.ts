import Dexie from "dexie";

export interface Movimiento {
  id?: number;
  categoria: string;
  monto: number;
  metodo: string;
  cuenta: string;
  fecha: string;
  tipo: "Ingreso" | "Gasto";
}

class MiDB extends Dexie {
  movimientos!: Dexie.Table<Movimiento, number>;

  constructor() {
    super("MiDB");
    this.version(1).stores({
      movimientos: "++id, categoria, monto, metodo, cuenta, fecha, tipo",
    });
  }
}

export const db = new MiDB();
