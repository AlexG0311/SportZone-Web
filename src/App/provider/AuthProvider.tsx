
import { useState, useEffect,  type ReactNode } from "react";
import { AuthContext } from "../context/auth";

interface Usuario {
  id: number;
  email: string;
  nombre: string;
}
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);


  const checkAuth = async () => {
    try {
      const response = await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/usuario/user`, {
        method: 'GET',                          
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUsuario(data.usuario);
      } else {
        setUsuario(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (usuario: Usuario) => {
    setUsuario(usuario);
  };

  const logout = async () => {
    try {
      await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/usuario/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUsuario(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    usuario,
    setUsuario,
    isAuthenticated: !!usuario,
    loading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};