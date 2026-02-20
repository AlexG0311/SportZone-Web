import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { FiltroProvider } from '@/App/provider/FiltroProvider';

// Layouts
import MainLayout from '../layout/MainLayout';
import AdminLayout from '../layout/AdminLayout';
import AuthLayout from '../layout/AuthLayout';

// Providers
import { EscenarioProvider } from '../App/provider/EscenarioProvider';

// Páginas que NO usan lazy loading (críticas)
import NotFound from './NotFound';

// Lazy loading de páginas
const Home = lazy(() => import('../App/pages/Home'));
const Login = lazy(() => import('../App/pages/auth/Login'));
const Register = lazy(() => import('../App/pages/auth/Register'));
const Detalle = lazy(() => import('../App/pages/Detalle'));
const Reservar = lazy(() => import('../App/pages/Reservar'));
const MiEscenario = lazy(() => import('../App/pages/MiEscenario'));
const EditarEscenario = lazy(() => import('../App/pages/EditarEscenario'));
const PanelControl = lazy(() => import('../App/pages/PanelControl'));
const Create = lazy(() => import('../App/pages/CreateEscenario/Create'));
const DetailEscenario = lazy(() => import('../App/pages/DetailEscenario'));
const MisReservas = lazy(() => import('../App/pages/Mis-Reservas'));
const Perfil = lazy(() => import('../App/pages/Perfil'));

// Admin pages
const Dashboard = lazy(() => import('../App/pages/admin/Dashboard'));
const RevisionEscenarios = lazy(() => import('../App/pages/admin/RevisionEscenarios'));
const GestionEscenarios = lazy(() => import('../App/pages/admin/GestionEscenarios'));
const PerfilAdmin = lazy(() => import('../App/pages/admin/PerfilAdmin'));
const GestionUsuarios = lazy(() => import('../App/pages/admin/GestionUsuarios'));

// Loading component
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="spinner"></div>
  </div>
);

// Wrapper para páginas con Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  // Redirect raíz
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },

  // Rutas de autenticación
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <SuspenseWrapper>
            <Login />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'register',
        element: (
          <SuspenseWrapper>
            <Register />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    
  },

  // Rutas públicas con layout principal
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: 'home',
        element: (
        <FiltroProvider>
         <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        </FiltroProvider>
     
        ),
      },
      {
        path: 'detalle/:id',
        element: (
          <SuspenseWrapper>
            <Detalle />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'Perfil',
        element: (
          <SuspenseWrapper>
            <Perfil />
          </SuspenseWrapper>
        ),
      }
    ],
  },

  // Rutas protegidas (requieren autenticación)
  {
    path: '/',
    element: (
   
        <MainLayout />
   
    ),
    children: [
      {
        path: 'reservar/:id',
        element: (
          <SuspenseWrapper>
            <Reservar />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'mi-escenario',
        element: (
          <SuspenseWrapper>
            <MiEscenario />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'crear-escenario',
        element: (
          <EscenarioProvider>
            <SuspenseWrapper>
              <Create />
            </SuspenseWrapper>
          </EscenarioProvider>
        ),
      },
      {
        path: 'editar-escenario/:id',
        element: (
          <SuspenseWrapper>
            <EditarEscenario />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'panel-control/:id',
        element: (
          <SuspenseWrapper>
            <PanelControl />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'detalle-escenario/:id',
        element: (
          <SuspenseWrapper>
            <DetailEscenario />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'mis-reservas',
        element: (
          <SuspenseWrapper>
            <MisReservas />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // Rutas de administrador
  {
    path: '/admin',
    element: (
   
        <AdminLayout />
    
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper>
            <Dashboard />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'revision-escenarios',
        element: (
          <SuspenseWrapper>
            <RevisionEscenarios />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'gestion-escenarios',
        element: (
          <SuspenseWrapper>
            <GestionEscenarios />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'perfil-admin',
        element: (
          <SuspenseWrapper>
            <PerfilAdmin />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'gestion-usuarios',
        element: (
          <SuspenseWrapper>
            <GestionUsuarios />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // Ruta 404
  {
    path: '*',
    element: <NotFound />,
  },
]);