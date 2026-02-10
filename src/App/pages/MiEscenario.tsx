import { useNavigate } from "react-router-dom"
import CardEscenario from "../components/CardEscenario";
import { useGetEscenarioUser } from "../hooks/useGetEscenarioUser";
export default function MiEscenario() {

const {loading, escenarios} = useGetEscenarioUser();
const navigate = useNavigate();

  if(loading){
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mb-4 mx-auto"></div>
          <h2 className="text-xl font-semibold">Cargando tus escenarios...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full bg-gray-50 flex flex-col">
        <div className="flex  mx-auto  w-full  justify-between items-center px-30 py-4">
          <h1 className="font-bold text-3xl">Mis Escenarios</h1>
          <button
            onClick={() => navigate('/crear-escenario')}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear Escenario
          </button>
        </div>

      {/* Content area */}
      <div className="flex-1 flex  justify-center p-6">
      
        <div className="text-center space-y-8">
         
          {/* Título */}
        {escenarios.length === 0 ? (
          
          <div>
             {/* Icono decorativo */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Mis Escenarios
            </h1>
            <p className="text-gray-600 text-lg">
              Todavía no has creado ningún escenario
            </p>
             {/* Botón de crear */}
          <button
            onClick={() => navigate('/crear-escenario')}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear mi primer escenario
          </button>
          </div>):(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {escenarios.map((escenario) => (
                <CardEscenario key={escenario.id} escenario={escenario} />
              ))}
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
