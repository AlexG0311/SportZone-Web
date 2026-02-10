import { useFiltroUsuario } from "@/App/hooks/useFiltroUsuario.ts";

const GestionUsuarios = () => {
const {usuariosFiltrados, buscar, setBuscar} = useFiltroUsuario();

return(
  <div className="space-y-6">
    
<div className="flex gap-5 rounded-md mb-5  border border-gray-200 bg-white items-center w-auto h-15 p-5">
    <input 
    value={buscar}
    onChange={e => setBuscar(e.target.value)}
    name="buscador" 
    className="border-2 border-gray-300 w-full h-10 focus:outline-none focus:border-green-500 px-3 py-2 rounded" 
    type="text" placeholder="Buscar usuario..." />
    </div>
    <div className="bg-white rounded-md p-6 shadow-sm border border-gray-200">
      <table className="w-250 table-auto border-separate ">
         <caption className="font-bold text-xl">Informacion de los usuarios</caption>
         <thead>
          <tr className="border">
            <th>Nombre</th>
            <th>Correo</th>
            <th>Telefono</th>
       
            <th>Opciones</th>
          </tr>
          </thead>
        {usuariosFiltrados.map((items) => (  
          <tbody className="">
          <tr className="text-center">
            <td>{items.nombre}</td>
            <td>{items.email}</td>
            <td>{items.telefono}</td>
     
            <td>Opciones</td>
          </tr>
          </tbody>))}
        </table>
    </div>
  </div>
)}

export default GestionUsuarios;