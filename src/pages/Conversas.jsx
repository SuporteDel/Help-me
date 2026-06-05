import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { MessageCircle, Search } from "lucide-react";

function ultimaMensagem(c) {
  const msgs = c.mensagens || [];
  return msgs[msgs.length - 1];
}

export default function Conversas({ user, isAdmin }) {
  const [items, setItems] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const ref = isAdmin ? collection(db, "chamados") : query(collection(db, "chamados"), where("userId", "==", user.uid));
    return onSnapshot(ref, (snap) => {
      const dados = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          const da = a.atualizadoEm?.toDate?.() || a.criadoEm?.toDate?.() || new Date(0);
          const dbb = b.atualizadoEm?.toDate?.() || b.criadoEm?.toDate?.() || new Date(0);
          return dbb - da;
        });
      setItems(dados);
    });
  }, [user.uid, isAdmin]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return items.filter((c) => {
      const u = ultimaMensagem(c);
      const texto = `${c.numero || ""} ${c.titulo || ""} ${c.userName || ""} ${c.userEmail || ""} ${u?.texto || ""}`.toLowerCase();
      return !termo || texto.includes(termo);
    });
  }, [items, busca]);

  return (
    <main className="container">
      <section className="page-title">
        <span className="eyebrow">Mensagens</span>
        <h1>Conversas dos chamados</h1>
        <p>Veja todas as conversas em andamento e responda rapidamente.</p>
      </section>

      <section className="toolbar one">
        <div className="searchbox"><Search size={18}/><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar conversa..." /></div>
      </section>

      <div className="conversation-grid">
        {filtrados.length === 0 && <div className="empty">Nenhuma conversa encontrada.</div>}
        {filtrados.map((c) => {
          const ultima = ultimaMensagem(c);
          const nova = isAdmin ? c.notifiedAdmin : c.notifiedUser;
          return (
            <Link to={`/chamado/${c.id}`} className={`conversation-card ${nova ? "unread" : ""}`} key={c.id}>
              <div className="conversation-icon"><MessageCircle size={20}/></div>
              <div>
                <div className="ticket-line"><span className="number">#{String(c.numero || 0).padStart(4, "0")}</span>{nova && <span className="new-pill">Nova</span>}</div>
                <h2>{c.titulo}</h2>
                <p>{ultima?.texto || c.descricao}</p>
                <small>{isAdmin ? `${c.userName || "Usuário"} • ${c.userEmail || "Sem e-mail"}` : c.status}</small>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
