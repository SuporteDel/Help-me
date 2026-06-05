import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Send, Paperclip, UserRound, ShieldCheck, BellRing } from "lucide-react";

function formatarData(data) {
  if (!data) return "";
  const dt = data?.toDate ? data.toDate() : new Date(data);
  return dt.toLocaleString("pt-BR");
}

export default function ChamadoDetalhe({ user, isAdmin }) {
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    return onSnapshot(doc(db, "chamados", id), async (snap) => {
      if (!snap.exists()) return setC(null);
      const dados = { id: snap.id, ...snap.data() };
      setC(dados);
      if (user?.uid) {
        if (isAdmin && dados.notifiedAdmin) await updateDoc(doc(db, "chamados", id), { notifiedAdmin: false });
        if (!isAdmin && dados.notifiedUser) await updateDoc(doc(db, "chamados", id), { notifiedUser: false });
      }
    });
  }, [id, user?.uid, isAdmin]);

  if (!c) return <main className="container"><div className="loading">Carregando chamado...</div></main>;

  async function enviar(e) {
    e.preventDefault();
    if (!msg.trim()) return;
    const mensagens = [
      ...(c.mensagens || []),
      {
        texto: msg.trim(),
        autor: isAdmin ? "Suporte TI" : (user.displayName || user.email),
        email: user.email,
        admin: isAdmin,
        data: new Date().toISOString()
      }
    ];
    await updateDoc(doc(db, "chamados", id), {
      mensagens,
      atualizadoEm: serverTimestamp(),
      ...(isAdmin ? { resposta: msg.trim(), status: c.status === "Aberto" ? "Em andamento" : c.status, notifiedUser: true } : { notifiedAdmin: true })
    });
    setMsg("");
  }

  async function status(s) {
    await updateDoc(doc(db, "chamados", id), { status: s, atualizadoEm: serverTimestamp(), ...(isAdmin ? { notifiedUser: true } : {}) });
  }

  return (
    <main className="container narrow">
      <section className="panel detail detail-pro">
        <div className="detail-top">
          <div>
            <span className="number">#{String(c.numero || 0).padStart(4, "0")}</span>
            <h1>{c.titulo}</h1>
            <p>{c.categoria} • {c.prioridade} • {c.userEmail}</p>
          </div>
          <span className={`badge ${c.status?.replaceAll(" ", "-").toLowerCase()}`}>{c.status}</span>
        </div>

        <div className="detail-info">
          <span>Criado em: {formatarData(c.criadoEm)}</span>
          <span>Atualizado em: {formatarData(c.atualizadoEm)}</span>
          {(c.notifiedUser || c.notifiedAdmin) && <span><BellRing size={14}/> Nova atualização pendente</span>}
        </div>

        {isAdmin && (
          <select className="status-select" value={c.status} onChange={(e) => status(e.target.value)}>
            <option>Aberto</option><option>Em andamento</option><option>Resolvido</option>
          </select>
        )}

        {c.anexoBase64 && (
          <a className="attachment" target="_blank" rel="noreferrer" href={c.anexoBase64}>
            <Paperclip size={16}/> Abrir anexo: {c.anexoNome || "print do erro"}
          </a>
        )}

        <div className="chat chat-pro">
          {(c.mensagens || []).map((m, i) => (
            <div className={`message-row ${m.admin ? "from-admin" : "from-user"}`} key={i}>
              <div className={`avatar ${m.admin ? "admin-avatar" : ""}`}>{m.admin ? <ShieldCheck size={16}/> : <UserRound size={16}/>}</div>
              <div className={`bubble ${m.admin ? "admin" : "user"}`}>
                <strong>{m.autor}</strong>
                <p>{m.texto}</p>
                <small>{new Date(m.data).toLocaleString("pt-BR")}</small>
              </div>
            </div>
          ))}
        </div>

        <form className="chat-form" onSubmit={enviar}>
          <input placeholder="Digite sua mensagem..." value={msg} onChange={(e) => setMsg(e.target.value)} />
          <button className="btn"><Send size={16}/> Enviar</button>
        </form>
      </section>
    </main>
  );
}
