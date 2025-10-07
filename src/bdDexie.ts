import Dexie from "dexie";
import { supabase } from "./supaBase";

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

export const syncInsert = async (mov: Movimiento, idDexie: number) => {
  const { error } = await supabase.from("movimientos").insert([{ ...mov, id: idDexie }]);
  if (error) console.error("Error insertando en Supabase:", error);
};

export const syncUpdate = async (id: number, mov: Movimiento) => {
  const { error } = await supabase.from("movimientos").update(mov).eq("id", id);
  if (error) console.error("Error actualizando en Supabase:", error);
};

export const syncDelete = async (id: number) => {
  const { error } = await supabase.from("movimientos").delete().eq("id", id);
  if (error) console.error("Error eliminando en Supabase:", error);
};
