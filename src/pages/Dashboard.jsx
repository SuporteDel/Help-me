import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <main className="container">
        <section className="hero">
          <h1>Central de Suporte de TI</h1>
          <p>Abra chamados, reporte erros e acompanhe o atendimento em tempo real.</p>
        </section>
        <section className="cards">
          <Link className="card" to="/novo-chamado">
            <h2>Abrir novo chamado</h2>
            <p>Solicite suporte para computador, internet, sistema, impressora e acessos.</p>
          </Link>
          <Link className="card" to="/novo-chamado?tipo=erro">
            <h2>Reportar erro</h2>
            <p>Informe falhas em sistemas, páginas, servidores ou equipamentos.</p>
          </Link>
          <Link className="card" to="/historico">
            <h2>Histórico</h2>
            <p>Veja todos os seus chamados e seus status.</p>
          </Link>
        </section>
      </main>
    </>
  );
}
