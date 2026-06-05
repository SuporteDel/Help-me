import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function Admin() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    return onSnapshot(collection(db, "chamados"), snap => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b)=>(b.numero||0)-(a.numero||0))));
  }, []);
  const counts = { aberto: items.filter(i=>i.status==="Aberto").length, andamento: items.filter(i=>i.status==="Em andamento").length, resolvido: items.filter(i=>i.status==="Resolvido").length };
  async function mudar(id, status) { await updateDoc(doc(db, "chamados", id), { status, atualizadoEm: serverTimestamp() }); }

  return <main className="container"><section className="admin-head"><div><span className="eyebrow">Restrito</span><h1>Painel do TI</h1><p>Gerencie chamados, status e conversa com usuários.</p></div></section>
    <section className="stats"><div className="stat"><span>{counts.aberto}</span><p>Abertos</p></div><div className="stat"><span>{counts.andamento}</span><p>Em andamento</p></div><div className="stat"><span>{counts.resolvido}</span><p>Resolvidos</p></div></section>
    <div className="list">
      {items.map(c => <div className="ticket admin-ticket" key={c.id}>
        <div><span className="number">#{String(c.numero||0).padStart(4,"0")}</span><h2>{c.titulo}</h2><p>{c.descricao}</p><div className="meta"><span>{c.userName} — {c.userEmail}</span><span>{c.categoria}</span><span>{c.prioridade}</span></div></div>
        <div className="actions"><select value={c.status} onChange={e=>mudar(c.id,e.target.value)}><option>Aberto</option><option>Em andamento</option><option>Resolvido</option></select><Link className="btn ghost" to={`/chamado/${c.id}`}>Abrir chat</Link></div>
      </div>)}
    </div>
  </main>;
}
