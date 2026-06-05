import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NovoChamado from './pages/NovoChamado.jsx';
import Historico from './pages/Historico.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/novo-chamado" element={<NovoChamado />} />
      <Route path="/historico" element={<Historico />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
