import { useEscenario } from "@/App/hooks/useEscenario"

export default function Step1() {
  const { escenarioData, updateField } = useEscenario()
  return (
    <div className="flex flex-col  items-center gap-8 py-12 w-full max-w-2xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-gray-900 tracking-tight">
        ¿Cómo se llamará tu escenario?
      </h1>

      <div className="w-full md:w-96">
        <label className="sr-only">Nombre del escenario</label>
        <input
          value={escenarioData.nombre}
          onChange={(e) => updateField('nombre', e.target.value)}
          type="text"
          placeholder="Ej. Cancha Central"
          className="w-full px-5 py-3 text-lg border border-gray-200 bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-150"
        />
      </div>
    </div>
  )
}