import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { isAdminEmail } from "../config";
import { LifeBuoy, LogOut } from "lucide-react";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand"><LifeBuoy size={24}/> Help-me TI</Link>
      {user && (
        <nav>
          <NavLink to="/">Início</NavLink>
          <NavLink to="/novo-chamado">Novo chamado</NavLink>
          <NavLink to="/historico">Histórico</NavLink>
          {isAdminEmail(user.email) && <NavLink to="/admin">Admin</NavLink>}
          <button className="btn small" onClick={logout}><LogOut size={16}/> Sair</button>
        </nav>
      )}
    </header>
  );
}
