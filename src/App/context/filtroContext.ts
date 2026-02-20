import { createContext, Dispatch, SetStateAction } from "react";
import { Escenario } from "../types/escenario";


interface valores {
    setPrice: Dispatch<SetStateAction<number>>,
    setBusqueda: Dispatch<SetStateAction<string>>,
    escenariosFiltrados: Escenario[],
    busqueda: string
    setTipo: Dispatch<SetStateAction<string>>,
    tipo: string
    setCapacity: Dispatch<SetStateAction<number>>,
    capacity: number
}

export const filtroContext = createContext<valores | null>(null)