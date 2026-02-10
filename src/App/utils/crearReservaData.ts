import type { ReservaCrearDTO } from '../types/reserva';

export const crearReservaData = ({
  fecha,
  horaInicio,
  horaFin,
  escenarioId,
  usuarioId
}: {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  escenarioId: string;
  usuarioId: number;
}): ReservaCrearDTO => {
  return {
    fecha,
    horaInicio,
    horaFin,
    escenarioId: parseInt(escenarioId),
    usuarioId,
    estadoId: 4
  };
};
