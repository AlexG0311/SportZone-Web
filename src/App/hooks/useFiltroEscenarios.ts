import { useEscenariosAprobados } from "./useEscenariosAprobados";
import { useState } from "react";
export const useFiltroEscenario = () => {
 const [busqueda, setBusqueda] = useState('');
 const {escenarios, loading} = useEscenariosAprobados();

 const escenariosFiltrados = escenarios.filter(escenario =>
    escenario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    escenario.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );
return {escenariosFiltrados, busqueda, setBusqueda, loading}
}