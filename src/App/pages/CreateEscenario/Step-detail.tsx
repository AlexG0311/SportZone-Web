import { useState, useEffect } from "react"
import { useEscenario } from "@/App/hooks/useEscenario"

interface StepDetailProps {
  onValidationChange?: (isValid: boolean) => void
}

export default function StepDetail({ onValidationChange }: StepDetailProps) {
  const { escenarioData, updateField } = useEscenario();

  const [precio, setPrecio] = useState(
    escenarioData.precio ? escenarioData.precio.toString() : ""
  )
  const [capacidad, setCapacidad] = useState(
    escenarioData.capacidad ? escenarioData.capacidad.toString() : ""
  )
  const [errors, setErrors] = useState({ precio: "", capacidad: "" })

  // Sincronizar con el Context cuando cambien los valores
  useEffect(() => {
    const precioNum = parseFloat(precio)
    const capacidadNum = parseInt(capacidad)
    
    if (!isNaN(precioNum) && precioNum > 0) {
      updateField('precio', precioNum)
    }
    
    if (!isNaN(capacidadNum) && capacidadNum > 0) {
      updateField('capacidad', capacidadNum)
    }
  }, [precio, capacidad, updateField])

  const validateFields = (precioValue: string, capacidadValue: string) => {
    const newErrors = {
      precio: !precioValue ? "El precio por hora es requerido" : 
              isNaN(Number(precioValue)) || Number(precioValue) <= 0 ? "Ingresa un precio válido" : "",
      capacidad: !capacidadValue ? "La capacidad es requerida" : 
                 isNaN(Number(capacidadValue)) || Number(capacidadValue) <= 0 ? "Ingresa una capacidad válida" : "",
    }
    
    setErrors(newErrors)
    
    const isValid = !newErrors.precio && !newErrors.capacidad
    
    if (onValidationChange) {
      onValidationChange(isValid)
    }
    
    return isValid
  }

  const handlePrecioChange = (value: string) => {
    setPrecio(value)
    validateFields(value, capacidad)
  }

  const handleCapacidadChange = (value: string) => {
    setCapacidad(value)
    validateFields(precio, value)
  }

  return (
    <div className="flex flex-col items-center gap-8 py-12 w-full max-w-2xl mx-auto px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 tracking-tight">
        Detalles del Escenario
      </h1>

      <div className="w-full flex flex-col gap-6">
        {/* Precio por hora */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio por hora <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
              $
            </span>
            <input
              type="number"
              value={precio}
              onChange={(e) => handlePrecioChange(e.target.value)}
              placeholder="Ej. 25000"
              min="0"
              step="1000"
              className={`w-full pl-8 pr-4 py-3 text-base border ${
                errors.precio ? 'border-red-500' : 'border-gray-200'
              } bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.precio ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              } focus:border-transparent shadow-sm transition duration-150`}
            />
          </div>
          {errors.precio && (
            <p className="text-red-500 text-sm mt-1">{errors.precio}</p>
          )}
        </div>

        {/* Capacidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacidad (personas) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={capacidad}
            onChange={(e) => handleCapacidadChange(e.target.value)}
            placeholder="Ej. 10"
            min="1"
            className={`w-full px-4 py-3 text-base border ${
              errors.capacidad ? 'border-red-500' : 'border-gray-200'
            } bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.capacidad ? 'focus:ring-red-500' : 'focus:ring-blue-500'
            } focus:border-transparent shadow-sm transition duration-150`}
          />
          {errors.capacidad && (
            <p className="text-red-500 text-sm mt-1">{errors.capacidad}</p>
          )}
        </div>

        {/* Preview de datos guardados */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-1">Datos guardados:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p>Precio: ${escenarioData.precio?.toLocaleString('es-CO') || 'No definido'}</p>
            <p>Capacidad: {escenarioData.capacidad || 'No definida'} personas</p>
          </div>
        </div>
      </div>
    </div>
  )
}