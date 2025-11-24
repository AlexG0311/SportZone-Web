import {Routes, Route, Navigate} from 'react-router-dom';
import Login from './App/pages/auth/Login.tsx';
import Home from './App/pages/Home.tsx';
import './App.css';
import Detalle from './App/pages/Detalle.tsx';
import Reservar from './App/pages/Reservar.tsx';
import MiEscenario from './App/pages/MiEscenario.tsx';
import EditarEscenario from './App/pages/EditarEscenario.tsx';
import PanelControl from './App/pages/PanelControl.tsx';
import Create from './App/pages/CreateEscenario/Create.tsx';
import { EscenarioProvider } from './App/provider/EscenarioProvider.tsx';
import DetailEscenario from './App/pages/DetailEscenario.tsx';
import MisReservas from './App/pages/Mis-Reservas.tsx';
import Register from './App/pages/auth/Register.tsx';
export default function App() {
  
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/Login" />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/create-account" element={<Create />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/detalle/:id" element={<Detalle />} />
      <Route path="/reservar/:id" element={<Reservar />} />
      <Route path="/mi-escenario" element={<MiEscenario />} />

      <Route path="/crear-escenario" element={
        <EscenarioProvider>
          <Create />
        </EscenarioProvider>
      } />
      <Route path="/editar-escenario/:id" element={<EditarEscenario />} />
      <Route path="/panel-control/:id" element={<PanelControl />} />
      <Route path="/detalle-escenario/:id" element={<DetailEscenario />} />
      <Route path="/mis-reservas" element={<MisReservas />} />
    </Routes>

  );
}