import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Phone, Lock, UserPlus } from "lucide-react";
import Logo from "../image/Logo.jpg";

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validarEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validarTelefono = (telefono: string) => {
    const telefonoRegex = /^[0-9]{10}$/;
    return telefonoRegex.test(telefono);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }

    if (!email.trim()) {
      setError("El email es requerido");
      return;
    }

    if (!validarEmail(email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    if (!contrasena.trim()) {
      setError("La contraseña es requerida");
      return;
    }

    if (contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!telefono.trim()) {
      setError("El teléfono es requerido");
      return;
    }

    if (!validarTelefono(telefono)) {
      setError("Por favor ingresa un teléfono válido (10 dígitos)");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://backend-sportzone-production.up.railway.app/api/usuario/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim().toLowerCase(),
          contrasena: contrasena,
          telefono: telefono.trim(),
          rolId: 2, // Rol de usuario
        }),
      });

      if (response.ok) {
        alert(
          "¡Registro Exitoso!\n\n" +
          "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión."
        );
        navigate("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "No se pudo crear la cuenta");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full text-white px-12">
          <div className="mb-8">
            <img 
              src={Logo} 
              alt="SportZone Logo" 
              className="w-48 h-48 object-contain drop-shadow-2xl animate-pulse"
            />
          </div>
          
          <h1 className="text-6xl font-black mb-4 tracking-tight">
            Sport<span className="text-yellow-300">Zone</span>
          </h1>
          
          <p className="text-xl font-light text-center max-w-md leading-relaxed mb-8">
            Únete a nuestra comunidad deportiva
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md">
            <h3 className="text-2xl font-bold mb-4">¿Por qué registrarte?</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-6 h-6 mr-3 flex-shrink-0 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Reserva escenarios deportivos fácilmente</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 mr-3 flex-shrink-0 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Gestiona tus reservas en un solo lugar</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 mr-3 flex-shrink-0 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Accede a ofertas y promociones exclusivas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lado Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md">
          
          {/* Logo móvil */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src={Logo} 
              alt="SportZone Logo" 
              className="w-24 h-24 object-contain mx-auto mb-4"
            />
            <h1 className="text-4xl font-black text-gray-800">
              Sport<span className="text-green-600">Zone</span>
            </h1>
          </div>

          {/* Card del formulario */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Crear Cuenta
              </h2>
              <p className="text-gray-600">
                Completa el formulario para registrarte
              </p>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre completo" 
                    disabled={loading}
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com" 
                    disabled={loading}
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="tel" 
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="1234567890" 
                    disabled={loading}
                    required
                    maxLength={10}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Ingresa 10 dígitos</p>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    placeholder="Mínimo 6 caracteres" 
                    disabled={loading}
                    required
                    className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmarContrasena}
                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                    placeholder="Confirma tu contraseña" 
                    disabled={loading}
                    required
                    className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Términos y condiciones */}
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  required
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1 cursor-pointer" 
                />
                <label className="ml-2 text-sm text-gray-600">
                  Acepto los{' '}
                  <a href="#" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                    términos y condiciones
                  </a>
                  {' '}y la{' '}
                  <a href="#" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                    política de privacidad
                  </a>
                </label>
              </div>

              {/* Botón de registro */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3.5 rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cuenta...
                  </span>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta? {' '}
                <a 
                  href="/login" 
                  className="text-green-600 hover:text-green-700 font-bold hover:underline"
                >
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-center text-sm text-gray-500 mt-6">
            © 2025 SportZone. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}