import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { LifeBuoy, LogOut } from "lucide-react";

export default function Navbar({ user, isAdmin, appConfig }) {
  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState(0);

  useEffect(() => {
    if (!user) return;
    const q = isAdmin
      ? query(collection(db, "chamados"), where("notifiedAdmin", "==", true))
      : query(collection(db, "chamados"), where("userId", "==", user.uid), where("notifiedUser", "==", true));
    return onSnapshot(q, (snap) => setNotificacoes(snap.size));
  }, [user, isAdmin]);

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand"><LifeBuoy size={24}/> {appConfig?.companyName || "Help-me TI"}</Link>
      {user && (
        <nav>
          <NavLink to="/">Início</NavLink>
          <NavLink to="/novo-chamado">Novo chamado</NavLink>
          <NavLink to="/historico">Histórico</NavLink>
          <NavLink to="/conversas" className="nav-with-badge">Conversas{notificacoes > 0 && <span className="nav-badge">{notificacoes}</span>}</NavLink>
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
          {isAdmin && <NavLink to="/relatorios">Relatórios</NavLink>}
          {isAdmin && <NavLink to="/configuracoes">Configurações</NavLink>}
          <button className="btn small" onClick={logout}><LogOut size={16}/> Sair</button>
        </nav>
      )}
    </header>
  );
}
