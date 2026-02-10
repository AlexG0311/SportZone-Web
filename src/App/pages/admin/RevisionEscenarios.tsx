// Componentes de contenido para cada sección
import { useEscenarios } from "./hooks/useEscenarios";
import { useAprobar } from "./hooks/useAprobar";
import { ModalRevision } from "./components/ModalRevision";
import { useState } from "react";

type ModalState = {
  isOpen: boolean;
  type: 'aprobar' | 'rechazar' | null;
  escenarioId: number | null;
};

type Confirmed = {
  isConfirme: boolean
}

export const RevisionEscenarios = () => {

const { escenarios, refetch } = useEscenarios();
const [confirmed, setConfirmed] = useState<Confirmed>(
  {isConfirme: false}
)

const {aprobarEscenario, rechazarEscenario, loading} = useAprobar();

const [modalState, setModalState] = useState<ModalState>({
  /*Parametros iniciales para el modal */
  isOpen: false,
  type: null,
  escenarioId: null,
});

const handleOpenModal = (type: 'aprobar' | 'rechazar', escenarioId: number) => {
  setModalState({
    isOpen: true,
    type,
    escenarioId,
  });
};

const handleCloseModal = () => {
  setModalState({                     
    isOpen: false,
    type: null,
    escenarioId: null,

  });
};

const handleConfirm = async () => {
  if (!modalState.escenarioId || !modalState.type) return;
  
  if (modalState.type === 'aprobar') {
    await aprobarEscenario(modalState.escenarioId);
    setConfirmed({
      isConfirme:true
    })
   

  } else {
    await rechazarEscenario(modalState.escenarioId);
    console.log("Escenario rechazado correctamente!!")
    setConfirmed({ 
      isConfirme:true
    })
  }
  
  // Recargar la lista de escenarios
  await refetch();
  
  handleCloseModal();
};

return ( 
<div className="space-y-6">
    <div className="bg-white rounded-md p-6 shadow-sm border border-gray-200">
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
                <button 
                  disabled={loading} 
                  onClick={() => handleOpenModal('aprobar', escenario.id)} 
                  className="px-4 cursor-pointer py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  Aprobar
                </button>
                <button 
                  disabled={loading} 
                  onClick={() => handleOpenModal('rechazar', escenario.id)} 
                  className="px-4 cursor-pointer py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className={`fixed bg-green-600 text-white flex rounded-xl items-center justify-center text-black h-10 w-70 right-5 bottom-5  transition-all duration-300 
       ${ confirmed.isConfirme
       ? 'translate-x-0 opacity-100'
       : 'translate-x-full opacity-0'}`} >
      Se ha { modalState.type === 'aprobar' ? 
      "aprobado correctamente!":
      "rechazado correctamente!" 
      }
    </div>

    <ModalRevision
      isOpen={modalState.isOpen}
      onClose={handleCloseModal}
      onConfirm={handleConfirm}
      title={modalState.type === 'aprobar' ? '¿Aprobar Escenario?' : '¿Rechazar Escenario?'}
      message={`¿Estás seguro que deseas ${modalState.type === 'aprobar' ? 'aprobar' : 'rechazar'} el escenario"?`}
      confirmText={modalState.type === 'aprobar' ? 'Sí, Aprobar' : 'Sí, Rechazar'}
      confirmColor={modalState.type === 'aprobar' ? 'green' : 'red'}
      loading={loading}
    />


    
  </div>



  );
}

export default RevisionEscenarios;
