import { Escenario } from "./escenario";
import { Usuario } from "./usuario";
import { Estado } from "./escenario";

export interface Reserva {
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

export interface ReservaCrearDTO {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  escenarioId: number;
  usuarioId: number;
  estadoId: number;
}
