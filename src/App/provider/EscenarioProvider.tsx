import { useState, type ReactNode } from 'react'
import type { EscenarioData } from '../context/EscenarioContext'
import { EscenarioContext } from '../context/EscenarioContext'
import { useAuth } from '../hooks/useAuth'

const initialData: EscenarioData = {
  nombre: "",
  descripcion: "",
  ubicacion: {
    latitud: 9.30311063,
    longitud: -75.38869154,
    direccion: ""
  },
  tipo: "Privado",
  precio: 0,
  capacidad: 0,
  imagenPrincipal: null,
  imagenesAdicionales: []
}

export function EscenarioProvider({ children }: { children: ReactNode }) {
  const [escenarioData, setEscenarioData] = useState<EscenarioData>(initialData)
  const { usuario } = useAuth()
  const updateField = <K extends keyof EscenarioData>(
    field: K, 
    value: EscenarioData[K]
  ) => {
    setEscenarioData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateUbicacion = (field: keyof EscenarioData['ubicacion'], value: any) => {
    setEscenarioData(prev => ({
      ...prev,
      ubicacion: {
        ...prev.ubicacion,
        [field]: value
      }
    }))
  }

  const resetData = () => {
    setEscenarioData(initialData)
  }

  const submitEscenario = async (): Promise<boolean> => {
    try {
      // Construir array de imágenes
      const imagenes = []
      
      // Agregar imagen principal primero (orden 0)
      if (escenarioData.imagenPrincipal) {
        imagenes.push({
          url: escenarioData.imagenPrincipal,
          descripcion: "Imagen principal",
          orden: 0
        })
      }
      
      // Agregar imágenes adicionales (orden 1, 2, 3...)
      escenarioData.imagenesAdicionales.forEach((url, index) => {
        imagenes.push({
          url: url,
          descripcion: `Imagen adicional ${index + 1}`,
          orden: index + 1
        })
      })

      // Construir el objeto según el formato del backend
      const payload = {
        nombre: escenarioData.nombre,
        tipo: "Privado",
        descripcion: escenarioData.descripcion,
        direccion: escenarioData.ubicacion.direccion,
        capacidad: escenarioData.capacidad,
        precio: escenarioData.precio,
        latitud: escenarioData.ubicacion.latitud,
        longitud: escenarioData.ubicacion.longitud,
        estadoId: 3, // Estado "pendiente" o el que corresponda
        encargadoId: usuario?.id, // ID del usuario logueado (deberías obtenerlo del AuthContext)
        imagenes: imagenes
      }

      console.log('Enviando datos al backend:', payload)

      // Hacer la petición al backend
      const response = await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/escenario/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      console.log(payload)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error del servidor:', errorData)
        throw new Error(errorData.message || 'Error al crear el escenario')
      }

      const result = await response.json()
      console.log('Escenario creado exitosamente:', result)
      
      // Resetear los datos después de crear exitosamente
      resetData()
      
      return true
    } catch (error) {
      console.error('Error al crear escenario:', error)
      return false
    }
  }

  return (
    <EscenarioContext.Provider value={{
      escenarioData,
      updateField,
      updateUbicacion,
      resetData,
      submitEscenario
    }}>
      {children}
    </EscenarioContext.Provider>
  )
}

