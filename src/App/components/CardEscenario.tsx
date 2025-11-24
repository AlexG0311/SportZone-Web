import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  type { Escenario } from '../types/escenario';
import { getImagenPrincipal } from '../types/escenario';

interface CardEscenarioProps {
  escenario: Escenario;
}

export default function CardEscenario({ escenario }: CardEscenarioProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEdit = () => {
    console.log('Editar escenario:', escenario.id);
    setIsMenuOpen(false);
    navigate(`/editar-escenario/${escenario.id}`);
  };

   const handleDelete = async () => {
     if (!window.confirm('¿Estás seguro de que deseas eliminar este escenario? Esta acción no se puede deshacer.')) {
       return;
     }
 
     setLoading(true);
     
     try {
       const response = await fetch(`https://backend-sportzone-production.up.railway.app/api/escenario/${escenario.id}`, {
         method: 'DELETE',
         credentials: 'include',
       });
 
       if (response.ok) {
         alert('✅ Escenario eliminado exitosamente');
         navigate('/mi-escenario');
       } else {
         const error = await response.json();
         alert(` Error: ${error.message || 'No se pudo eliminar el escenario todavia tienes reservas activas'}`);
       }
     } catch (error) {
       console.error('Error:', error);
       alert('❌ Error al eliminar el escenario');
     } finally {
       setLoading(false);
     }
   };

  return (
    <div className="group relative h-full bg-white overflow-hidden shadow-md transition-all duration-300">
      {/* Overlay de loading */}
      {loading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Eliminando...</p>
          </div>
        </div>
      )}

      {/* Imagen con efecto de opacidad */}
      <div className="relative h-54 w-100 overflow-hidden">
        <img
          src={getImagenPrincipal(escenario.imagenes)}
          alt={escenario.nombre}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
        />
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Título */}
        <a href={`/detalle-escenario/${escenario.id}`} className="text-xl font-bold text-gray-900 mb-2 underline hover:text-green-600 transition-colors">
          {escenario.nombre}
        </a>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {escenario.descripcion}
        </p>

        {/* Tags */}
        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-300">
            {escenario.tipo}
          </span>

          {escenario.tipo === 'Privado' && (
            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-300">
              ${escenario.precio}/hora
            </span>
          )}
        </div>

        {/* Ubicación */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{escenario.direccion}</span>
        </div>

        {/* Botón de opciones con menú deslizante */}
        <div className="flex justify-end items-center gap-2">
          {/* Botones de acción (deslizables desde la derecha) */}
          <div
            className={`flex gap-2 transition-all duration-300 ease-in-out ${
              isMenuOpen 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-full pointer-events-none'
            }`}
          >
            <button
              onClick={handleEdit}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
            
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar
            </button>
          </div>

          {/* Botón toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            disabled={loading}
            className={`p-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              isMenuOpen 
                ? 'bg-gray-200 rotate-90' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Overlay de hover (opcional) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
