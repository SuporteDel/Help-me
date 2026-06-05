import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { DEFAULT_CONFIG, isAdminEmail } from "./config";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import NovoChamado from "./pages/NovoChamado";
import Historico from "./pages/Historico";
import Admin from "./pages/Admin";
import ChamadoDetalhe from "./pages/ChamadoDetalhe";
import Conversas from "./pages/Conversas";
import Configuracoes from "./pages/Configuracoes";
import Relatorios from "./pages/Relatorios";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appConfig, setAppConfig] = useState(DEFAULT_CONFIG);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const ref = doc(db, "config", "app");
    return onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        setAppConfig({ ...DEFAULT_CONFIG, ...snap.data() });
      } else {
        setAppConfig(DEFAULT_CONFIG);
        try { await setDoc(ref, DEFAULT_CONFIG, { merge: true }); } catch {}
      }
    });
  }, []);

  const isAdmin = useMemo(() => isAdminEmail(user?.email, appConfig.adminEmails), [user?.email, appConfig.adminEmails]);

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} appConfig={appConfig} />
      <div className="page-transition" key={location.pathname}>
        <Routes location={location}>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/cadastro" element={user ? <Navigate to="/" /> : <Cadastro />} />
          <Route path="/" element={<ProtectedRoute user={user}><Dashboard user={user} isAdmin={isAdmin} appConfig={appConfig} /></ProtectedRoute>} />
          <Route path="/novo-chamado" element={<ProtectedRoute user={user}><NovoChamado user={user} appConfig={appConfig} /></ProtectedRoute>} />
          <Route path="/historico" element={<ProtectedRoute user={user}><Historico user={user} /></ProtectedRoute>} />
          <Route path="/conversas" element={<ProtectedRoute user={user}><Conversas user={user} isAdmin={isAdmin} /></ProtectedRoute>} />
          <Route path="/chamado/:id" element={<ProtectedRoute user={user}><ChamadoDetalhe user={user} isAdmin={isAdmin} /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute user={user}>{isAdmin ? <Admin user={user} /> : <Navigate to="/" />}</ProtectedRoute>} />
          <Route path="/relatorios" element={<ProtectedRoute user={user}>{isAdmin ? <Relatorios /> : <Navigate to="/" />}</ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute user={user}>{isAdmin ? <Configuracoes appConfig={appConfig} /> : <Navigate to="/" />}</ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}
