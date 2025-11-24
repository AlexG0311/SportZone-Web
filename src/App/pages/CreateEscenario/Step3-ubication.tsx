import { useState, useEffect } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useEscenario } from "@/App/hooks/useEscenario"
import L from "leaflet"

// Fix para el icono del marcador en Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clics en el mapa
function LocationMarker({ position, setPosition }: { 
  position: [number, number] | null, 
  setPosition: (pos: [number, number]) => void 
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div className="text-sm">
          <p className="font-semibold">Ubicación seleccionada</p>
          <p className="text-xs text-gray-600">Lat: {position[0].toFixed(6)}</p>
          <p className="text-xs text-gray-600">Lng: {position[1].toFixed(6)}</p>
        </div>
      </Popup>
    </Marker>
  );
}

interface Step3UbicationProps {
  onValidationChange?: (isValid: boolean) => void;
}

export default function Step3Ubication({ onValidationChange }: Step3UbicationProps) {
  const { escenarioData, updateUbicacion } = useEscenario();
  const defaultPosition: [number, number] = [9.30311063, -75.38869154];
  const [position, setPosition] = useState<[number, number] | null>(
    escenarioData.ubicacion.latitud && escenarioData.ubicacion.longitud
      ? [escenarioData.ubicacion.latitud, escenarioData.ubicacion.longitud]
      : null
  );
  const [latitud, setLatitud] = useState(
    escenarioData.ubicacion.latitud ? escenarioData.ubicacion.latitud.toString() : ""
  );
  const [longitud, setLongitud] = useState(
    escenarioData.ubicacion.longitud ? escenarioData.ubicacion.longitud.toString() : ""
  );
  const [direccion, setDireccion] = useState(escenarioData.ubicacion.direccion || "");
  const [errors, setErrors] = useState({ latitud: "", longitud: "", direccion: "" });

  // Sincronizar con el Context cuando cambien los valores
  useEffect(() => {
    const lat = parseFloat(latitud);
    const lng = parseFloat(longitud);
    
    if (!isNaN(lat) && !isNaN(lng) && direccion.trim()) {
      updateUbicacion('latitud', lat);
      updateUbicacion('longitud', lng);
      updateUbicacion('direccion', direccion);
    }
  }, [latitud, longitud, direccion, updateUbicacion]);

  // Validar campos
  const validateFields = (lat: string, lng: string, dir: string) => {
    const newErrors = {
      latitud: !lat ? "La latitud es requerida" : "",
      longitud: !lng ? "La longitud es requerida" : "",
      direccion: !dir.trim() ? "La dirección es requerida" : "",
    };
    
    setErrors(newErrors);
    
    const isValid = !newErrors.latitud && !newErrors.longitud && !newErrors.direccion;
    
    if (onValidationChange) {
      onValidationChange(isValid);
    }
    
    return isValid;
  };

  // Actualizar inputs cuando se selecciona en el mapa
  const handlePositionChange = (pos: [number, number]) => {
    setPosition(pos);
    const lat = pos[0].toFixed(6);
    const lng = pos[1].toFixed(6);
    setLatitud(lat);
    setLongitud(lng);
    validateFields(lat, lng, direccion);
  };

  // Actualizar marcador cuando se escriben las coordenadas
  const handleLatitudChange = (value: string) => {
    setLatitud(value);
    const lat = parseFloat(value);
    const lng = parseFloat(longitud);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    }
    validateFields(value, longitud, direccion);
  };

  const handleLongitudChange = (value: string) => {
    setLongitud(value);
    const lat = parseFloat(latitud);
    const lng = parseFloat(value);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    }
    validateFields(latitud, value, direccion);
  };

  const handleDireccionChange = (value: string) => {
    setDireccion(value);
    validateFields(latitud, longitud, value);
  };
  
  return (
    <div className="flex flex-col lg:flex-row items-start gap-8 py-12 w-full max-w-6xl mx-auto px-4">
      {/* Mapa - Izquierda */}
      <section className="w-full lg:w-1/2">
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-[500px]">
          <MapContainer 
            center={position || defaultPosition} 
            zoom={13} 
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={handlePositionChange} />
          </MapContainer>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Haz clic en el mapa para marcar la ubicación
        </p>
      </section>
      
      {/* Texto e Inputs - Derecha */}
      <section className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          ¿Dónde está ubicado tu escenario?
        </h1>
        
        <div className="flex flex-col gap-4">
          {/* Latitud */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitud <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={latitud}
              onChange={(e) => handleLatitudChange(e.target.value)}
              placeholder="Ej. -33.4489"
              className={`w-full px-4 py-3 text-base border ${
                errors.latitud ? 'border-red-500' : 'border-gray-200'
              } bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.latitud ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              } focus:border-transparent shadow-sm transition duration-150`}
            />
            {errors.latitud && (
              <p className="text-red-500 text-sm mt-1">{errors.latitud}</p>
            )}
          </div>

          {/* Longitud */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitud <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={longitud}
              onChange={(e) => handleLongitudChange(e.target.value)}
              placeholder="Ej. -70.6693"
              className={`w-full px-4 py-3 text-base border ${
                errors.longitud ? 'border-red-500' : 'border-gray-200'
              } bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.longitud ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              } focus:border-transparent shadow-sm transition duration-150`}
            />
            {errors.longitud && (
              <p className="text-red-500 text-sm mt-1">{errors.longitud}</p>
            )}
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => handleDireccionChange(e.target.value)}
              placeholder="Ej. Av. Principal 123, Santiago"
              className={`w-full px-4 py-3 text-base border ${
                errors.direccion ? 'border-red-500' : 'border-gray-200'
              } bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.direccion ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              } focus:border-transparent shadow-sm transition duration-150`}
            />
            {errors.direccion && (
              <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
            )}
          </div>

          {/* Mostrar coordenadas guardadas */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-1">Coordenadas guardadas:</p>
            <p className="text-xs text-blue-700">
              Lat: {escenarioData.ubicacion.latitud || 'No definida'} | 
              Lng: {escenarioData.ubicacion.longitud || 'No definida'}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Dirección: {escenarioData.ubicacion.direccion || 'No definida'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
