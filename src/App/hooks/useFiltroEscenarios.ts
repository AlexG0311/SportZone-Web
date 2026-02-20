import { useEscenariosAprobados } from "./useEscenariosAprobados";
import { useState } from "react";
export const useFiltroEscenario = () => {
  const [busqueda, setBusqueda] = useState("");
  const { escenarios} = useEscenariosAprobados();
  const [priceMin, setPrice] = useState(0);
  const [tipo, setTipo] = useState("");
  const [capacity, setCapacity] = useState(0);

  const escenariosFiltrados = escenarios.filter((escenario) => {
      // Filtro de búsqueda por nombre o tipo
      const coincideBusqueda = busqueda === "" ||
        escenario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        escenario.tipo.toLowerCase().includes(busqueda.toLowerCase());

      // Filtro de precio mínimo
      const cumplePrecio = Number(escenario.precio) >= Number(priceMin);

      // Filtro de tipo (solo si se seleccionó uno)
      const cumpleTipo = tipo === "" || escenario.tipo === tipo;

      // Filtro de capacidad mínima
      const cumpleCapacidad = Number(escenario.capacidad) >= Number(capacity);

      // Todos los filtros deben cumplirse
      return coincideBusqueda && cumplePrecio && cumpleTipo && cumpleCapacidad;
  });

  console.log(escenariosFiltrados);

  return { escenariosFiltrados, busqueda, setBusqueda, setPrice, setTipo, tipo, setCapacity, capacity};
};
