import { useState } from "react";
import { PropsModal } from "../types/modal"
import { handleFileChangePerfil } from "../utils/handleFileChangePerfil"
import { useAuth } from "../hooks/useAuth";
import { AddImgPerfil } from "../services/AddImgPerfil";

export const ModalAddPerfil = ({isOpen, onClose}:PropsModal ) => {
const [url, setUrl] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);
const { usuario } = useAuth();


if(!isOpen){
    return null
}

const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const imageUrl = await handleFileChangePerfil(e);
  setUrl(imageUrl);
};

const handleSave = async () => {
  if(!usuario || !url) return;
  
  try {
    setIsLoading(true);
    await AddImgPerfil(usuario.id, url);
    onClose();
  } catch (error) {
    console.error('Error al guardar perfil:', error);
  } finally {
    setIsLoading(false);
  }
};

return (
<div className="fixed z-50 inset-0 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>

  {/* Overlay */}
    <div 
      className="absolute inset-0 bg-black/40" 
      onClick={onClose}/>

    <div className="flex flex-col items-center gap-5 justify-center relative bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4 z-10">
    <h1 className="font-bold">Elige una foto de Perfil</h1>
    
    <input 
      id="file-upload"
      type="file"
      accept="image/*"
      onChange={handleChange}
      className="hidden"
    />
    <label 
      htmlFor="file-upload"
      className="cursor-pointer px-6 py-2 hover:bg-green-600 rounded-md bg-green-500 text-white font-medium transition-colors">
      Agregar foto
    </label>
    
    <button
      onClick={handleSave}
      disabled={!url || isLoading}
      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md text-white font-medium transition-colors">
      {isLoading ? 'Guardando...' : 'Guardar Banner'}
    </button>

    </div>


   
</div>  


)


}