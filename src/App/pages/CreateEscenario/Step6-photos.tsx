import { useState, useRef, useEffect } from "react"
import { Upload, Plus, X, Star, Loader2 } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { subirImagenACloudinary } from "@/App/services/CloudBinary"
import { useEscenario } from "@/App/hooks/useEscenario"

interface Step6PhotosProps {
  onValidationChange?: (isValid: boolean) => void
}

interface ImageItem {
  id: string
  url: string // URL de Cloudinary
  isUploading?: boolean
}

// Componente de imagen sortable
function SortableImage({ 
  image, 
  onRemove, 
  isMain, 
  onSetMain,
  size = "normal"
}: { 
  image: ImageItem
  onRemove: (id: string) => void
  isMain: boolean
  onSetMain: (id: string) => void
  size?: "normal" | "large"
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
        size === "large" ? "aspect-[4/3]" : "aspect-square"
      } ${
        isMain 
          ? 'border-yellow-500 ring-2 ring-yellow-500 ring-offset-2' 
          : 'border-gray-200 hover:border-blue-400'
      }`}
    >
      <img
        src={image.url}
        alt="Preview"
        className="w-full h-full object-cover"
      />

      {/* Loading overlay */}
      {image.isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {/* Badge de imagen principal */}
      {isMain && !image.isUploading && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-md z-20">
          <Star className="w-3 h-3 fill-white" />
          Principal
        </div>
      )}

      {/* Botones de acción */}
      {!image.isUploading && (
        <div className="absolute top-2 right-2 flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
          {!isMain && (
            <button
              onClick={() => onSetMain(image.id)}
              className="p-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-lg"
              title="Establecer como principal"
            >
              <Star className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          )}
          <button
            onClick={() => onRemove(image.id)}
            className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg"
            title="Eliminar"
          >
            <X className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
      )}

      {/* Handle para drag */}
      {!isMain && !image.isUploading && (
        <div
          {...attributes}
          {...listeners}
          className="hidden md:block absolute bottom-2 left-2 p-1 bg-white/90 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-3 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Step6Photos({ onValidationChange }: Step6PhotosProps) {
  const { escenarioData, updateField } = useEscenario()
  const [mainImage, setMainImage] = useState<ImageItem | null>(
    escenarioData.imagenPrincipal 
      ? { id: 'main', url: escenarioData.imagenPrincipal, isUploading: false }
      : null
  )
  const [additionalImages, setAdditionalImages] = useState<ImageItem[]>(
    escenarioData.imagenesAdicionales?.map((url, index) => ({
      id: `additional-${index}`,
      url,
      isUploading: false
    })) || []
  )
  const [isUploading, setIsUploading] = useState(false)
  const mainFileInputRef = useRef<HTMLInputElement>(null)
  const additionalFileInputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Sincronizar con el Context cuando cambien las imágenes
  useEffect(() => {
    if (mainImage && !mainImage.isUploading) {
      updateField('imagenPrincipal', mainImage.url)
    }
  }, [mainImage, updateField])

  useEffect(() => {
    const urls = additionalImages
      .filter(img => !img.isUploading)
      .map(img => img.url)
    
    updateField('imagenesAdicionales', urls)
  }, [additionalImages, updateField])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setAdditionalImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleMainImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return

    setIsUploading(true)

    // Mostrar preview inmediato
    const tempImage: ImageItem = {
      id: `main-${Date.now()}`,
      url: URL.createObjectURL(file),
      isUploading: true
    }
    setMainImage(tempImage)

    try {
      // Subir a Cloudinary
      const cloudinaryUrl = await subirImagenACloudinary(file)
      
      // Actualizar con URL real
      setMainImage({
        id: tempImage.id,
        url: cloudinaryUrl,
        isUploading: false
      })

      if (onValidationChange) {
        onValidationChange(true)
      }
    } catch (error) {
      console.error('Error al subir imagen principal:', error)
      alert('Error al subir la imagen. Por favor intenta de nuevo.')
      setMainImage(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleAdditionalImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    if (newFiles.length === 0) return

    setIsUploading(true)

    // Crear previews temporales
    const tempImages: ImageItem[] = newFiles.map(file => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      isUploading: true
    }))

    setAdditionalImages(prev => [...prev, ...tempImages])

    // Subir todas las imágenes
    try {
      const uploadPromises = newFiles.map(async (file, index) => {
        const url = await subirImagenACloudinary(file)
        return {
          id: tempImages[index].id,
          url,
          isUploading: false
        }
      })

      const uploadedImages = await Promise.all(uploadPromises)

      // Reemplazar previews temporales con URLs reales
      setAdditionalImages(prev => 
        prev.map(img => {
          const uploaded = uploadedImages.find(up => up.id === img.id)
          return uploaded || img
        })
      )
    } catch (error) {
      console.error('Error al subir imágenes adicionales:', error)
      alert('Error al subir algunas imágenes. Por favor intenta de nuevo.')
      // Eliminar las imágenes que fallaron
      setAdditionalImages(prev => prev.filter(img => !img.isUploading))
    } finally {
      setIsUploading(false)
    }
  }

  const removeMainImage = () => {
    setMainImage(null)
    updateField('imagenPrincipal', null)

    if (onValidationChange) {
      onValidationChange(false)
    }
  }

  const removeAdditionalImage = (id: string) => {
    setAdditionalImages(prev => prev.filter(img => img.id !== id))
  }

  const openMainSelector = () => {
    if (!isUploading) {
      mainFileInputRef.current?.click()
    }
  }

  const openAdditionalSelector = () => {
    if (!isUploading) {
      additionalFileInputRef.current?.click()
    }
  }

  // Calcular cuántas celdas vacías mostrar (máximo 6 adicionales)
  const maxAdditionalImages = 6
  const emptySlots = Math.max(0, maxAdditionalImages - additionalImages.length)

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-1">
          Fotos del Escenario
        </h1>
        <p className="text-sm text-gray-500">
          {isUploading ? 'Subiendo imágenes...' : 'Agrega las imágenes de tu escenario deportivo'}
        </p>
      </div>

      <input
        ref={mainFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleMainImageSelect}
        className="hidden"
        disabled={isUploading}
      />

      <input
        ref={additionalFileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleAdditionalImagesSelect}
        className="hidden"
        disabled={isUploading}
      />

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagen Principal */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-700">Imagen principal</p>
            {mainImage?.isUploading && (
              <span className="text-xs text-blue-600">Subiendo...</span>
            )}
          </div>
          
          {!mainImage ? (
            <button
              onClick={openMainSelector}
              disabled={isUploading}
              className="w-full aspect-[4/3] border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-10 h-10 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Imagen principal</span>
            </button>
          ) : (
            <div className="relative group aspect-[4/3] rounded-xl overflow-hidden border-2 border-yellow-500 ring-2 ring-yellow-500 ring-offset-2">
              <img
                src={mainImage.url}
                alt="Imagen principal"
                className="w-full h-full object-cover"
              />

              {mainImage.isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              
              {!mainImage.isUploading && (
                <>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-white" />
                    Principal
                  </div>

                  <button
                    onClick={removeMainImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Imágenes Adicionales */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-700">Adicionales</p>
            <span className="text-xs text-gray-500">({additionalImages.length}/{maxAdditionalImages})</span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={additionalImages} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 gap-3">
                {additionalImages.map((image) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    onRemove={removeAdditionalImage}
                    isMain={false}
                    onSetMain={() => {}}
                  />
                ))}

                {/* Celdas vacías */}
                {Array.from({ length: emptySlots }).map((_, index) => (
                  <button
                    key={`empty-${index}`}
                    onClick={openAdditionalSelector}
                    disabled={isUploading}
                    className="aspect-square border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-6 h-6 text-gray-400" />
                  </button>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Preview de URLs guardadas */}
      {(escenarioData.imagenPrincipal || escenarioData.imagenesAdicionales?.length > 0) && (
        <div className="w-full p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-2">URLs guardadas en Context:</p>
          <div className="text-xs text-blue-700 space-y-1">
            {escenarioData.imagenPrincipal && (
              <p className="truncate">Principal: {escenarioData.imagenPrincipal}</p>
            )}
            {escenarioData.imagenesAdicionales?.map((url, i) => (
              <p key={i} className="truncate">Adicional {i + 1}: {url}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}