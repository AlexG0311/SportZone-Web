import { subirImagenACloudinary } from "../services/CloudBinary";
 
 export const handleFileChangePerfil = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith('image/')) {
      return await subirImagenACloudinary(file);
    }

    return null;

  };