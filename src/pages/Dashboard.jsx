import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock3, PlusCircle } from "lucide-react";

export default function Dashboard({ user }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "chamados"), where("userId", "==", user.uid));
    return onSnapshot(q, snap => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [user.uid]);
  const abertos = items.filter(i => i.status === "Aberto").length;
  const andamento = items.filter(i => i.status === "Em andamento").length;
  const resolvidos = items.filter(i => i.status === "Resolvido").length;

  return <main className="container">
    <section className="hero">
      <div><span className="eyebrow">Central Premium</span><h1>Olá, {user.displayName || "usuário"}</h1><p>Abra chamados, envie anexos e converse com o TI em tempo real.</p></div>
      <Link className="btn" to="/novo-chamado"><PlusCircle size={18}/> Novo chamado</Link>
    </section>
    <section className="stats">
      <div className="stat"><AlertCircle/><span>{abertos}</span><p>Abertos</p></div>
      <div className="stat"><Clock3/><span>{andamento}</span><p>Em andamento</p></div>
      <div className="stat"><CheckCircle2/><span>{resolvidos}</span><p>Resolvidos</p></div>
    </section>
    <section className="grid3">
      <Link className="card hover" to="/novo-chamado"><h2>Abrir chamado</h2><p>Computador, internet, sistemas, impressora, e-mail e acessos.</p></Link>
      <Link className="card hover" to="/novo-chamado"><h2>Reportar erro</h2><p>Envie detalhes do problema e anexe prints para agilizar.</p></Link>
      <Link className="card hover" to="/historico"><h2>Histórico</h2><p>Acompanhe status, respostas e conversa do suporte.</p></Link>
    </section>
  </main>;
}
