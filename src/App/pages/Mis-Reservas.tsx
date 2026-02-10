import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Calendar, Clock, MapPin, DollarSign} from 'lucide-react';
import { getEstadoBadge } from '../utils/getEstadoBadge';
import { formatHora } from '../utils/formatHora';
import { formatFecha } from '../utils/formatFecha';
import { useFiltrarReservas } from '../hooks/useFiltrarReservas';
import { handleCancelarReserva } from '../hooks/useCancelarReserva';

export default function MisReservas() {

  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { filtro,reservas,setFiltro,reservasFiltradas,loading} = useFiltrarReservas(); 

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }

  }, [usuario, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
            <p className="text-gray-600">Gestiona todas tus reservas de escenarios deportivos</p>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltro('todas')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtro === 'todas'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Todas ({reservas.length})
              </button>
              <button
                onClick={() => setFiltro('pendientes')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtro === 'pendientes'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Pendientes ({reservas.filter(r => r.estadoId === null).length})
              </button>
              <button
                onClick={() => setFiltro('aprobadas')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtro === 'aprobadas'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Aprobadas ({reservas.filter(r => r.estadoId === 4).length})
              </button>
              <button
                onClick={() => setFiltro('canceladas')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtro === 'canceladas'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Canceladas ({reservas.filter(r => r.estadoId === 5).length})
              </button>
            </div>
          </div>

          {/* Lista de Reservas */}
          {reservasFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay reservas</h3>
              <p className="text-gray-600 mb-6">
                {filtro === 'todas'
                  ? 'Aún no has realizado ninguna reserva'
                  : `No tienes reservas ${filtro}`
                }
              </p>
              <button
                onClick={() => navigate('/Home')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Explorar Escenarios
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reservasFiltradas.map((reserva) => {
                const estado = getEstadoBadge(reserva.estadoId, reserva.estado?.nombre || null);
                const imagenUrl = reserva.escenario.imagenes[0]?.url || 'https://via.placeholder.com/400x300';

                return (
                  <div
                    key={reserva.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                      {/* Imagen del escenario */}
                      <div className="md:col-span-1">
                        <img
                          src={imagenUrl}
                          alt={reserva.escenario.nombre}
                          className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => navigate(`/detalle/${reserva.escenarioId}`)}
                        />
                      </div>

                      {/* Información de la reserva */}
                      <div className="md:col-span-2 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3
                              className="text-xl font-bold text-gray-900 hover:text-green-600 cursor-pointer transition-colors"
                              onClick={() => navigate(`/detalle/${reserva.escenarioId}`)}
                            >
                              {reserva.escenario.nombre}
                            </h3>
                            <p className="text-sm text-gray-500">Reserva #{reserva.id}</p>
                          </div>
                          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${estado.color}`}>
                            {estado.icon}
                            {estado.nombre}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-5 h-5 mr-2 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Fecha</p>
                              <p className="font-medium">{formatFecha(reserva.fecha)}</p>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <Clock className="w-5 h-5 mr-2 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Horario</p>
                              <p className="font-medium">
                                {formatHora(reserva.horaInicio)} - {formatHora(reserva.horaFin)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-2 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Ubicación</p>
                              <p className="font-medium truncate">{reserva.escenario.direccion}</p>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Precio</p>
                              <p className="font-medium">
                                ${parseFloat(reserva.escenario.precio).toLocaleString('es-CO')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="md:col-span-1 flex flex-col gap-2 justify-center">
                        <button
                          onClick={() => navigate(`/detalle/${reserva.escenarioId}`)}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Ver Escenario
                        </button>

                        {(reserva.estadoId === null || reserva.estadoId === 4) && (
                          <button
                            onClick={() => handleCancelarReserva(reserva.id)}
                            className="w-full px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                          >
                            Cancelar Reserva
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}