import { useState } from "react"
import { LuCheck, LuUser, LuWallet, LuImage, LuFileText, LuMapPin} from "react-icons/lu"
import { useEscenario } from '../../hooks/useEscenario'
import Step1 from "./Step1-name"
import Step2Description from "./Step2-description"
import Step3Ubication from "./Step3-ubication"
import StepDetail from "./Step-detail"
import Step6Photos from "./Step6-photos"
import Step5End from "./Step5-end"
import StepFinished from "./Step-finished"

export default function Create() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { submitEscenario } = useEscenario()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = async () => {
    setIsSubmitting(true)
    
    const success = await submitEscenario()
    
    if (success) {
      setCurrentStep(steps.length - 1)
    } else {
      alert('Hubo un error al crear el escenario. Por favor intenta de nuevo.')
    }
    
    setIsSubmitting(false)
  }

  const steps = [
    {
      icon: <LuUser className="w-5 h-5" />,
      label: "Nombre",
      description: <Step1 />,
    },
    {
      icon: <LuFileText className="w-5 h-5" />,
      label: "Descripción",
      description: <Step2Description />,
    },
    {
      icon: <LuMapPin className="w-5 h-5" />,
      label: "Ubicación",
      description: <Step3Ubication />,
    },
    {
      icon: <LuWallet className="w-5 h-5" />,
      label: "Detalles",
      description: <StepDetail />,
    },
    {
      icon: <LuImage className="w-5 h-5" />,
      label: "Fotos",
      description: <Step6Photos />,
    },
    {
      icon: <LuCheck className="w-5 h-5" />,
      label: "Resumen",
      description: <Step5End />,
    },
    {
      icon: <LuCheck className="w-5 h-5" />,
      label: "Finalizado",
      description: <StepFinished />,
    }
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {steps[currentStep].description}
        </div>
      </div>

      {currentStep < steps.length - 1 && (
        <div className="flex-shrink-0 py-6 px-4 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-6 max-w-4xl mx-auto overflow-x-auto pb-2">
            {steps.slice(0, -1).map((step, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                <div className={`flex flex-col items-center gap-1 ${
                    index === currentStep ? 'scale-110' : ''
                  } transition-transform`}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    index < currentStep 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : index === currentStep
                      ? 'bg-blue-100 border-blue-600 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {index < currentStep ? <LuCheck className="w-5 h-5" /> : step.icon}
                  </div>
                  <span className={`text-xs font-medium ${
                    index === currentStep 
                      ? 'text-blue-600' 
                      : index < currentStep
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                
                {index < steps.length - 2 && (
                  <div className={`w-12 h-1 mx-2 transition-all ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0 || isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Anterior
            </button>
            <button
              onClick={currentStep === steps.length - 2 ? handleFinish : handleNext}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando...
                </>
              ) : (
                currentStep === steps.length - 2 ? 'Crear Escenario' : 'Siguiente'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
