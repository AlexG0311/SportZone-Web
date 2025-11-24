import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subirImagenACloudinary } from '../services/CloudBinary';
import NavBar from "../components/NavBar";
import { useAuth } from '../hooks/useAuth';

interface FormData {
  nombre: string;
  tipo: 'Público' | 'Privado';
  descripcion: string;
  direccion: string;
  latitud: string; // ← Cambiar a string para el input
  longitud: string; // ← Cambiar a string para el input
  precio: string; // ← Cambiar a string para el input
  capacidad: string; // ← Cambiar a string para el input
  imagenUrl: string | null;
  estadoId: number;
}

export default function CrearEscenario() {
  
const { usuario } = useAuth();

  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    tipo: 'Público',
    descripcion: '',
    direccion: '',
    latitud: '', // ← Vacío por defecto
    longitud: '', // ← Vacío por defecto
    precio: '', // ← Vacío por defecto
    capacidad: '', // ← Vacío por defecto
    imagenUrl: null,
    estadoId: 1,
  });

  const [imagenPreview, setImagenPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Manejar selección de imagen
  const handleImagenChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

 
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    try {
      // Mostrar preview local primero
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Subir a Cloudinary
      setIsUploading(true);
      const cloudinaryUrl = await subirImagenACloudinary(file);
      
      console.log('Imagen subida a Cloudinary:', cloudinaryUrl);
      
      // Actualizar formData con la URL de Cloudinary
      setFormData(prev => ({
        ...prev,
        imagenUrl: cloudinaryUrl
      }));

      setIsUploading(false);
      alert('Imagen subida correctamente');
      
    } catch (error) {
      setIsUploading(false);
      console.error('Error uploading to Cloudinary:', error);
      alert('Error al subir la imagen. Intenta de nuevo.');
      setImagenPreview('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.imagenUrl) {
      alert('Por favor sube una imagen antes de continuar');
      return;
    }

    if (!formData.nombre || !formData.direccion || !formData.precio) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      // Preparar datos con conversión de tipos
      const payload = {
        nombre: formData.nombre,
        tipo: formData.tipo,
        descripcion: formData.descripcion,
        direccion: formData.direccion,
        latitud: formData.latitud ? parseFloat(formData.latitud) : null,
        longitud: formData.longitud ? parseFloat(formData.longitud) : null,
        precio: formData.precio ? parseFloat(formData.precio) : null,
        capacidad: formData.capacidad ? parseInt(formData.capacidad) : null,
        imagenUrl: formData.imagenUrl,
        estadoId: formData.estadoId,
        encargadoId: usuario ? usuario.id : null
      };

      console.log('📤 Payload enviado:', payload); // Debug

      const response = await fetch('https://backend-sportzone-production.up.railway.app/api/escenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(' Escenario creado exitosamente');
        navigate('/mi-escenario');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'No se pudo crear el escenario'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el escenario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Escenario</h1>
            <p className="text-gray-600 mt-2">Complete el formulario para registrar un nuevo escenario</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Información Básica */}
            <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Básica</h2>

              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Escenario *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Ej: Cancha de Fútbol Central"
                />
              </div>

              {/* Tipo */}
              <div>
                <label htmlFor="tipo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Escenario *
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="Público">Público</option>
                  <option value="Privado">Privado</option>
          
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                  placeholder="Describe las características del escenario..."
                />
              </div>

              {/* Capacidad */}
              <div>
                <label htmlFor="capacidad" className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacidad (personas) *
                </label>
                <input
                  type="number"
                  id="capacidad"
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Ej: 22"
                />
              </div>

              {/* Estado */}
              <div>
                <label htmlFor="estadoId" className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado *
                </label>
                <select
                  id="estadoId"
                  name="estadoId"
                  value={formData.estadoId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value={1}>Disponible</option>
                  <option value={2}>Ocupado</option>
                  <option value={3}>Mantenimiento</option>
                </select>
              </div>
            </div>

            {/* Sección 2: Ubicación */}
            <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ubicación</h2>

              {/* Dirección */}
              <div>
                <label htmlFor="direccion" className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Calle, número, ciudad, país"
                />
              </div>

              {/* Coordenadas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitud" className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitud *
                  </label>
                  <input
                    type="number"
                    id="latitud"
                    name="latitud"
                    value={formData.latitud}
                    onChange={handleChange}
                    required
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Ej: 9.30311063"
                  />
                </div>

                <div>
                  <label htmlFor="longitud" className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitud *
                  </label>
                  <input
                    type="number"
                    id="longitud"
                    name="longitud"
                    value={formData.longitud}
                    onChange={handleChange}
                    required
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Ej: -75.38869154"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  💡 Tip: Puedes obtener las coordenadas desde Google Maps haciendo clic derecho en el mapa.
                </p>
              </div>
            </div>

            {/* Sección 3: Precio e Imagen */}
            <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles Adicionales</h2>

              {/* Precio */}
              <div>
                <label htmlFor="precio" className="block text-sm font-semibold text-gray-700 mb-2">
                  Precio por Hora *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Imagen */}
              <div>
                <label htmlFor="imagen" className="block text-sm font-semibold text-gray-700 mb-2">
                  Imagen del Escenario
                </label>
                <div className="space-y-4">
                  {/* Preview de imagen */}
                  {imagenPreview && (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden">
                      <img
                        src={imagenPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                            <p>Subiendo a Cloudinary...</p>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setImagenPreview('');
                          setFormData(prev => ({ ...prev, imagenUrl: '' }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Input de archivo */}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click para subir</span> o arrastra la imagen
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                    </div>
                    <input
                      id="imagen"
                      type="file"
                      accept="image/*"
                      onChange={handleImagenChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || isUploading || !formData.imagenUrl}
                className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                {loading ? 'Creando...' : isUploading ? 'Subiendo imagen...' : 'Crear Escenario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
