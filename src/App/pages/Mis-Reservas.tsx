import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NavBar from '../components/NavBar';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Imagen {
  url: string;
}

interface Escenario {
  id: number;
  nombre: string;
  tipo: string;
  direccion: string;
  precio: string;
  imagenes: Imagen[];
}

interface Estado {
  id: number;
  nombre: string;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

interface Reserva {
  id: number;
  usuarioId: number;
  escenarioId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estadoId: number | null;
  escenario: Escenario;
  estado: Estado | null;
  usuario: Usuario;
}

export default function MisReservas() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todas' | 'pendientes' | 'aprobadas' | 'canceladas'>('todas');

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    const fetchReservas = async () => {
      try {
        const response = await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/reserva/usuario/${usuario.id}`, {
          credentials: 'include'               
        });

        if (!response.ok) throw new Error('Error al cargar reservas');

        const data = await response.json();
        setReservas(data);
      } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar las reservas');
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [usuario, navigate]);

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatHora = (hora: string) => {
    return new Date(hora).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estadoId: number | null, estadoNombre: string | null) => {
    if (estadoId === null || estadoNombre === null) {
      return {
        color: 'bg-gray-100 text-gray-700',
        icon: <AlertCircle className="w-4 h-4" />,
        nombre: 'Pendiente'
      };
    }

    switch (estadoId) {
      case 4: // Aprobada
        return {
          color: 'bg-green-100 text-green-700',
          icon: <CheckCircle className="w-4 h-4" />,
          nombre: estadoNombre
        };
      case 5: // Cancelada
        return {
          color: 'bg-red-100 text-red-700',
          icon: <XCircle className="w-4 h-4" />,
          nombre: estadoNombre
        };
      default:
        return {
          color: 'bg-yellow-100 text-yellow-700',
          icon: <AlertCircle className="w-4 h-4" />,
          nombre: estadoNombre
        };
    }
  };

  const reservasFiltradas = reservas.filter(reserva => {
    if (filtro === 'todas') return true;
    if (filtro === 'pendientes') return reserva.estadoId === null;
    if (filtro === 'aprobadas') return reserva.estadoId === 4;
    if (filtro === 'canceladas') return reserva.estadoId === 5;
    return true;
  });

  const handleCancelarReserva = async (reservaId: number) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;

    try {
      const response = await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/reserva/${reservaId}/cancelar`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Error al cancelar');

      // Actualizar estado local
      setReservas(reservas.map(r => 
        r.id === reservaId 
          ? { ...r, estadoId: 5, estado: { id: 5, nombre: 'Cancelada' } }
          : r
      ));

      alert('Reserva cancelada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cancelar la reserva');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
            <p className="text-gray-600">Gestiona todas tus reservas de escenarios deportivos</p>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltro('todas')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtro === 'todas'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas ({reservas.length})
              </button>
              <button
                onClick={() => setFiltro('pendientes')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtro === 'pendientes'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pendientes ({reservas.filter(r => r.estadoId === null).length})
              </button>
              <button
                onClick={() => setFiltro('aprobadas')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtro === 'aprobadas'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Aprobadas ({reservas.filter(r => r.estadoId === 4).length})
              </button>
              <button
                onClick={() => setFiltro('canceladas')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtro === 'canceladas'
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