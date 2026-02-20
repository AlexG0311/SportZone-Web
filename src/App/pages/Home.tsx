import Sidebard from "../components/Sidebard";
import MapView from "./MapView";
import { useState } from "react";
import type { Escenario } from "../types/escenario";
import { useEscenariosAprobados } from "../hooks/useEscenariosAprobados";
import { Filtro } from "../components/Filtro";

export default function Home() {
  const [selectedEscenario, setSelectedEscenario] = useState<Escenario | null>(
    null,
  );
  const [showMap, setShowMap] = useState(false);
  const { escenarios } = useEscenariosAprobados();
  const [isOpenFiltro, setEstateFiltro] = useState(false);

  const handleEscenarioClick = (escenario: Escenario) => {
    setSelectedEscenario(escenario);
    setShowMap(true);
  };

  const openFiltro = () => {
    setEstateFiltro(true);
  };

  const closeFiltro = () => {
    setEstateFiltro(false);
  };

  return (
    <div className="h-screen bg-gray-50 relative flex flex-col">
      <div
        className={`absolute transition-all inset-0 overflow-hidden ${isOpenFiltro ? "z-[1000] pointer-events-auto" : "z-0 pointer-events-none"} duration-300`}
      >
        <Filtro onClose={closeFiltro} isClose={isOpenFiltro} />
      </div>

      <div className="flex flex-1 overflow-hidden md:flex-row relative">
        {/* Sidebar - En móvil se oculta completamente cuando showMap es true */}
        <div
          className={`transition-all duration-500 ${
            showMap ? "hidden md:block md:w-1/2" : "w-full"
          }`}
        >
          <Sidebard
            onClick={handleEscenarioClick}
            showMap={showMap}
            isOpen={openFiltro}
          />
        </div>

        {/* Mapa - En móvil ocupa toda la pantalla con posición absoluta */}
        {showMap && (
          <div className="fixed md:relative inset-0 md:inset-auto md:w-1/2 z-50 md:z-auto">
            <div className="h-full w-full md:p-4">
              <div className="h-full w-full md:rounded-lg overflow-hidden md:shadow-lg">
                <MapView
                  escenarios={escenarios}
                  selectedEscenario={selectedEscenario}
                />
              </div>

              {/* Botón para cerrar el mapa */}
              <button
                onClick={() => setShowMap(false)}
                className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                title="Cerrar mapa"
              >
                <svg
                  className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
