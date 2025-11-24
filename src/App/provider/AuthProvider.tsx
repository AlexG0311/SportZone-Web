
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

 // ✅ Mostrar loading mientras verifica la sesión
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }
 

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};