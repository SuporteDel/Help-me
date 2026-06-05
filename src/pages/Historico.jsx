import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Paperclip } from "lucide-react";

export default function Historico({ user }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "chamados"), where("userId", "==", user.uid));
    return onSnapshot(q, (snap) => {
      const dados = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.numero || 0) - (a.numero || 0));
      setItems(dados);
    });
  }, [user.uid]);

  return (
    <main className="container">
      <section className="page-title">
        <span className="eyebrow">Meus tickets</span>
        <h1>Histórico de chamados</h1>
        <p>Acompanhe protocolos, status, mensagens e prints enviados.</p>
      </section>
      <div className="list">
        {items.length === 0 && <div className="empty">Você ainda não abriu nenhum chamado.</div>}
        {items.map((c) => (
          <Link to={`/chamado/${c.id}`} className="ticket" key={c.id}>
            <div>
              <span className="number">#{String(c.numero || 0).padStart(4, "0")}</span>
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
