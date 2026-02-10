
import { useReservas } from "./useReservas";
import { useState } from "react";

export const useFiltrarReservas = () => {
  const { reservas, loading, setReservas } = useReservas();
  const [filtro, setFiltro] = useState<'todas' | 'pendientes' | 'aprobadas' | 'canceladas'>('todas');

  const reservasFiltradas = reservas.filter(reserva => {
    if (filtro === 'todas') return true;
    if (filtro === 'pendientes') return reserva.estadoId === null;
    if (filtro === 'aprobadas') return reserva.estadoId === 4;
    if (filtro === 'canceladas') return reserva.estadoId === 5;
    return true;
  });

  return {
    filtro,
    reservas,
    setFiltro,
    reservasFiltradas,
    loading,
    setReservas
  }
}

