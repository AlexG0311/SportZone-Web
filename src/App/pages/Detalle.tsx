import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Escenario {
  id: number;
  nombre: string;
  tipo: string;
  estadoId: number;
  imagenUrl: string;
  descripcion: string;
  precio: number;
  direccion: string;
  latitud: number;
  longitud: number;
}

export default function Detalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [escenario, setEscenario] = useState<Escenario | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch(`http://192.168.100.147:4000/api/escenario/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEscenario(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching escenario:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!escenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Escenario no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botón de volver */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sección de imágenes - Izquierda */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={escenario.imagenUrl}
                alt={escenario.nombre}
                className="w-full h-[400px] object-cover"
              />
            </div>

            {/* Galería de miniaturas (puedes agregar más imágenes si las tienes) */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4,5].map((i) => (
                <div key={i} className="rounded-lg overflow-hidden shadow">
                  <img
                    src={escenario.imagenUrl}
                    alt={`Vista ${i}`}
                    className="w-full h-20 object-cover cursor-pointer hover:opacity-75 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Información del escenario - Derecha */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {/* Título y estado */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {escenario.nombre}
                </h1>
                <span
                  className={`px-4 py-2 text-sm font-semibold rounded-full ${
                    escenario.estadoId === 1
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {escenario.estadoId === 1 ? 'Disponible' : 'Ocupado'}
                </span>
              </div>
              <p className="text-lg text-gray-600">{escenario.tipo}</p>
            </div>
          {escenario.tipo === 'Privado' && (
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-baseline justify-between">
                <span className="text-gray-600 text-lg">Precio:</span>
                <span className="text-4xl font-bold text-green-600">
                  ${escenario.precio}
                </span>
              </div>
            </div>
            )}
            

            {/* Descripción */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Descripción
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {escenario.descripcion}
              </p>
            </div>

            {/* Dirección */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ubicación
              </h3>
              <div className="flex items-start text-gray-600">
                <svg className="w-5 h-5 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{escenario.direccion}</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="pt-6 space-y-3">
           {escenario.tipo === 'Privado' && (
              <button
                onClick={() => {navigate(`/reservar/${escenario.id}`)}}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                disabled={escenario.estadoId !== 1}
              >
                {escenario.estadoId === 1 ? 'Reservar Ahora' : 'No Disponible'}
              </button> )}
              
              <div className="flex gap-3">
                <button className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Favorito
                </button>
                <button className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}