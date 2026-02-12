import { MoreVertical, Trash2, Upload,Star} from 'lucide-react';
import type { Imagen } from '@/App/types/escenario';
import { subirImagenACloudinary } from '@/App/services/CloudBinary';
import { useState} from 'react';

export default function ImageCard({ 
  imagen, 
  index, 
  isMain,
  onDelete, 
  onChange
}: { 
  imagen: Imagen;
  index: number;
  isMain: boolean;
  onDelete: (id: number) => void;
  onChange: (id: number, newUrl: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    setIsUploading(true);
    setShowMenu(false);

    try {
      const newUrl = await subirImagenACloudinary(file);
      onChange(imagen.id!, newUrl);
    } catch (error) {
      console.error('Error al cambiar imagen:', error);
      alert('Error al cambiar la imagen. Intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar esta imagen?')) {
      onDelete(imagen.id!);
      setShowMenu(false);
    }
  };

  return (
    <div className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
      isMain ? 'border-yellow-500 ring-2 ring-yellow-500' : 'border-gray-200 hover:border-blue-400'
    }`}>
      <img
        src={imagen.url}
        alt={imagen.descripcion}
        className={`w-full object-cover ${isMain ? 'h-96' : 'h-56'}`}
      />

      {/* Loading overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Badge principal */}
      {isMain && (
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-yellow-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-lg">
          <Star className="w-4 h-4 fill-white" />
          Imagen Principal
        </div>
      )}

      {/* Badge de orden */}
      <div className="absolute top-4 right-16 px-2 py-1 bg-black/60 text-white text-xs font-semibold rounded-lg">
        #{index + 1}
      </div>

      {/* Menú de opciones */}
      {!isUploading && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-lg transition-all"
          >
            <MoreVertical className="w-5 h-5 text-gray-700" />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <>
              {/* Backdrop para cerrar el menú */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
               
                
                <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Cambiar imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleChangeImage}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">Eliminar imagen</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}