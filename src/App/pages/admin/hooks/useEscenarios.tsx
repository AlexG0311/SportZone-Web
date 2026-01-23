import { useState, useEffect, useCallback } from 'react';
import type { Escenario } from '../../../types/escenario';

export function useEscenarios() {
  const [loading, setLoading] = useState(true);
  const [escenarios, setEscenarios] = useState<Escenario[]>([]);
  const [busqueda, setBusqueda] = useState('');

  const fetchEscenarios = useCallback(() => {
    setLoading(true);
    fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/escenario`, {
      credentials: 'include',
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {

        const escenariosPendientes = data.filter((escenarios: Escenario) => 
        escenarios.estadoId === 3);

        setEscenarios(escenariosPendientes);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching escenarios:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchEscenarios();
  }, [fetchEscenarios]);

  const escenariosFiltrados = escenarios.filter(escenario =>
    escenario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    escenario.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return {
    loading,
    escenarios,
    escenariosFiltrados,
    busqueda,
    setBusqueda,
    refetch: fetchEscenarios
  };
}