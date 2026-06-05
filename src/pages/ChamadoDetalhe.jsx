import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { isAdminEmail } from "../config";

export default function ChamadoDetalhe({ user }) {
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(() => onSnapshot(doc(db, "chamados", id), snap => setC({ id: snap.id, ...snap.data() })), [id]);
  if (!c) return <main className="container">Carregando...</main>;
  const admin = isAdminEmail(user.email);
  async function enviar(e) {
    e.preventDefault(); if (!msg.trim()) return;
    const mensagens = [...(c.mensagens || []), { texto: msg, autor: user.displayName || user.email, email: user.email, admin, data: new Date().toISOString() }];
    await updateDoc(doc(db, "chamados", id), { mensagens, atualizadoEm: serverTimestamp(), ...(admin ? { resposta: msg } : {}) });
    setMsg("");
  }
  async function status(s) { await updateDoc(doc(db, "chamados", id), { status: s, atualizadoEm: serverTimestamp() }); }

  return <main className="container narrow"><section className="panel detail">
    <div className="detail-top"><div><span className="number">#{String(c.numero||0).padStart(4,"0")}</span><h1>{c.titulo}</h1><p>{c.categoria} • {c.prioridade} • {c.userEmail}</p></div><span className={`badge ${c.status?.replaceAll(" ", "-").toLowerCase()}`}>{c.status}</span></div>
    {admin && <select className="status-select" value={c.status} onChange={e=>status(e.target.value)}><option>Aberto</option><option>Em andamento</option><option>Resolvido</option></select>}
    {c.anexoUrl && <a className="attachment" target="_blank" href={c.anexoUrl}>📎 Abrir anexo: {c.anexoNome}</a>}
    <div className="chat">
      {(c.mensagens || []).map((m, i) => <div className={`bubble ${m.admin ? "admin" : "user"}`} key={i}><strong>{m.autor}</strong><p>{m.texto}</p><small>{new Date(m.data).toLocaleString("pt-BR")}</small></div>)}
    </div>
    <form className="chat-form" onSubmit={enviar}><input placeholder="Digite sua mensagem..." value={msg} onChange={e=>setMsg(e.target.value)} /><button className="btn">Enviar</button></form>
  </section></main>;
}
