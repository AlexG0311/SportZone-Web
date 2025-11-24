import { createContext } from 'react'

export interface EscenarioData {
  nombre: string
  descripcion: string
  ubicacion: {
    latitud: number
    longitud: number
    direccion: string
  }
  tipo: string
  precio: number
  capacidad: number
  imagenPrincipal: string | null // ✅ Cambiar de File a string (URL)
  imagenesAdicionales: string[]
}

interface EscenarioContextType {
  escenarioData: EscenarioData
  updateField: <K extends keyof EscenarioData>(field: K, value: EscenarioData[K]) => void
  updateUbicacion: (field: keyof EscenarioData['ubicacion'], value: any) => void
  resetData: () => void
  submitEscenario: () => Promise<boolean>
}

export const EscenarioContext = createContext<EscenarioContextType | undefined>(undefined)
