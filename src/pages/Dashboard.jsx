import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock3, PlusCircle } from "lucide-react";

export default function Dashboard({ user, isAdmin, appConfig }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = isAdmin ? collection(db, "chamados") : query(collection(db, "chamados"), where("userId", "==", user.uid));
    return onSnapshot(q, (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, [user.uid, isAdmin]);

  const abertos = items.filter((i) => i.status === "Aberto").length;
  const andamento = items.filter((i) => i.status === "Em andamento").length;
  const resolvidos = items.filter((i) => i.status === "Resolvido").length;

  return (
    <main className="container">
      <section className="hero">
        <div>
          <span className="eyebrow">Central Premium</span>
          <h1>Olá, {user.displayName || "Fhellype"}</h1>
          <p>{isAdmin ? `Painel geral do ${appConfig?.companyName || "Help-me TI"}.` : "Abra chamados, envie anexos e converse com o TI em tempo real."}</p>
          {isAdmin && <span className="admin-chip">Modo administrador ativo</span>}
        </div>
        <Link className="btn hero-btn" to="/novo-chamado"><PlusCircle size={18}/> Novo chamado</Link>
      </section>

      <section className="stats">
        <div className="stat"><AlertCircle/><span>{abertos}</span><p>Abertos</p></div>
        <div className="stat"><Clock3/><span>{andamento}</span><p>Em andamento</p></div>
        <div className="stat"><CheckCircle2/><span>{resolvidos}</span><p>Resolvidos</p></div>
      </section>

      <section className="grid3">
        <Link className="card hover" to="/novo-chamado"><h2>Abrir chamado</h2><p>Computador, internet, sistemas, impressora, e-mail e acessos.</p></Link>
        <Link className="card hover" to="/conversas"><h2>Conversas</h2><p>Acompanhe respostas, notificações e troca de mensagens do suporte.</p></Link>
        <Link className="card hover" to={isAdmin ? "/admin" : "/historico"}><h2>{isAdmin ? "Painel do TI" : "Histórico"}</h2><p>{isAdmin ? "Filtre, responda, conclua e exclua chamados." : "Acompanhe status, respostas e conversa do suporte."}</p></Link>
      </section>
    </main>
  );
}
