import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetEscenarioById } from '../hooks/useGetEscenarioById';
import { calcularHoras } from '../utils/calcularHoras';
import { useHandleReserva } from '../hooks/useHandleReserva';

export default function Reservar() {
  
  const {handleReservar} = useHandleReserva();
  const navigate = useNavigate();
  const { id } = useParams();
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const {escenario, loading} = useGetEscenarioById(id);
 
  // Precio por hora del escenario
  const precioPorHora = Number(escenario?.precio || 0);
  const horasTotales = calcularHoras({horaInicio,horaFin});
  const precioTotal = horasTotales * precioPorHora;


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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Reserva</h1>
          <p className="text-gray-600 mt-2">
            Reservando: <span className="font-semibold">{escenario.nombre}</span>
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-gray-100 rounded-2xl shadow-sm p-8 space-y-6">
          
          {/* Fecha */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 bg-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-700"
            />
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hora de inicio
              </label>
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hora de finalización
              </label>
              <input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-700"
              />
            </div>
          </div>

          {/* Resumen de costos */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Resumen</h3>
            
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between items-center">
                <span>Precio por hora:</span>
                <span className="font-medium">${precioPorHora.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Duración:</span>
                <span className="font-medium">
                  {horasTotales > 0 ? `${horasTotales.toFixed(1)} horas` : '-'}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center text-xl">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-bold text-green-600">
                    ${precioTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de reservar */}
          <button
            onClick={() => handleReservar({ id, fechaSeleccionada, horaInicio, horaFin, horasTotales, precioTotal, escenario })}
            disabled={!fechaSeleccionada || !horaInicio || !horaFin || horasTotales <= 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            Confirmar Reserva
          </button>
          
          {/* Mensaje de validación */}
          {horaInicio && horaFin && horasTotales <= 0 && (
            <p className="text-sm text-red-600 text-center">
              La hora de finalización debe ser posterior a la hora de inicio
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
