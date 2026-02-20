import { useContext } from "react"
import { filtroContext } from "../context/filtroContext"

  
export const useFiltro = () => {

    const ContextFiltro = useContext(filtroContext);
    if (!ContextFiltro) {
       throw new Error ('Error con el ContextFiltro')
    }
    return ContextFiltro


}