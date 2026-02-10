import { useState, useEffect } from 'react';
import type { Escenario } from '../types/escenario';

export function useEscenariosAprobados() {
  const [loading, setLoading] = useState(true);
  const [escenarios, setEscenarios] = useState<Escenario[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/escenario`, {
      credentials: 'include',
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {

        const escenariosAprobados = data.filter((escenarios: Escenario) => 
        escenarios.estadoId === 4);

        setEscenarios(escenariosAprobados);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching escenarios:', error);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    escenarios,
  };
}