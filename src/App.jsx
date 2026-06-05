import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { isAdminEmail } from "./config";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import NovoChamado from "./pages/NovoChamado";
import Historico from "./pages/Historico";
import Admin from "./pages/Admin";
import ChamadoDetalhe from "./pages/ChamadoDetalhe";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <>
      <Navbar user={user} />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/cadastro" element={user ? <Navigate to="/" /> : <Cadastro />} />
        <Route path="/" element={<ProtectedRoute user={user}><Dashboard user={user} /></ProtectedRoute>} />
        <Route path="/novo-chamado" element={<ProtectedRoute user={user}><NovoChamado user={user} /></ProtectedRoute>} />
        <Route path="/historico" element={<ProtectedRoute user={user}><Historico user={user} /></ProtectedRoute>} />
        <Route path="/chamado/:id" element={<ProtectedRoute user={user}><ChamadoDetalhe user={user} /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute user={user}>{isAdminEmail(user?.email) ? <Admin user={user} /> : <Navigate to="/" />}</ProtectedRoute>} />
      </Routes>
    </>
  );
}
