import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Escenario, Imagen } from "../types/escenario";

// Componente Carousel
function ImageCarousel({ imagenes }: { imagenes: Imagen[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imagenes.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imagenes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
        <p className="text-gray-500">Sin imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Imagen principal con controles */}
      <div className="relative group bg-black rounded-2xl overflow-hidden">
        {/* Imagen */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={imagenes[currentIndex].url}
            alt={imagenes[currentIndex].descripcion}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>

        {/* Botón Anterior */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        {/* Botón Siguiente */}
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>

        {/* Contador de imágenes */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
          {currentIndex + 1} / {imagenes.length}
        </div>
      </div>

      {/* Miniaturas */}
      <div className="grid grid-cols-5 gap-2">
        {imagenes.map((imagen, index) => (
          <button
            key={imagen.id}
            onClick={() => goToSlide(index)}
            className={`relative rounded-lg overflow-hidden transition-all ${
              index === currentIndex
                ? 'ring-4 ring-green-500 ring-offset-2'
                : 'ring-2 ring-gray-200 hover:ring-gray-400'
            }`}
          >
            <img
              src={imagen.url}
              alt={imagen.descripcion}
              className="w-full h-20 object-cover"
            />
            {index === currentIndex && (
              <div className="absolute inset-0 bg-green-500/20" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Detalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [escenario, setEscenario] = useState<Escenario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://backend-sportzone-production.up.railway.app/api/escenario/${id}`)
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
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!escenario) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-600">Escenario no encontrado</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Volver
        </button>
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
          <div>
            <ImageCarousel imagenes={escenario.imagenes} />
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
                      : escenario.estadoId === 3
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {escenario.estado.nombre}
                </span>
              </div>
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-lg ${
                escenario.tipo === 'Público' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {escenario.tipo}
              </span>
            </div>

            {/* Precio y Capacidad */}
            <div className="grid grid-cols-2 gap-4">
              {escenario.tipo === 'Privado' && (
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm font-medium text-green-700 uppercase mb-1">Precio/hora</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${parseFloat(escenario.precio).toLocaleString('es-CO')}
                  </p>
                </div>
              )}
              
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-sm font-medium text-purple-700 uppercase mb-1">Capacidad</p>
                <p className="text-2xl font-bold text-purple-900">
                  {escenario.capacidad} personas
                </p>
              </div>
            </div>

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

            {/* Encargado */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Encargado</p>
              <p className="font-semibold text-gray-900">{escenario.encargado.nombre}</p>
              <p className="text-sm text-gray-600">{escenario.encargado.email}</p>
            </div>

            {/* Botones de acción */}
            <div className="pt-6 space-y-3">
              {escenario.tipo === 'Privado' && (
                <button
                  onClick={() => {navigate(`/reservar/${escenario.id}`)}}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                 
                >
                 Reservar Ahora
                </button>
              )}
              
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