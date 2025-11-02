import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


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

export default function Sidebard({ onClick }: { onClick: (escenario: Escenario) => void }) {
  
  const navigate = useNavigate();

  const [escenarios, setEscenarios] = useState<Escenario[]>([]);

  useEffect(() => {
      fetch('http://192.168.100.147:4000/api/escenario',
        {
          credentials: 'include',
          method: 'GET',
        }
      )
          .then(response => response.json())
          .then(data => setEscenarios(data))
          .catch(error => console.error('Error fetching escenarios:', error));    
  }, []); // Cambiar [escenarios] por [] para evitar bucle infinito

  const [busqueda, setBusqueda] = useState('');
  const escenariosFiltrados = escenarios.filter(escenario =>
    escenario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    escenario.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const detalle = (id: number) =>{
    navigate(`/detalle/${id}`)
  }

  return (
    <div className="w-80 bg-white shadow-lg h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Escenarios</h2>
        
        {/* Barra de búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar escenarios..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Lista de escenarios */}
      <div className="flex-1 overflow-y-auto p-4">
        {escenariosFiltrados.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No se encontraron escenarios</p>
          </div>
        ) : (
          <div className="space-y-2">
            {escenariosFiltrados.map((escenario) => (
              <div
                onClick={() => onClick(escenario)}
                key={escenario.id}
                className="p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex mb-2">
                  <img src={escenario.imagenUrl} alt={escenario.nombre} className="w-full h-32 object-cover rounded-md" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                      {escenario.nombre}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        escenario.estadoId === 1
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {escenario.estadoId === 1 ? 'Disponible' : 'Ocupado'}
                    </span>
                  </div>
                  <div className='flex text-center  text-sm text-white  '>
                  <p className={`text-sm w-20 h-5 rounded-md ${
                    escenario.tipo === "Público" ? 'bg-green-700' : 'bg-orange-700'
                  }`}>{escenario.tipo}</p>
                  </div>
                    
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {escenario.descripcion}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {escenario.direccion}
                  </div>
                  
               {escenario.tipo ==='Privado' &&  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-lg font-bold text-green-600">
                      ${escenario.precio}
                    </span>
                 
                  </div>


                }
                   <button onClick={() => detalle(escenario.id)} className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors">
                      Ver Detalles
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer con contador */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600 text-center">
          {escenariosFiltrados.length} de {escenarios.length} escenarios
        </p>
      </div>
    </div>
  );
}