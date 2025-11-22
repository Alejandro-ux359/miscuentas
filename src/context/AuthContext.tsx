import React, { createContext, useEffect, useState, ReactNode } from "react";

interface Usuario {
  id: string;
  nombre: string;
  celular: string;
  foto_perfil?: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
  cerrarSesion: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  usuario: null,
  setUsuario: () => {},
  cerrarSesion: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario guardado del localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");

    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }

    setLoading(false); // ← IMPORTANTE
  }, []);

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider
      value={{ usuario, setUsuario, cerrarSesion, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
