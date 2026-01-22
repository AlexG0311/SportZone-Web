import { useState, useEffect } from 'react';
import type { Escenario } from '../types/escenario';

export function useFiltroEscenario() {
  const [loading, setLoading] = useState(true);
  const [escenarios, setEscenarios] = useState<Escenario[]>([]);
  const [busqueda, setBusqueda] = useState('');

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

  const escenariosFiltrados = escenarios.filter(escenario =>
    escenario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    escenario.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return {
    loading,
    escenarios,
    escenariosFiltrados,
    busqueda,
    setBusqueda
  };
}