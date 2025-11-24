import { useNavigate } from "react-router-dom"

import { CheckCircle, Clock, Shield, Bell } from "lucide-react"

export default function StepFinished() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-3xl mx-auto px-4 py-12">

      {/* Mensaje principal */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          ¡Felicidades!
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-gray-700">
          Has creado tu escenario exitosamente
        </p>
      </div>

      {/* Card de información */}
      <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 space-y-6">
        {/* Estado pendiente */}
        <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
          <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-yellow-900 mb-1">
              Tu escenario está en revisión
            </h3>
            <p className="text-sm text-yellow-800 leading-relaxed">
              Espera que un administrador valide tu escenario. Este proceso puede tardar entre 24 y 48 horas.
            </p>
          </div>
        </div>

        {/* Pasos siguientes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>¿Qué sigue ahora?</span>
          </h3>

          <div className="space-y-3">
            {/* Notificación */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Recibirás una notificación</p>
                <p className="text-sm text-gray-600">
                  Te avisaremos por correo electrónico cuando tu escenario sea aprobado o si necesitamos alguna corrección.
                </p>
              </div>
            </div>

            {/* Validación */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-0.5">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Verificación de seguridad</p>
                <p className="text-sm text-gray-600">
                  Nuestro equipo validará que la información sea correcta y que el escenario cumpla con nuestros estándares de calidad.
                </p>
              </div>
            </div>

            {/* Publicación */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Listo para reservas</p>
                <p className="text-sm text-gray-600">
                  Una vez aprobado, tu escenario estará visible para todos los usuarios y podrán hacer reservas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button onClick={() => navigate('/mi-escenario')} className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
          Ver mis escenarios
        </button>
        <button className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all">
          Crear otro escenario
        </button>
      </div>

      {/* Nota de ayuda */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          ¿Tienes dudas? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">Contáctanos</a>
        </p>
      </div>
    </div>
  )
}