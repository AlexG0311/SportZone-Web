import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../image/Logo.jpg";
import { supabaseCliente  } from "../supabase/clienteSupabase.ts";
import { ServicioClientSupabase } from '../../hooks/ServicioClientSupabase.ts';

export default function Login() {
const [email, setEmail] = useState('');
const [contrasena, setContrasena] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);


const navigate = useNavigate();
const { login } = useAuth();
const { session } = ServicioClientSupabase();

useEffect(() => { 
  if (session) {
    navigate('/Home');
  }
}, [session]);

  const signInWithGoogle = async () => {
    try {
      setError('');
      setLoading(true);
      
      const { error } = await supabaseCliente.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error('Google OAuth error:', error);
        setError(error.message);
        setLoading(false);
      }
      
      // No necesitas setLoading(false) aquí porque redirigirá
    } catch (err) {
      console.error('Error con Google login:', err);
      setError('Error al iniciar sesión con Google');
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/usuario/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
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
      navigate('/Home');
      
    } catch (err) {
      console.error('Error:', err);
      setError('Error de red. Intenta más tarde.');
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
          
          <p className="text-xl font-light text-center max-w-md leading-relaxed">
            Tu plataforma para gestionar y reservar escenarios deportivos
          </p>

          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-sm text-green-100">Escenarios</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-sm text-green-100">Usuarios</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-sm text-green-100">Reservas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
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
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Bienvenido de vuelta
              </h2>
              <p className="text-gray-600">
                Inicia sesión para continuar
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input 
                  type="email" 
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="tu@email.com" 
                  disabled={loading}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <input 
                  type="password" 
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••" 
                  disabled={loading}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer" 
                  />
                  <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                </label>
                <a 
                  href="#" 
                  className="text-sm text-green-600 hover:text-green-700 font-semibold hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

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
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">o continúa con</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={signInWithGoogle} type="button" className="flex items-center justify-center px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700">
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta? {' '}
                <a 
                  href="/registro" 
                  className="text-green-600 hover:text-green-700 font-bold hover:underline"
                >
                  Regístrate aquí
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