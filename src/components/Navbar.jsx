import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Navbar() {
  const navigate = useNavigate();

  async function sair() {
    await signOut(auth);
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="brand">Chamados TI</div>
      <nav>
        <Link to="/dashboard">Início</Link>
        <Link to="/novo-chamado">Novo Chamado</Link>
        <Link to="/historico">Histórico</Link>
        <Link to="/admin">Admin</Link>
        <button onClick={sair}>Sair</button>
      </nav>
    </header>
  );
}
