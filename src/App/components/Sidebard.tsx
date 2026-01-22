
import { useNavigate } from 'react-router-dom';
import type { Escenario, Imagen } from '../types/escenario';
import ImagenDefault from '../pages/image/ImagenDefault.png';
import { useFiltroEscenario } from '../hooks/useFiltroEscenario';

interface SidebardProps {
  onClick: (escenario: Escenario) => void;
  showMap?: boolean;
}
export default function Sidebard({ onClick, showMap = false }: SidebardProps) {
const navigate = useNavigate();
 const { loading, escenarios, escenariosFiltrados, busqueda, setBusqueda } = useFiltroEscenario();

  const detalle = (id: number) => {
    navigate(`/detalle/${id}`)  
  }

  const getImagenPrincipal = (imagenes: Imagen[]): string => {
    if (imagenes.length > 0) {
      return imagenes[0].url;
    }
    return ImagenDefault; 
  } 
  return (
    <div className="w-full bg-white h-screen flex flex-col">
      {/* Header compacto y responsive */}
      <div className="p-3 md:p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          {/* Título */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Escenarios
          </h2>
          
          {/* Barra de búsqueda */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm md:text-base"
            />
            <svg className="absolute left-3 top-2.5 md:top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Badge de disponibles */}
          <span className="text-xs md:text-sm text-gray-600 bg-green-100 px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-semibold whitespace-nowrap self-start md:self-auto">
            {escenariosFiltrados.length} disponibles
          </span>
        </div>
      </div>

      {/* Grid de escenarios - Responsive */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4">
        {loading ? (
          <div className={`grid gap-3 md:gap-4 ${
            showMap 
              ? 'grid-cols-1 sm:grid-cols-2' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-xl animate-pulse">
                <div className="bg-gray-300 h-40 md:h-48 rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-300 h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : escenariosFiltrados.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 md:mt-20">
            <svg className="w-16 h-16 md:w-24 md:h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg md:text-xl font-medium">No se encontraron escenarios</p>
            <p className="text-xs md:text-sm text-gray-400 mt-2">Intenta con otra búsqueda</p>
          </div>
        ) : (
          <div className={`grid gap-3 md:gap-4 transition-all duration-500 ${
            showMap 
              ? 'grid-cols-1 sm:grid-cols-2' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {escenariosFiltrados.map((escenario) => (
              <div
                onClick={() => onClick(escenario)}
                key={escenario.id}
                className="bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
              >
                {/* Imagen */}
                <div className="relative h-40 md:h-48 overflow-hidden">
                  <img 
                    src={getImagenPrincipal(escenario.imagenes)} 
                    alt={escenario.nombre} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
            
                  <div className="absolute top-2 md:top-3 left-2 md:left-3">
                    <span className={`px-2 md:px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${
                      escenario.tipo === "Público" ? 'bg-green-700 text-white' : 'bg-orange-600 text-white'
                    }`}>
                      {escenario.tipo}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-3 md:p-4 space-y-2">
                  <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors text-base md:text-lg truncate">
                    {escenario.nombre}
                  </h3>
                  
                  <p className="text-xs md:text-sm text-gray-600 line-clamp-2 min-h-[32px] md:min-h-[40px]">
                    {escenario.descripcion}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 pt-1">
                    <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{escenario.direccion}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-gray-100">
                    {escenario.tipo === 'Privado' && (
                      <span className="text-lg md:text-xl font-bold text-green-600">
                        ${escenario.precio}
                        <span className="text-xs md:text-sm text-gray-500 font-normal">/hora</span>
                      </span>
                    )}
                    {escenario.tipo === 'Público' && (
                      <span className="text-xs md:text-sm font-semibold text-green-600">
                        Acceso Público
                      </span>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        detalle(escenario.id);
                      }}
                      className="text-xs bg-green-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer compacto */}
      <div className="p-2 md:p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs md:text-sm">
          <span className="text-gray-600">
            <span className="font-semibold">{escenariosFiltrados.length}</span> de <span className="font-semibold">{escenarios.length}</span>
          </span>
          <span className="text-gray-400">
            {loading ? '⏳' : '✓'}
          </span>
        </div>
      </div>
    </div>
  );
}