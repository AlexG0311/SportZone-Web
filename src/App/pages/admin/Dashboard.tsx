
import { useState } from 'react';
import { 
  Home, 
  MapPin, 
  User, 
  Users, 
  FileCheck,
  Menu,
  X 
} from 'lucide-react';
import { RevisionEscenarios } from './RevisionEscenarios.tsx';
import { GestionEscenarios } from './GestionEscenarios.tsx';
import { PerfilAdmin } from './PerfilAdmin.tsx';
import { GestionUsuarios } from './GestionUsuarios.tsx';  

type MenuOption = 'revision' | 'escenarios' | 'perfil' | 'usuarios';

export const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState<MenuOption>('revision');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { 
      id: 'revision' as MenuOption, 
      label: 'Revisión de Escenarios', 
      icon: FileCheck,
      description: 'Aprobar o rechazar solicitudes'
    },
    { 
      id: 'escenarios' as MenuOption, 
      label: 'Escenarios', 
      icon: MapPin,
      description: 'Gestionar escenarios activos'
    },
    { 
      id: 'perfil' as MenuOption, 
      label: 'Perfil', 
      icon: User,
      description: 'Configuración de cuenta'
    },
    { 
      id: 'usuarios' as MenuOption, 
      label: 'Usuarios', 
      icon: Users,
      description: 'Administrar usuarios'
    },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'revision':
        return <RevisionEscenarios />;
      case 'escenarios':
        return <GestionEscenarios />;
      case 'perfil':
        return <PerfilAdmin />;
      case 'usuarios':
        return <GestionUsuarios />;
      default:
        return <RevisionEscenarios />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">SportZone</h1>
                  <p className="text-xs text-gray-500">Panel Admin</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Menú de navegación */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedMenu === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedMenu(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-start space-x-3 p-4 rounded-xl
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-green-50 border-2 border-green-500 shadow-sm' 
                      : 'hover:bg-gray-50 border-2 border-transparent'
                    }
                  `}
                >
                  <Icon 
                    className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      isActive ? 'text-green-600' : 'text-gray-400'
                    }`} 
                  />
                  <div className="flex-1 text-left">
                    <div className={`font-semibold ${
                      isActive ? 'text-green-700' : 'text-gray-700'
                    }`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer del Sidebar */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 truncate">
                  admin@sportzone.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header superior */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {menuItems.find(item => item.id === selectedMenu)?.label}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {menuItems.find(item => item.id === selectedMenu)?.description}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Área de contenido */}
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};






