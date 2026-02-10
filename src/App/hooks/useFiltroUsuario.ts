import { useUsuarios } from "../pages/admin/services/useUsuarios"
import { useState} from "react";

export const useFiltroUsuario = () => {
    
const {usuarios} = useUsuarios();
const [buscar, setBuscar] = useState('');
const usuariosFiltrados = usuarios.filter(usuario => usuario.nombre.toLowerCase().
includes(buscar.toLowerCase()) || usuario.telefono.toLowerCase().includes(buscar.toLowerCase()));

return {usuariosFiltrados, buscar, setBuscar}

}
