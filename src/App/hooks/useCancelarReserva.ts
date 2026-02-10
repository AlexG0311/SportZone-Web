import { useFiltrarReservas } from "./useFiltrarReservas";


export const handleCancelarReserva = async (reservaId: number) => {

    const { setReservas, reservas } = useFiltrarReservas();

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