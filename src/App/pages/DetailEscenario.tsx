import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MoreVertical, Trash2, Upload, MapPin, Users, DollarSign, ArrowLeft, Star, Plus } from 'lucide-react';
import type { Escenario, Imagen } from '@/App/types/escenario';
import { subirImagenACloudinary } from '@/App/services/CloudBinary';

// Componente de imagen con menú de opciones
function ImageCard({ 
  imagen, 
  index, 
  isMain,
  onDelete, 
  onChange,
  onSetMain
}: { 
  imagen: Imagen;
  index: number;
  isMain: boolean;
  onDelete: (id: number) => void;
  onChange: (id: number, newUrl: string) => void;
  onSetMain?: (id: number) => void;
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

  const handleSetAsMain = () => {
    if (onSetMain) {
      onSetMain(imagen.id!);
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

// Componente para agregar nueva imagen
function AddImageCard({ 
  onAdd, 
  isUploading,
  label = "Agregar imagen"
}: { 
  onAdd: (file: File) => void;
  isUploading: boolean;
  label?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onAdd(file);
    }
  };

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full h-56 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
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

export default function DetailEscenario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [escenario, setEscenario] = useState<Escenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchEscenario = async () => {
      try {
        const response = await fetch(`https://backend-sportzone-production.up.railway.app/api/escenario/${id}`, {
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Error al cargar el escenario');

        const data = await response.json();
        setEscenario(data);
      } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el escenario');
      } finally {
        setLoading(false);
      }
    };

    fetchEscenario();
  }, [id]);

  const handleDeleteImage = async (imagenId: number) => {
    if (!escenario) return;

    try {
      const response = await fetch(`https://backend-sportzone-production.up.railway.app/api/escenario/imagen/${imagenId}`, {
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

  const handleChangeImage = async (imagenId: number, newUrl: string) => {
    if (!escenario) return;

    try {
      const response = await fetch(`https://backend-sportzone-production.up.railway.app/api/escenario/imagen/${imagenId}`, {
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

  const handleSetAsMain = async (imagenId: number) => {
    if (!escenario) return;

    try {
      const response = await fetch(`https://backend-sportzone-production.up.railway.app/api/escenario/${id}/imagenes/orden`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Error al establecer imagen principal');

      // Actualizar estado local - cambiar el orden
      const updatedImagenes = escenario.imagenes.map(img => {
        if (img.id === imagenId) {
          return { ...img, orden: 0 };
        } else if (img.orden === 0) {
          return { ...img, orden: 1 };
        }
        return img;
      });

      setEscenario({
        ...escenario,
        imagenes: updatedImagenes
      });

      alert('Imagen principal actualizada');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al establecer imagen principal');
    }
  };

  const handleAddImage = async (file: File) => {
    if (!escenario) return;

    setUploadingImage(true);

    try {
      // Subir a Cloudinary
      const url = await subirImagenACloudinary(file);

      // Determinar el orden (siguiente número disponible)
      const maxOrden = escenario.imagenes.length > 0 
        ? Math.max(...escenario.imagenes.map(img => img.orden))
        : -1;
      const nuevoOrden = maxOrden + 1;

      // Guardar en base de datos
      const response = await fetch(`https://backend-sportzone-production.up.railway.app/api/escenario/${id}/imagen`, {
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

      // Actualizar estado local
      setEscenario({
        ...escenario,
        imagenes: [...escenario.imagenes, nuevaImagen]
      });

      alert('Imagen agregada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!escenario) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-xl text-gray-600">Escenario no encontrado</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Volver
        </button>
      </div>
    );
  }

  const imagenesOrdenadas = [...escenario.imagenes].sort((a, b) => a.orden - b.orden);
  const imagenPrincipal = imagenesOrdenadas[0];
  const imagenesAdicionales = imagenesOrdenadas.slice(1);
  const maxImagenes = 6; // Máximo de imágenes permitidas
  const puedeAgregarMas = escenario.imagenes.length < maxImagenes;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header con botón volver */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Grid principal: Imagen + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Imagen Principal */}
          <div>
            {imagenPrincipal ? (
              <ImageCard
                imagen={imagenPrincipal}
                index={0}
                isMain={true}
                onDelete={handleDeleteImage}
                onChange={handleChangeImage}
              />
            ) : (
              <AddImageCard
                onAdd={handleAddImage}
                isUploading={uploadingImage}
                label="Agregar imagen principal"
              />
            )}
          </div>

          {/* Información del Escenario */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {escenario.nombre}
                </h1>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-lg ${
                  escenario.tipo === 'Público' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {escenario.tipo}
                </span>
              </div>

              <span className={`px-3 py-1 text-sm font-medium rounded-lg ${
                escenario.estadoId === 1
                  ? 'bg-green-100 text-green-700'
                  : escenario.estadoId === 3
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {escenario.estado.nombre}
              </span>
            </div>

            {/* Detalles en cards */}
            <div className="grid grid-cols-1 gap-4">
              {/* Precio */}
              {escenario.tipo === 'Privado' && (
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700 uppercase">Precio por hora</p>
                    <p className="text-2xl font-bold text-green-900">
                      ${parseFloat(escenario.precio).toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
              )}

              {/* Capacidad */}
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700 uppercase">Capacidad</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {escenario.capacidad} personas
                  </p>
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-700 uppercase">Dirección</p>
                  <p className="text-sm font-semibold text-blue-900">
                    {escenario.direccion}
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">
                {escenario.descripcion}
              </p>
            </div>

            {/* Encargado */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Encargado</p>
              <p className="font-semibold text-gray-900">{escenario.encargado.nombre}</p>
              <p className="text-sm text-gray-600">{escenario.encargado.email}</p>
            </div>
          </div>
        </div>

        {/* Imágenes Adicionales */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Imágenes Adicionales ({imagenesAdicionales.length})
            </h2>
            {puedeAgregarMas && (
              <span className="text-sm text-gray-500">
                Puedes agregar {maxImagenes - escenario.imagenes.length} más
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {imagenesAdicionales.map((imagen, index) => (
              <ImageCard
                key={imagen.id}
                imagen={imagen}
                index={index + 1}
                isMain={false}
                onDelete={handleDeleteImage}
                onChange={handleChangeImage}
                onSetMain={handleSetAsMain}
              />
            ))}

            {/* Botón para agregar más imágenes */}
            {puedeAgregarMas && (
              <AddImageCard
                onAdd={handleAddImage}
                isUploading={uploadingImage}
                label="Agregar imagen"
              />
            )}
          </div>

          {!puedeAgregarMas && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                ⚠️ Has alcanzado el límite máximo de {maxImagenes} imágenes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}