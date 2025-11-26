import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import type { Escenario } from '../types/escenario';

interface MapViewProps {
  escenarios: Escenario[];
  selectedEscenario: Escenario | null;
}

// Componente auxiliar para controlar el mapa
function MapController({ selectedEscenario }: { selectedEscenario: Escenario | null }) {
  const map = useMap();
  
  useEffect(() => {
    // Invalidar el tamaño del mapa múltiples veces para asegurar renderizado correcto
    const invalidateSizes = () => {
      map.invalidateSize();
      setTimeout(() => map.invalidateSize(), 100);
      setTimeout(() => map.invalidateSize(), 300);
      setTimeout(() => map.invalidateSize(), 600); // Después de la transición de 500ms
    };

    invalidateSizes();
  }, [map]);

  useEffect(() => {
    if (selectedEscenario) {
      // Invalidar tamaño múltiples veces antes del flyTo
      map.invalidateSize();
      
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      setTimeout(() => {
        map.invalidateSize();
      }, 300);
      
      // Hacer flyTo después de que todo esté renderizado
      setTimeout(() => {
        map.invalidateSize();
        map.flyTo(
          [selectedEscenario.latitud, selectedEscenario.longitud], 
          17,
          { 
            duration: 1.5,
            animate: true
          }
        );
      }, 600); // Esperar 600ms (transición es 500ms)
    }
  }, [selectedEscenario, map]);
  
  return null;
}

export default function MapView({ escenarios, selectedEscenario }: MapViewProps) {

  // Centro por defecto (si no hay escenarios)
  const defaultCenter: [number, number] = [9.30311063, -75.38869154];
  const center = escenarios.length > 0 
    ? [escenarios[0].latitud, escenarios[0].longitud] as [number, number]
    : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={13}
      minZoom={10}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Controlador del mapa */}
      <MapController selectedEscenario={selectedEscenario} />
      
      {/* Marcadores de todos los escenarios */}
      {escenarios.map((escenario) => (
        <Marker 
          key={escenario.id} 
          position={[escenario.latitud, escenario.longitud]}
        >
          <Popup maxWidth={300} minWidth={250}>
            <div className="p-3">
              {/* Header con nombre y badge de tipo */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-800 flex-1 pr-2">
                  {escenario.nombre}
                </h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                  escenario.tipo === "Público" 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {escenario.tipo}
                </span>
              </div>

              {/* Estado del escenario */}
              <div className="mb-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full ${
                  escenario.estadoId === 3
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    escenario.estadoId === 3 ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  {escenario.estadoId === 3 ? 'Disponible' : 'Ocupado'}
                </span>
              </div>

              {/* Descripción */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {escenario.descripcion}
              </p>

              {/* Dirección */}
              <div className="flex items-start gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-gray-700">{escenario.direccion}</span>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {/* Capacidad */}
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-medium">{escenario.capacidad} personas</span>
                </div>

                {/* Precio */}
                {escenario.tipo === 'Privado' ? (
                  <div className="flex items-center gap-1.5 text-xs text-green-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold">${escenario.precio}/hora</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-green-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">Acceso Público</span>
                  </div>
                )}
              </div>

              {/* Botón de acción */}
              <button 
                onClick={() => window.open(`/detalle/${escenario.id}`, '_blank')}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Ver detalles completos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}