export const ReservarEscenario = async (data: {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  escenarioId: number;
  usuarioId: number;
}) => {
  try {
    const response = await fetch('http://192.168.100.147:4000/api/reserva', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data: result,
      error: !response.ok ? (result.error || result.message || 'Error al realizar la reserva') : null
    };

  } catch (error) {
    console.error('Error en ReservarEscenario:', error);
    return {
      ok: false,
      status: 500,
      data: null,
      error: 'Error de red al realizar la reserva'
    };
  }
};