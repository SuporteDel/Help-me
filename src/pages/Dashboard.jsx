import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock3, PlusCircle, BarChart3, Search, ShieldCheck } from "lucide-react";
import { isAdminEmail } from "../config";

export default function Dashboard({ user }) {
  const [items, setItems] = useState([]);
  const admin = isAdminEmail(user?.email);

  useEffect(() => {
    const q = admin
      ? collection(db, "chamados")
      : query(collection(db, "chamados"), where("userId", "==", user.uid));

    return onSnapshot(q, (snap) => {
      const dados = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.numero || 0) - (a.numero || 0));
      setItems(dados);
    });
  }, [user.uid, admin]);

  const stats = useMemo(() => ({
    abertos: items.filter((i) => i.status === "Aberto").length,
    andamento: items.filter((i) => i.status === "Em andamento").length,
    resolvidos: items.filter((i) => i.status === "Resolvido").length,
    total: items.length
  }), [items]);

  const recentes = items.slice(0, 4);

  return (
    <main className="container">
      <section className="hero hero-pro">
        <div>
          <span className="eyebrow">Central Premium</span>
          <h1>Olá, {user.displayName || "Fhellype"}</h1>
          <p>{admin ? "Gerencie todos os chamados, status, SLA e conversas." : "Abra chamados, envie prints e converse com o TI em tempo real."}</p>
          {admin && <span className="admin-chip"><ShieldCheck size={15}/> Modo administrador</span>}
        </div>
        <Link className="btn hero-btn" to="/novo-chamado"><PlusCircle size={18}/> Novo chamado</Link>
      </section>

      <section className="stats stats-four">
        <div className="stat"><AlertCircle size={23}/><span>{stats.abertos}</span><p>Abertos</p></div>
        <div className="stat"><Clock3 size={23}/><span>{stats.andamento}</span><p>Em andamento</p></div>
        <div className="stat"><CheckCircle2 size={23}/><span>{stats.resolvidos}</span><p>Resolvidos</p></div>
        <div className="stat"><BarChart3 size={23}/><span>{stats.total}</span><p>Total</p></div>
      </section>

      {admin && (
        <section className="dashboard-strip">
          <div><strong>Visão geral</strong><p>Os números acima consideram todos os usuários.</p></div>
          <Link to="/admin" className="btn ghost"><Search size={16}/> Abrir painel de busca</Link>
        </section>
      )}

      <section className="grid3">
        <Link className="card hover" to="/novo-chamado"><h2>Abrir chamado</h2><p>Computador, internet, sistemas, impressora, e-mail e acessos.</p></Link>
        <Link className="card hover" to="/novo-chamado"><h2>Reportar erro</h2><p>Envie detalhes do problema e anexe prints para agilizar.</p></Link>
        <Link className="card hover" to="/historico"><h2>Histórico</h2><p>Acompanhe status, respostas e conversa do suporte.</p></Link>
      </section>

      {recentes.length > 0 && (
        <section className="recent-panel">
          <div className="section-title"><h2>Chamados recentes</h2><Link to={admin ? "/admin" : "/historico"}>Ver todos</Link></div>
          <div className="recent-list">
            {recentes.map((c) => (
              <Link key={c.id} to={`/chamado/${c.id}`} className="recent-item">
                <span className="number">#{String(c.numero || 0).padStart(4, "0")}</span>
                <strong>{c.titulo}</strong>
                <em className={`badge ${c.status?.replaceAll(" ", "-").toLowerCase()}`}>{c.status}</em>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
