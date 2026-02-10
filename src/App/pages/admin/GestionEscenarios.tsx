
import {useFiltroEscenario}  from "@/App/hooks/useFiltroEscenarios";
import {Navbar} from "./components/Navbar";

const GestionEscenarios = () => {
const {escenariosFiltrados, loading, busqueda, setBusqueda} = useFiltroEscenario();

  return(
  <div className="space-y-0">
    <Navbar 
    text ={ busqueda}
    setText = {setBusqueda}
    />
    <div className="bg-white max-w-full p-6  border border-gray-200 overflow-x-auto">
      
        <table className="w-full table-auto border-separate border-spacing-2">
         <caption className="font-bold text-xl mb-4">Informacion de los escenarios</caption>
         <thead>
          <tr className="border">
            <th className="text-left p-2">Nombre</th>
            <th className="text-left p-2">Encargado</th>
            <th className="text-left p-2">Direccion</th>
            <th className="text-left p-2">Precio</th>
            <th className="text-left p-2">Descripcion</th>
            <th className="text-left p-2">Capacidad</th>
            <th className="text-left p-2">Estado</th>
          </tr>
          </thead>
          <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center p-4">Cargando escenarios...</td>
            </tr>
          ) : escenariosFiltrados?.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4">No hay escenarios disponibles</td>
            </tr>
          ) : (
            escenariosFiltrados?.map((item) => (
              <tr key={item.id} className="text-center hover:bg-gray-50">
                <td className="p-2">{item.nombre}</td>
                <td className="p-2">{item.encargado?.nombre || 'N/A'}</td>           
                <td className="p-2">{item.direccion}</td>       
                <td className="p-2">{item.precio}</td>        
                <td className="p-2">{item.descripcion}</td>
                <td className="p-2">{item.capacidad}</td>
                <td className="p-2">{item.estado?.nombre || 'N/A'}</td>
              </tr>
            ))
          )}
          </tbody>
        </table>
       </div>
    </div>
)};

export default GestionEscenarios;