import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Filter, Paperclip, Search } from "lucide-react";

export default function Historico({ user }) {
  const [items, setItems] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const q = query(collection(db, "chamados"), where("userId", "==", user.uid));
    return onSnapshot(q, (snap) => {
      const dados = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.numero || 0) - (a.numero || 0));
      setItems(dados);
    });
  }, [user.uid]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return items.filter((c) => {
      const statusOk = filtro === "Todos" || c.status === filtro;
      const texto = `${c.numero || ""} ${c.titulo || ""} ${c.descricao || ""} ${c.categoria || ""}`.toLowerCase();
      return statusOk && (!termo || texto.includes(termo));
    });
  }, [items, filtro, busca]);

  return (
    <main className="container">
      <section className="page-title">
        <span className="eyebrow">Meus tickets</span>
        <h1>Histórico de chamados</h1>
        <p>Acompanhe protocolos, status, mensagens e prints enviados.</p>
      </section>

      <section className="toolbar">
        <div className="searchbox"><Search size={18}/><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar no histórico..." /></div>
        <div className="filterbox"><Filter size={18}/><select value={filtro} onChange={(e) => setFiltro(e.target.value)}><option>Todos</option><option>Aberto</option><option>Em andamento</option><option>Resolvido</option></select></div>
      </section>

      <div className="list">
        {filtrados.length === 0 && <div className="empty">Nenhum chamado encontrado.</div>}
        {filtrados.map((c) => (
          <Link to={`/chamado/${c.id}`} className="ticket" key={c.id}>
            <div>
              <div className="ticket-line"><span className="number">#{String(c.numero || 0).padStart(4, "0")}</span>{c.notifiedUser && <span className="new-pill">Nova resposta</span>}</div>
              <h2>{c.titulo}</h2>
              <p>{c.descricao}</p>
              <div className="meta"><span>{c.categoria}</span><span className="priority">{c.prioridade}</span>{c.anexoBase64 && <span><Paperclip size={13}/> Anexo</span>}</div>
            </div>
            <span className={`badge ${c.status?.replaceAll(" ", "-").toLowerCase()}`}>{c.status}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
