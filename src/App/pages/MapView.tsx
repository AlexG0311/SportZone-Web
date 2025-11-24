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
    if (selectedEscenario) {
      map.flyTo(
        [selectedEscenario.latitud, selectedEscenario.longitud], 
        17, // nivel de zoom
        { duration: 1.5 } // duración de la animación en segundos
      );
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
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg mb-1">{escenario.nombre}</h3>
              <p className="text-sm text-gray-600 mb-2">{escenario.tipo}</p>
              <p className="text-sm mb-2">{escenario.descripcion}</p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Dirección:</strong> {escenario.direccion}
              </p>
              <p className="text-lg font-bold text-green-600">
                ${escenario.precio}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}