import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { collection, doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Search, User, Mail, TimerReset, MessageSquare, Filter } from "lucide-react";

function tempoDesde(data) {
  if (!data) return "sem data";
  const dt = data?.toDate ? data.toDate() : new Date(data);
  const diff = Date.now() - dt.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d} dia${d > 1 ? "s" : ""}`;
}

function slaClass(data, status) {
  if (status === "Resolvido") return "sla-ok";
  const dt = data?.toDate ? data.toDate() : data ? new Date(data) : new Date();
  const horas = (Date.now() - dt.getTime()) / 3600000;
  if (horas >= 24) return "sla-danger";
  if (horas >= 2) return "sla-warn";
  return "sla-ok";
}

export default function Admin() {
  const [items, setItems] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    return onSnapshot(collection(db, "chamados"), (snap) => {
      const dados = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.numero || 0) - (a.numero || 0));
      setItems(dados);
    });
  }, []);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return items.filter((c) => {
      const passaStatus = filtro === "Todos" || c.status === filtro;
      const alvo = `${c.numero || ""} ${c.titulo || ""} ${c.descricao || ""} ${c.userName || ""} ${c.userEmail || ""} ${c.categoria || ""}`.toLowerCase();
      return passaStatus && (!termo || alvo.includes(termo));
    });
  }, [items, busca, filtro]);

  const counts = {
    aberto: items.filter((i) => i.status === "Aberto").length,
    andamento: items.filter((i) => i.status === "Em andamento").length,
    resolvido: items.filter((i) => i.status === "Resolvido").length,
    total: items.length
  };

  async function mudar(id, status) {
    await updateDoc(doc(db, "chamados", id), { status, atualizadoEm: serverTimestamp() });
  }

  return (
    <main className="container">
      <section className="admin-head">
        <span className="eyebrow">Restrito</span>
        <h1>Painel do TI</h1>
        <p>Gerencie chamados, status, SLA e conversa com usuários.</p>
      </section>

      <section className="stats stats-four">
        <div className="stat"><span>{counts.aberto}</span><p>Abertos</p></div>
        <div className="stat"><span>{counts.andamento}</span><p>Em andamento</p></div>
        <div className="stat"><span>{counts.resolvido}</span><p>Resolvidos</p></div>
        <div className="stat"><span>{counts.total}</span><p>Total</p></div>
      </section>

      <section className="toolbar">
        <div className="searchbox"><Search size={18}/><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por número, título, nome ou e-mail..." /></div>
        <div className="filterbox"><Filter size={18}/><select value={filtro} onChange={(e) => setFiltro(e.target.value)}><option>Todos</option><option>Aberto</option><option>Em andamento</option><option>Resolvido</option></select></div>
      </section>

      <div className="list admin-list">
        {filtrados.length === 0 && <div className="empty">Nenhum chamado encontrado.</div>}
        {filtrados.map((c) => (
          <article className="ticket admin-ticket" key={c.id}>
            <div className="ticket-main">
              <div className="ticket-line"><span className="number">#{String(c.numero || 0).padStart(4, "0")}</span><span className={`sla ${slaClass(c.criadoEm, c.status)}`}><TimerReset size={14}/> aberto há {tempoDesde(c.criadoEm)}</span></div>
              <h2>{c.titulo}</h2>
              <p>{c.descricao}</p>
              <div className="meta meta-clean">
                <span><User size={14}/> {c.userName || "Usuário"}</span>
                <span><Mail size={14}/> {c.userEmail || "Sem e-mail"}</span>
                <span>{c.categoria}</span>
                <span className="priority">{c.prioridade}</span>
              </div>
              {c.anexoBase64 && <a className="attachment tiny" href={c.anexoBase64} target="_blank" rel="noreferrer">📎 Ver print anexado</a>}
            </div>
            <div className="actions admin-actions">
              <select value={c.status} onChange={(e) => mudar(c.id, e.target.value)}>
                <option>Aberto</option><option>Em andamento</option><option>Resolvido</option>
              </select>
              <Link className="btn ghost" to={`/chamado/${c.id}`}><MessageSquare size={16}/> Abrir chat</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
