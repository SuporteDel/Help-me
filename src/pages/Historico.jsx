import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";

const pClass = p => `priority ${p?.toLowerCase()?.replace("é","e")}`;
export default function Historico({ user }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "chamados"), where("userId", "==", user.uid));
    return onSnapshot(q, snap => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b)=>(b.numero||0)-(a.numero||0))));
  }, [user.uid]);

  return <main className="container"><h1>Histórico de chamados</h1>
    {items.length === 0 && <div className="empty">Você ainda não abriu chamados.</div>}
    <div className="list">
      {items.map(c => <Link className="ticket" to={`/chamado/${c.id}`} key={c.id}>
        <div><span className="number">#{String(c.numero||0).padStart(4,"0")}</span><h2>{c.titulo}</h2><p>{c.descricao}</p><div className="meta"><span>{c.categoria}</span><span className={pClass(c.prioridade)}>{c.prioridade}</span>{c.anexoUrl && <span>Anexo</span>}</div></div>
        <span className={`badge ${c.status?.replaceAll(" ", "-").toLowerCase()}`}>{c.status}</span>
      </Link>)}
    </div>
  </main>;
}
