import { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Star, X, Upload, Loader2 } from 'lucide-react';
import { subirImagenACloudinary } from '../services/CloudBinary';

interface Imagen {
  id?: number;
  url: string;
  descripcion: string;
  orden: number;
  isNew?: boolean;
  isUploading?: boolean;
}

interface ImageManagerProps {
  imagenes: Imagen[];
  onChange: (imagenes: Imagen[]) => void;
  maxImages?: number;
}

function SortableImage({ 
  imagen, 
  index,
  onRemove, 
  onSetMain,
  isMain 
}: { 
  imagen: Imagen;
  index: number;
  onRemove: (index: number) => void;
  onSetMain: (index: number) => void;
  isMain: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: imagen.url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-xl overflow-hidden border-2 transition-all aspect-square ${
        isMain 
          ? 'border-yellow-500 ring-2 ring-yellow-500 ring-offset-2' 
          : 'border-gray-200 hover:border-blue-400'
      }`}
    >
      <img
        src={imagen.url}
        alt={`Imagen ${index + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Loading overlay */}
      {imagen.isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {/* Badge principal */}
      {isMain && !imagen.isUploading && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-md z-20">
          <Star className="w-3 h-3 fill-white" />
          Principal
        </div>
      )}

      {/* Badge de orden */}
      <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs font-semibold rounded-lg">
        #{index + 1}
      </div>

      {/* Botones de acción */}
      {!imagen.isUploading && (
        <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isMain && (
            <button
              onClick={() => onSetMain(index)}
              className="flex-1 p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-lg text-xs font-semibold flex items-center justify-center gap-1"
              title="Establecer como principal"
            >
              <Star className="w-3 h-3" />
              Principal
            </button>
          )}
          <button
            onClick={() => onRemove(index)}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg"
            title="Eliminar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Handle para drag */}
      {!isMain && !imagen.isUploading && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ImageManager({ imagenes, onChange, maxImages = 6 }: ImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = imagenes.findIndex((img) => img.url === active.id);
      const newIndex = imagenes.findIndex((img) => img.url === over.id);
      
      const newImagenes = arrayMove([...imagenes], oldIndex, newIndex);
      
      // Actualizar el orden
      const updatedImagenes = newImagenes.map((img, index) => ({
        ...img,
        orden: index
      }));
      
      onChange(updatedImagenes);
    }
  };

  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imagenes.length + newFiles.length > maxImages) {
      alert(`Solo puedes tener un máximo de ${maxImages} imágenes`);
      return;
    }

    setIsUploading(true);

    // Crear previews temporales
    const tempImagenes: Imagen[] = newFiles.map((file, index) => ({
      url: URL.createObjectURL(file),
      descripcion: `Imagen ${imagenes.length + index + 1}`,
      orden: imagenes.length + index,
      isNew: true,
      isUploading: true
    }));

    onChange([...imagenes, ...tempImagenes]);

    // Subir imágenes
    try {
      const uploadPromises = newFiles.map(async (file, index) => {
        const url = await subirImagenACloudinary(file);
        return {
          url,
          descripcion: `Imagen ${imagenes.length + index + 1}`,
          orden: imagenes.length + index,
          isNew: true,
          isUploading: false
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);

      // Reemplazar previews con URLs reales
      const updatedImagenes = [
        ...imagenes,
        ...uploadedImages
      ];

      onChange(updatedImagenes);
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      alert('Error al subir algunas imágenes');
      // Eliminar las imágenes que fallaron
      onChange(imagenes);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newImagenes = imagenes.filter((_, i) => i !== index);
    // Recalcular orden
    const reorderedImagenes = newImagenes.map((img, i) => ({
      ...img,
      orden: i
    }));
    onChange(reorderedImagenes);
  };

  const handleSetMain = (index: number) => {
    const newImagenes = [...imagenes];
    // Mover la imagen seleccionada al inicio
    const [selected] = newImagenes.splice(index, 1);
    newImagenes.unshift(selected);
  
    // Recalcular orden
    const reorderedImagenes = newImagenes.map((img, i) => ({
      ...img,
      orden: i
    }));
    
    onChange(reorderedImagenes);
  };

  const emptySlots = Math.max(0, maxImages - imagenes.length);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          Imágenes del Escenario
        </label>
        <span className="text-sm text-gray-500">
          {imagenes.length} / {maxImages}
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={imagenes.map(img => img.url)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {imagenes.map((imagen, index) => (
              <SortableImage
                key={imagen.url}
                imagen={imagen}
                index={index}
                onRemove={handleRemove}
                onSetMain={handleSetMain}
                isMain={index === 0}
              />
            ))}

            {/* Botón para agregar más imágenes */}
            {emptySlots > 0 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center transition-all cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Agregar</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddImages}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tips:</strong>
        </p>
        <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4">
          <li>• La primera imagen será la principal</li>
          <li>• Arrastra para reordenar las imágenes</li>
          <li>• Haz clic en "Principal" para establecer una imagen como portada</li>
        </ul>
      </div>
    </div>
  );
}