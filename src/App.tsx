import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- 1. Importamos el componente Register
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import MisPartidos from './pages/MisPartidos';
import Tablero from './pages/Tablero';
import Suscripcion from './pages/Suscripcion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* <-- 2. Declaramos la ruta */}
        
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/admin" element={<AdminPanel />} />
          <Route path="/dashboard/partidos" element={<MisPartidos />} />
          <Route path="/dashboard/suscripcion" element={<Suscripcion />} />
        </Route>

        <Route path="/tablero" element={<Tablero />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;