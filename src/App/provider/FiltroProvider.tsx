import { ReactNode } from "react"
import { filtroContext } from "../context/filtroContext"
import { useFiltroEscenario } from "../hooks/useFiltroEscenarios";

export const FiltroProvider = ({children}:{children:ReactNode}) =>{

const {setPrice,setBusqueda, escenariosFiltrados,busqueda, setTipo,tipo, setCapacity, capacity} = useFiltroEscenario();

const value = {
    setPrice,
    setBusqueda,
    escenariosFiltrados,
    busqueda,
    setTipo,
    tipo,
    setCapacity,
    capacity
}
    
return (

<filtroContext.Provider value={value}>
{children}
</filtroContext.Provider>
    
)


}


