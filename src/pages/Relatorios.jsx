import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { BarChart3, CalendarDays, CheckCircle2, Clock3, Download, FileText } from "lucide-react";

function getDate(data) {
  return data?.toDate ? data.toDate() : data ? new Date(data) : null;
}

function dentroPeriodo(data, periodo) {
  const dt = getDate(data);
  if (!dt) return false;
  const agora = new Date();
  const inicio = new Date(agora);
  if (periodo === "Diário") inicio.setHours(0, 0, 0, 0);
  if (periodo === "Semanal") inicio.setDate(agora.getDate() - 7);
  if (periodo === "Mensal") inicio.setMonth(agora.getMonth() - 1);
  return dt >= inicio && dt <= agora;
}

export default function Relatorios() {
  const [items, setItems] = useState([]);
  const [periodo, setPeriodo] = useState("Diário");

  useEffect(() => {
    return onSnapshot(collection(db, "chamados"), (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const dados = useMemo(() => {
    const base = items.filter((c) => dentroPeriodo(c.criadoEm, periodo));
    const resolvidos = base.filter((c) => c.status === "Resolvido");
    const abertos = base.filter((c) => c.status === "Aberto");
    const andamento = base.filter((c) => c.status === "Em andamento");
    const urgentes = base.filter((c) => c.prioridade === "Urgente");
    const categorias = base.reduce((acc, c) => {
      const key = c.categoria || "Sem categoria";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return { base, resolvidos, abertos, andamento, urgentes, categorias };
  }, [items, periodo]);

  function baixarCSV() {
    const linhas = ["numero,titulo,status,prioridade,categoria,usuario,email"];
    dados.base.forEach((c) => linhas.push([
      c.numero || "",
      `"${String(c.titulo || "").replaceAll('"', '""')}"`,
      c.status || "",
      c.prioridade || "",
      c.categoria || "",
      `"${String(c.userName || "").replaceAll('"', '""')}"`,
      c.userEmail || ""
    ].join(",")));
    const blob = new Blob([linhas.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-${periodo.toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="container">
      <section className="admin-head report-head">
        <span className="eyebrow">Relatórios</span>
        <h1><BarChart3 size={38}/> Relatórios de chamados</h1>
        <p>Resumo diário, semanal e mensal dos atendimentos, pendências e chamados resolvidos.</p>
      </section>

      <section className="toolbar">
        <div className="filterbox"><CalendarDays size={18}/><select value={periodo} onChange={(e) => setPeriodo(e.target.value)}><option>Diário</option><option>Semanal</option><option>Mensal</option></select></div>
        <button className="btn" onClick={baixarCSV}><Download size={16}/> Baixar CSV</button>
      </section>

      <section className="stats stats-five">
        <div className="stat"><FileText/><span>{dados.base.length}</span><p>Total</p></div>
        <div className="stat"><Clock3/><span>{dados.abertos.length}</span><p>Abertos</p></div>
        <div className="stat"><Clock3/><span>{dados.andamento.length}</span><p>Em andamento</p></div>
        <div className="stat"><CheckCircle2/><span>{dados.resolvidos.length}</span><p>Resolvidos</p></div>
        <div className="stat"><span>{dados.urgentes.length}</span><p>Urgentes</p></div>
      </section>

      <section className="report-grid">
        <div className="panel">
          <h2>Chamados por categoria</h2>
          <div className="bar-list">
            {Object.entries(dados.categorias).length === 0 && <p>Nenhum chamado no período.</p>}
            {Object.entries(dados.categorias).map(([cat, total]) => (
              <div className="bar-row" key={cat}><span>{cat}</span><strong>{total}</strong><div><i style={{ width: `${Math.max(8, (total / Math.max(1, dados.base.length)) * 100)}%` }} /></div></div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>Atendimentos recentes</h2>
          <div className="recent-list">
            {dados.base.slice(0, 8).map((c) => <div className="recent-item" key={c.id}><span className="number">#{String(c.numero || 0).padStart(4, "0")}</span><span>{c.titulo}</span><span className={`badge ${c.status?.replaceAll(" ", "-").toLowerCase()}`}>{c.status}</span></div>)}
            {dados.base.length === 0 && <p>Nenhum atendimento no período.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
