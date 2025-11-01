import { useState, useEffect } from "react";
import axios from "axios";
import { db, Nomencladores } from "../bdDexie";

export function useOptions(key: keyof Nomencladores, url?: string) {
  const [options, setOptions] = useState<{ value: any; label: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      // 1️⃣ Offline
      const local = await db.nomencladores.get("default");
      if (local && Array.isArray(local[key])) {
        setOptions(
          (local[key] as { value: number; label: string }[]).map((o) => ({
            value: o.value,
            label: o.label,
          }))
        );
      }

      // 2️⃣ Online
      if (url) {
        try {
          const res = await axios.get(url);
          const remote = res.data.map((o: any) => ({
            value: o.id || o.value,
            label: o.label || o.denominacion || o.name,
          }));
          setOptions(remote);
        } catch (err) {
          console.error(err);
        }
      }
    };
    load();
  }, [key, url]);

  return options;
}
