// Componentes de contenido para cada sección

import { useEscenarios } from "./hooks/useEscenarios";
import { useAprobar } from "./hooks/useAprobar";

export const RevisionEscenarios = () => {
const { escenarios } = useEscenarios();
const {aprobarEscenario, rechazarEscenario} = useAprobar();


return (
 
<div className="space-y-6">
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Solicitudes Pendientes</h3>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
          {escenarios.length} pendientes
        </span>
      </div>

      {escenarios.length === 0 ? (
        <p className="text-gray-600 text-center p-4 rounded-lg">
          No hay escenarios pendientes de revisión en este momento.
        </p>
      ) : (
        <div className="space-y-4">
          {escenarios.map(escenario => (
            <div key={escenario.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <h4 className="text-md font-semibold text-gray-700 mb-2">{escenario.nombre}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                <p className="text-sm text-gray-600">Tipo: {escenario.tipo}</p>
                <p className="text-sm text-gray-600">Capacidad: {escenario.capacidad}</p>
                <p className="text-sm text-gray-600">Precio: ${escenario.precio}</p>
                <p className="text-sm text-gray-600">Encargado: {escenario.encargado.nombre}</p>
                <p className="text-sm text-gray-600 col-span-full">Email: {escenario.encargado.email}</p>
                <p className="text-sm text-gray-600 col-span-full">Ubicación: {escenario.direccion}</p>
              </div>
              <div className="flex space-x-2 pt-2 border-t border-gray-100">
                <button onClick={() => aprobarEscenario(escenario.id)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Aprobar
                </button>
                <button onClick={() => rechazarEscenario(escenario.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  );
}
