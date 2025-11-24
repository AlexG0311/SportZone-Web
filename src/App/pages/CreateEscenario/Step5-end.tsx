import { MapPin, Users, DollarSign, Star } from "lucide-react"
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEscenario } from "@/App/hooks/useEscenario"

// Fix para el icono del marcador en Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Step5End() {
  const { escenarioData } = useEscenario()

  // Validar que hay datos mínimos
  const hasValidData = escenarioData.nombre && 
                       escenarioData.ubicacion.latitud && 
                       escenarioData.ubicacion.longitud &&
                       escenarioData.imagenPrincipal

  // Imagen por defecto si no hay principal
  const imagenMostrar = escenarioData.imagenPrincipal || 
                        "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800"

  if (!hasValidData) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-800 font-semibold mb-2">
            ⚠️ Información incompleta
          </p>
          <p className="text-yellow-700 text-sm">
            Por favor completa todos los pasos anteriores antes de ver el resumen.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Resumen del Escenario
        </h1>
        <p className="text-gray-500">
          Verifica que toda la información esté correcta antes de finalizar
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Grid: Imagen izquierda, Mapa derecha */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Imagen Principal */}
          <div className="relative h-64 md:h-96 bg-gray-100">
            <img
              src={imagenMostrar}
              alt={escenarioData.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-yellow-500 text-white text-sm font-semibold rounded-lg flex items-center gap-1 shadow-lg">
              <Star className="w-4 h-4 fill-white" />
              Principal
            </div>
          </div>

          {/* Mapa */}
          <div className="relative h-64 md:h-96 bg-gray-100">
            <MapContainer 
              center={[escenarioData.ubicacion.latitud, escenarioData.ubicacion.longitud]} 
              zoom={15} 
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[escenarioData.ubicacion.latitud, escenarioData.ubicacion.longitud]} />
            </MapContainer>
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-lg">
              <MapPin className="w-3 h-3" />
              Ubicación
            </div>
          </div>
        </div>

        {/* Información abajo */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Nombre y Tipo */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {escenarioData.nombre || "Sin nombre"}
              </h2>
              {escenarioData.tipo && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg whitespace-nowrap">
                  {escenarioData.tipo}
                </span>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed">
              {escenarioData.descripcion || "Sin descripción"}
            </p>
          </div>

          {/* Grid de detalles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Precio */}
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-green-700 uppercase">Precio por hora</p>
                <p className="text-lg font-bold text-green-900">
                  ${escenarioData.precio ? escenarioData.precio.toLocaleString('es-CO') : '0'}
                </p>
              </div>
            </div>

            {/* Capacidad */}
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-purple-700 uppercase">Capacidad</p>
                <p className="text-lg font-bold text-purple-900">
                  {escenarioData.capacidad || 0} personas
                </p>
              </div>
            </div>

            {/* Ubicación */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-blue-700 uppercase">Dirección</p>
                <p className="text-sm font-semibold text-blue-900 truncate">
                  {escenarioData.ubicacion.direccion || "Sin dirección"}
                </p>
              </div>
            </div>
          </div>

          {/* Imágenes adicionales */}
          {escenarioData.imagenesAdicionales && escenarioData.imagenesAdicionales.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Imágenes adicionales ({escenarioData.imagenesAdicionales.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {escenarioData.imagenesAdicionales.map((url, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={url}
                      alt={`Imagen adicional ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coordenadas */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Coordenadas: {escenarioData.ubicacion.latitud.toFixed(6)}, {escenarioData.ubicacion.longitud.toFixed(6)}
            </p>
          </div>
        </div>
      </div>

      {/* Nota final */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800 text-center">
          ✓ Toda la información parece correcta. Haz clic en <strong>Crear Escenario</strong> para finalizar.
        </p>
      </div>

      {/* Debug info (opcional - quitar en producción) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded-xl">
          <p className="text-xs font-mono text-gray-600 mb-2">Debug - Datos del Context:</p>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(escenarioData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}