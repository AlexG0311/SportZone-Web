import {Routes, Route, Navigate} from 'react-router-dom';
import Login from './App/pages/auth/Login.tsx';
import Home from './App/pages/Home.tsx';
import './App.css';
import Detalle from './App/pages/Detalle.tsx';
import Reservar from './App/pages/Reservar.tsx';
import MiEscenario from './App/pages/MiEscenario.tsx';
import CrearScenario from './App/pages/CrearEscenario.tsx';
import EditarEscenario from './App/pages/EditarEscenario.tsx';
import PanelControl from './App/pages/PanelControl.tsx';

export default function App() {
  
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/Login" />} />
      <Route path="/Login" element={<Login />} />
     
      <Route path="/Home" element={<Home />} />
      <Route path="/detalle/:id" element={<Detalle />} />
      <Route path="/reservar/:id" element={<Reservar />} />
      <Route path="/mi-escenario" element={<MiEscenario />} />
      <Route path="/crear-escenario" element={<CrearScenario />} />
      <Route path="/editar-escenario/:id" element={<EditarEscenario />} />
      <Route path="/panel-control/:id" element={<PanelControl />} />
    
    </Routes>

  );
}