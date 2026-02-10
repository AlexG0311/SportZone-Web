import { useNavigate } from 'react-router-dom';
import { ReservarEscenario } from '../services/ReservarEscenario';
import { useAuth } from './useAuth';
import { crearReservaData } from '../utils/crearReservaData';
import type { Escenario } from '../types/escenario';

export const useHandleReserva = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const handleReservar = async ({
    id,
    fechaSeleccionada,
    horaInicio,
    horaFin,
    horasTotales,
    precioTotal,
    escenario
  }: {
    id: string | undefined;
    fechaSeleccionada: string;
    horaInicio: string;
    horaFin: string;
    horasTotales: number;
    precioTotal: number;
    escenario: Escenario | null;
  }) => {

    try {
      if (id === undefined) {
        alert('Error: ID del escenario no definido');
        return;
      }

      if (!usuario) {
        alert('Error: Usuario no autenticado');
        navigate('/auth/login');
        return;
      }

      // Validar duración mínima (por ejemplo, 30 minutos)
      if (horasTotales < 0.5) {
        alert('La duración mínima de la reserva es de 30 minutos.');
        return;
      }

      const reservaData = crearReservaData({
        fecha: fechaSeleccionada,
        horaInicio,
        horaFin,
        escenarioId: id,
        usuarioId: usuario.id
      });

      const res = await ReservarEscenario(reservaData);

      if (res.ok) {
        alert(
          `¡Reserva exitosa!\n\n` +
          `Detalles de la reserva:\n` +
          `Escenario: ${escenario?.nombre}\n` +
          `Fecha: ${fechaSeleccionada}\n` +
          `Hora de inicio: ${horaInicio}\n` +
          `Hora de fin: ${horaFin}\n` +
          `Total a pagar: $${precioTotal.toLocaleString()}`
        );
        navigate('/mis-reservas');
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (error) {
      console.error('Error al realizar la reserva:', error);
      alert('Error al realizar la reserva. Por favor, intenta de nuevo.');
    }
  };

  return { handleReservar };
};
