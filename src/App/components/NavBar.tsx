import { DropdownMenuDemo } from "./DropMenu"; 
import { useAuth } from "../hooks/useAuth";
import { ServicioClientSupabase } from '../hooks/ServicioClientSupabase.ts';

export default function NavBar() {
const { isAuthenticated } = useAuth();
const { session } = ServicioClientSupabase();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-[1000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">Sport Zone</span>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Si NO está autenticado */}
            {!isAuthenticated && !session ? (
              <>
                <a href="/auth/login" className="text-gray-800 hover:text-gray-600 font-medium transition-colors">
                  Login
                </a>
                <a href="/auth/register" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors">
                  Registrarse
                </a>
              </>
            ) : (
              /* Si SÍ está autenticado */
              <>
                <a href="/mi-escenario" className="text-gray-800 hover:text-gray-600 font-medium transition-colors">
                  Mis escenarios
                </a>

                {/* Notificaciones */}
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {/* Badge de notificaciones (opcional) */}
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Dropdown del usuario */}
                <DropdownMenuDemo />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}