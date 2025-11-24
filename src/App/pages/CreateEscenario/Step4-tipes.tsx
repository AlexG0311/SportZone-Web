import { useState } from "react"
import { 
  LuDumbbell, 
  LuBike,
  LuWaves,
  LuCircle,
  LuTarget,
  LuTrophy,
  LuActivity,
  LuUsers
} from "react-icons/lu"

import { IoFootball } from "react-icons/io5";

interface TipoEscenario {
  id: string
  nombre: string
  icon: React.ReactNode
}

const tiposEscenarios: TipoEscenario[] = [
  { id: "futbol", nombre: "Fútbol", icon: <IoFootball className="w-8 h-8" /> },
  { id: "basketball", nombre: "Baloncesto", icon: <LuCircle className="w-8 h-8" /> },
  { id: "tenis", nombre: "Tenis", icon: <LuTarget className="w-8 h-8" /> },
  { id: "gym", nombre: "Gimnasio", icon: <LuDumbbell className="w-8 h-8" /> },
  { id: "natacion", nombre: "Natación", icon: <LuWaves className="w-8 h-8" /> },
  { id: "ciclismo", nombre: "Ciclismo", icon: <LuBike className="w-8 h-8" /> },
  { id: "voleibol", nombre: "Voleibol", icon: <LuActivity className="w-8 h-8" /> },
  { id: "deportes", nombre: "Multicancha", icon: <LuTrophy className="w-8 h-8" /> },
  { id: "crossfit", nombre: "CrossFit", icon: <LuUsers className="w-8 h-8" /> },
]

interface Step4TypesProps {
  onValidationChange?: (isValid: boolean) => void
}

export default function Step4Types({ onValidationChange }: Step4TypesProps) {
  const [selectedType, setSelectedType] = useState<string>("")
  const [otroTipo, setOtroTipo] = useState("")
  const [showOtro, setShowOtro] = useState(false)
  const [error, setError] = useState("")

  const handleSelectType = (id: string) => {
    setSelectedType(id)
    setShowOtro(false)
    setOtroTipo("")
    setError("")
    if (onValidationChange) {
      onValidationChange(true)
    }
  }

  const handleOtroClick = () => {
    setShowOtro(true)
    setSelectedType("otro")
    if (onValidationChange) {
      onValidationChange(false)
    }
  }

  const handleOtroChange = (value: string) => {
    setOtroTipo(value)
    const isValid = value.trim() !== ""
    setError(isValid ? "" : "Por favor especifica el tipo de escenario")
    if (onValidationChange) {
      onValidationChange(isValid)
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 py-12 w-full max-w-5xl mx-auto px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 tracking-tight">
        ¿Cuál de estos tipos es tu escenario?
      </h1>

      {/* Grid de tipos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {tiposEscenarios.map((tipo) => (
          <button
            key={tipo.id}
            onClick={() => handleSelectType(tipo.id)}
            className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all duration-200 ${
              selectedType === tipo.id
                ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className={`mb-3 ${selectedType === tipo.id ? 'text-blue-600' : 'text-gray-600'}`}>
              {tipo.icon}
            </div>
            <span className={`font-semibold text-lg ${
              selectedType === tipo.id ? 'text-blue-600' : 'text-gray-700'
            }`}>
              {tipo.nombre}
            </span>
          </button>
        ))}
      </div>

      {/* Opción Otro */}
      <div className="w-full max-w-md">
        <button
          onClick={handleOtroClick}
          className={`w-full flex items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 ${
            showOtro
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
          }`}
        >
          <span className={`font-semibold ${showOtro ? 'text-blue-600' : 'text-gray-700'}`}>
            Otro (especifique)
          </span>
        </button>

        {showOtro && (
          <div className="mt-4">
            <input
              type="text"
              value={otroTipo}
              onChange={(e) => handleOtroChange(e.target.value)}
              placeholder="Escribe el tipo de escenario"
              className={`w-full px-4 py-3 text-base border ${
                error ? 'border-red-500' : 'border-gray-200'
              } bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 ${
                error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              } focus:border-transparent shadow-sm transition duration-150`}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
