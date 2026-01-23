import { useState, useEffect } from 'react';

export const useAprobar = () => {

const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  setLoading(false);
  setError(null);
}, []);

const aprobarEscenario = async (escenarioId: number) => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/escenario/${escenarioId}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'Application/json'
      },
      body: JSON.stringify({estadoId: 4}),
      credentials: 'include',
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Error al aprobar el escenario');
    }
    setLoading(false);
    return true;
  }
    catch (err: any) {
    setError(err.message);
    setLoading(false);
    return false;
  }
};

const rechazarEscenario = async (escenarioId: number) => {
  setLoading(true);
  setError(null);
    try {
    const response = await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/escenario/${escenarioId}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estadoId: 5 }),
        credentials: 'include',
        });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Error al rechazar el escenario');
    }
    setLoading(false);
    return true;
  }
    catch (err: any) {
    setError(err.message);
    setLoading(false);
    return false;
  }
};


return {
  loading,
  error,
  aprobarEscenario,
  rechazarEscenario 
};




}