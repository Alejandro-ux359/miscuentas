import React, { createContext, useEffect, useState, ReactNode } from "react";
import { db } from "../bdDexie"; // si usas Dexie, opcional

interface Usuario {
  id_usuario: number;
  nombre: string;
  correo?: string;
  celular?: string;
  foto_perfil?: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
  cerrarSesion: () => void;
  loading: boolean;
  recoveryMode: boolean;
  setRecoveryMode: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  usuario: null,
  setUsuario: () => {},
  cerrarSesion: () => {},
  loading: true,
  recoveryMode: false,
  setRecoveryMode: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  // 🔵 Cargar sesión desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");

    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // 🔵 Guardar usuario en localStorage
  useEffect(() => {
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    }
  }, [usuario]);

  // 🔴 Cerrar sesión correctamente
  const cerrarSesion = async () => {
    setUsuario(null);
    localStorage.removeItem("usuario");

    // Si quieres borrar sesión en Dexie
    // await db.loginregistre.clear();

    // Redirigir al login inmediatamente
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        cerrarSesion,
        loading,
        recoveryMode,
        setRecoveryMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
