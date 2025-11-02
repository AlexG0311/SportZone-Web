import { createContext} from "react";

interface Usuario {
  id: number;
  email: string;
  nombre: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
  isAuthenticated: boolean;
  loading: boolean; 
  login: (usuario: Usuario) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// ✅ Sin export, solo para uso interno
export const AuthContext = createContext<AuthContextType | null>(null);




