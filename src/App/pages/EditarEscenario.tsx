import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import NavBar from "../components/NavBar";
import { useAuth } from '../hooks/useAuth';

// Fix para el icono del marcador en Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clics en el mapa
function LocationMarker({ 
  position, 
  setPosition 
}: { 
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
    </Marker>
  );
}

interface FormData {
  nombre: string;
  tipo: 'Público' | 'Privado';
  descripcion: string;
  direccion: string;
  latitud: string;
  longitud: string;
  precio: string;
  capacidad: string;
  imagenUrl: string | null;
  estadoId: number;
}

export default function EditarEscenario() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    tipo: 'Público',
    descripcion: '',
    direccion: '',
    latitud: '',
    longitud: '',
    precio: '',
    capacidad: '',
    imagenUrl: null,
    estadoId: 1,
  });

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const defaultPosition: [number, number] = [9.30311063, -75.38869154];

  // Cargar datos del escenario
  useEffect(() => {
    const cargarEscenario = async () => {
      if (!id) {
        navigate('/mis-escenarios');
        return;
      }

      try {
        const response = await fetch(`https://backend-sportzone-production.up.railway.app/api/escenario/${id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar el escenario');
        }

        const escenario = await response.json();

        setFormData({
          nombre: escenario.nombre || '',
          tipo: escenario.tipo || 'Público',
          descripcion: escenario.descripcion || '',
          direccion: escenario.direccion || '',
          latitud: escenario.latitud ? escenario.latitud.toString() : '',
          longitud: escenario.longitud ? escenario.longitud.toString() : '',
          precio: escenario.precio ? escenario.precio.toString() : '',
          capacidad: escenario.capacidad ? escenario.capacidad.toString() : '',
          imagenUrl: escenario.imagenUrl || null,
          estadoId: escenario.estadoId || 1,
        });

        // Establecer posición en el mapa
        if (escenario.latitud && escenario.longitud) {
          setPosition([parseFloat(escenario.latitud), parseFloat(escenario.longitud)]);
        }

        setLoadingData(false);
      } catch (error) {
        console.error('Error al cargar escenario:', error);
        alert('Error al cargar los datos del escenario');
        navigate('/mis-escenarios');
      }
    };

    cargarEscenario();
  }, [id, navigate]);

  // Actualizar coordenadas cuando cambia la posición en el mapa
  useEffect(() => {
    if (position) {
      setFormData(prev => ({
        ...prev,
        latitud: position[0].toFixed(8),
        longitud: position[1].toFixed(8)
      }));
    }
  }, [position]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Actualizar posición del mapa cuando se escriben coordenadas
  const handleCoordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Actualizar mapa si ambas coordenadas son válidas
    const lat = name === 'latitud' ? parseFloat(value) : parseFloat(formData.latitud);
    const lng = name === 'longitud' ? parseFloat(value) : parseFloat(formData.longitud);

    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.direccion || !formData.precio) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
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

      const response = await fetch(`https://backend-sportzone-production.up.railway.app/api/escenario/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('✅ Escenario actualizado exitosamente');
        navigate('/mi-escenario');
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.message || 'No se pudo actualizar el escenario'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al actualizar el escenario');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos del escenario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
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
            <h1 className="text-3xl font-bold text-gray-900">Editar Escenario</h1>
            <p className="text-gray-600 mt-2">Modifica la información del escenario</p>
          </div>

          {/* Layout: Formulario + Mapa */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Columna Izquierda - Formulario */}
              <div className="space-y-6">
                
                {/* Información Básica */}
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>

                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Escenario *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="Ej: Cancha de Fútbol Central"
                    />
                  </div>

                  <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo *
                    </label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    >
                      <option value="Público">Público</option>
                      <option value="Privado">Privado</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                      placeholder="Describe las características del escenario..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700 mb-2">
                        Capacidad *
                      </label>
                      <input
                        type="number"
                        id="capacidad"
                        name="capacidad"
                        value={formData.capacidad}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="22"
                      />
                    </div>

                    <div>
                      <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                        Precio/Hora *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          id="precio"
                          name="precio"
                          value={formData.precio}
                          onChange={handleChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="estadoId" className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      id="estadoId"
                      name="estadoId"
                      value={formData.estadoId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    >
                      <option value={8}>Disponible</option>
                      <option value={9}>Ocupado</option>
                      <option value={10}>Mantenimiento</option>
                    </select>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h2>

                  <div>
                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="Calle, número, ciudad"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="latitud" className="block text-sm font-medium text-gray-700 mb-2">
                        Latitud *
                      </label>
                      <input
                        type="number"
                        id="latitud"
                        name="latitud"
                        value={formData.latitud}
                        onChange={handleCoordChange}
                        required
                        step="any"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="9.30311063"
                      />
                    </div>

                    <div>
                      <label htmlFor="longitud" className="block text-sm font-medium text-gray-700 mb-2">
                        Longitud *
                      </label>
                      <input
                        type="number"
                        id="longitud"
                        name="longitud"
                        value={formData.longitud}
                        onChange={handleCoordChange}
                        required
                        step="any"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="-75.38869154"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      💡 Haz clic en el mapa para seleccionar la ubicación
                    </p>
                  </div>
                </div>

              </div>

              {/* Columna Derecha - Mapa */}
              <div className="lg:sticky lg:top-4 h-fit">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubicación en el Mapa</h2>
                  
                  <div className="rounded-xl overflow-hidden border-2 border-gray-200 h-[600px]">
                    <MapContainer
                      center={position || defaultPosition}
                      zoom={13}
                      scrollWheelZoom={true}
                      className="h-full w-full"
                      key={position ? `${position[0]}-${position[1]}` : 'default'}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                  </div>

                  {position && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        📍 Ubicación seleccionada:
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Lat: {position[0].toFixed(6)} | Lng: {position[1].toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 sticky bottom-0 bg-gray-50 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                {loading ? 'Actualizando...' : 'Actualizar Escenario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}