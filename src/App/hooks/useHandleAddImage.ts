import { useState } from "react";
import { Escenario } from "../types/escenario";
import { subirImagenACloudinary } from "../services/CloudBinary";


export const useHandleAddImage = (escenarioId?: string, currentEscenario?: Escenario | null) => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const addImage = async (file: File) => {
    if (!escenarioId || !currentEscenario) return;
    
    setUploadingImage(true);
    
    try {
      // Subir a Cloudinary
      const url = await subirImagenACloudinary(file);

      // Determinar el orden (siguiente número disponible)
      const maxOrden = currentEscenario.imagenes.length > 0
        ? Math.max(...currentEscenario.imagenes.map(img => img.orden))
        : -1;
      const nuevoOrden = maxOrden + 1;

      // Guardar en base de datos
      const response = await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/escenario/${escenarioId}/imagen`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          descripcion: `Imagen ${nuevoOrden + 1}`,
          orden: nuevoOrden
        })
      });

      if (!response.ok) throw new Error('Error al agregar imagen');

      const nuevaImagen = await response.json();

      alert('Imagen agregada exitosamente');
      
      // Refrescar la página para mostrar la nueva imagen
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  return { uploadingImage, addImage };
};