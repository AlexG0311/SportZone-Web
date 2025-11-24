import { useEscenario } from "@/App/hooks/useEscenario"


export default function Step2Description() {
  const { escenarioData, updateField } = useEscenario()

  return (
    <div className="flex flex-col  items-center gap-8 py-12 w-full max-w-2xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-gray-900 tracking-tight">
        Añade una descripción para tu escenario
      </h1>

      <div className="w-full w-200">
        <label className="sr-only">Descripción del escenario</label>
        <textarea
          value={escenarioData.descripcion}
          onChange={(e) => updateField('descripcion', e.target.value)}
          placeholder="Escribe una descripción detallada de tu escenario, incluyendo características, servicios y cualquier otra información relevante que pueda interesar a los usuarios."
          className="w-full h-40 px-5 py-3 text-lg border border-gray-200 bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-150"
        />
      </div>
    </div>
  )
}
