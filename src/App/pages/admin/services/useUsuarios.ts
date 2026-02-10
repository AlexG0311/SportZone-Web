import type { Usuario } from "@/App/types/usuario";
import { useState,useEffect } from "react";
export const useUsuarios =() => {
  
const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/usuario/`)
      .then(res => res.json())
      .then(setUsuarios);
  }, []);

return {usuarios}

}
