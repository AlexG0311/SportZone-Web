import { useRef } from "react";
import { Plus } from 'lucide-react';
import { useHandleAddImage } from "../hooks/useHandleAddImage";
import { Escenario } from "../types/escenario";

export default function AddImageCard({ 
  label = "Agregar imagen",
  escenarioId,
  escenario
}: { 
  label?: string;
  escenarioId?: string;
  escenario?: Escenario | null;
}) {
  const { uploadingImage, addImage } = useHandleAddImage(escenarioId, escenario);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await addImage(file);
      // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
      e.target.value = '';
    }
  };

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploadingImage}
        className="w-full h-56 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploadingImage ? (
          <>
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-600">Subiendo...</span>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">{label}</span>
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}