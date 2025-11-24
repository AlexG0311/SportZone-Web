import NavBar from '../components/NavBar';
import Sidebard from '../components/Sidebard';
import MapView from './MapView';
import { useEffect, useState } from 'react';
import type { Escenario } from '../types/escenario';

export default function Home() {

const [escenarios, setEscenarios] = useState<Escenario[]>([]); 

const [selectedEscenario, setSelectedEscenario] = useState<Escenario | null>(null);

 useEffect(() => {
    fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/escenario`,
      {               
        method: 'GET', 
        credentials: 'include'
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setEscenarios(data);
      })
      .catch(error => console.error('Error fetching escenarios:', error));
  }, []);

 const handleEscenarioClick = (escenario: Escenario) => {
    setSelectedEscenario(escenario);
  };  

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <NavBar />

            {/* Content area: keep everything inside to prevent overflow */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebard 
                onClick={handleEscenarioClick} />
                {/* Main: takes remaining space, hides overflow so map never exceeds viewport */}
                <main className="flex-1 p-6 overflow-hidden">
                  <div className="h-full w-full rounded-lg overflow-hidden shadow-sm">
                    <MapView 
                      escenarios={escenarios} 
                      selectedEscenario={selectedEscenario}
                    />
                  </div>
                </main>
            </div>
        </div>
    );  
}