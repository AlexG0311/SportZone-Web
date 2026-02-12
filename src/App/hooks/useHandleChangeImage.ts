import { Escenario } from "../types/escenario";
import { useState } from "react";

export const useHandleChangeImage = async (imagenId: number, newUrl: string) => {
  const [escenario, setEscenario] = useState<Escenario | null>(null);
    if (!escenario) return;

    try {
      const response = await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/escenario/imagen/${imagenId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: newUrl })
      });

      if (!response.ok) throw new Error('Error al actualizar imagen');

      // Actualizar estado local
      setEscenario({
        ...escenario,
        imagenes: escenario.imagenes.map(img => 
          img.id === imagenId ? { ...img, url: newUrl } : img
        )
      });

      alert('Imagen actualizada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar la imagen');
    }
  };