import { useState } from "react";
import { Escenario } from "../types/escenario";
 
 
 export const useHandleDeleteImage = async (imagenId: number) => {
  const [escenario, setEscenario] = useState<Escenario | null>(null);


    if (!escenario) return;

    try {
      const response = await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/escenario/imagen/${imagenId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Error al eliminar imagen');

      // Actualizar estado local
      setEscenario({
        ...escenario,
        imagenes: escenario.imagenes.filter(img => img.id !== imagenId)
      });

      alert('Imagen eliminada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la imagen');
    }
  };
