import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {

  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://192.168.100.147:4000/api/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Para cookies
        body: JSON.stringify({ email, contrasena })
      });

      const data = await res.json();

      if (data) {
        login(data);
      }

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }
      console.log('Login response data:', data);
      // Login exitoso
      navigate('/Home');
      
    } catch (err) {
      console.error('Error:', err);
      setError('Error de red. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="min-h-screen flex items-center justify-end bg-gradient-to-br from-green-400 via-green-500 to-green-600 px-8">
        
            <div className="w-full max-w-sm p-6 bg-white  shadow-2xl">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-block p-2 bg-green-100 rounded-full mb-3">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Escenarios</h1>
                    <p className="text-gray-500 text-sm mt-1">Inicia sesión para continuar</p>
                </div>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input 
                            type="text" 
                            onChange={(e) => setEmail(e.target.value)}
                             value={email}
                            placeholder="Ingresa tu email" 
                             disabled={loading}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input 
                            type="password" 
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            placeholder="Ingresa tu contraseña" 
                             disabled={loading}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center">
                            <input type="checkbox" className="w-3 h-3 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                            <span className="ml-2 text-gray-600">Recordarme</span>
                        </label>
                        <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2.5 text-sm rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition duration-200 shadow-lg"
                    >
                         {loading ? 'Iniciando sesión...' : 'Inicia Sesión'}
                    
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-600">
                        ¿No tienes cuenta? 
                        <a href="#" className="text-green-600 hover:text-green-700 font-medium ml-1">
                            Regístrate aquí
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}