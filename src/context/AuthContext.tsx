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
}

export const AuthContext = createContext<AuthContextType>({
  usuario: null,
  setUsuario: () => {},
  cerrarSesion: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Cargar usuario guardado del localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  // Guardar cambios en localStorage cuando cambie el usuario
  useEffect(() => {
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("usuario");
    }
  }, [usuario]);

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};
