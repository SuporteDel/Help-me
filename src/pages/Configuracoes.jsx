import { useEffect, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { normalizarLista } from "../config";
import { Save, Settings } from "lucide-react";

export default function Configuracoes({ appConfig }) {
  const [companyName, setCompanyName] = useState(appConfig.companyName || "Help-me TI");
  const [adminEmails, setAdminEmails] = useState((appConfig.adminEmails || []).join("\n"));
  const [categorias, setCategorias] = useState((appConfig.categorias || []).join("\n"));
  const [prioridades, setPrioridades] = useState((appConfig.prioridades || []).join("\n"));
  const [salvando, setSalvando] = useState(false);
  const [ok, setOk] = useState("");

  useEffect(() => {
    setCompanyName(appConfig.companyName || "Help-me TI");
    setAdminEmails((appConfig.adminEmails || []).join("\n"));
    setCategorias((appConfig.categorias || []).join("\n"));
    setPrioridades((appConfig.prioridades || []).join("\n"));
  }, [appConfig]);

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    setOk("");
    await setDoc(doc(db, "config", "app"), {
      companyName: companyName.trim() || "Help-me TI",
      adminEmails: normalizarLista(adminEmails, appConfig.adminEmails).map((e) => e.toLowerCase()).slice(0, 5),
      categorias: normalizarLista(categorias, appConfig.categorias),
      prioridades: normalizarLista(prioridades, appConfig.prioridades),
      atualizadoEm: serverTimestamp()
    }, { merge: true });
    setSalvando(false);
    setOk("Configurações salvas com sucesso.");
  }

  return (
    <main className="container narrow">
      <section className="panel panel-form">
        <span className="eyebrow">Sistema</span>
        <h1><Settings size={34}/> Configurações</h1>
        <p>Altere dados do sistema sem mexer no código. Administradores são limitados a 5 e-mails.</p>
        {ok && <div className="alert success">{ok}</div>}
        <form className="form" onSubmit={salvar}>
          <label>Nome do sistema / empresa<input value={companyName} onChange={(e) => setCompanyName(e.target.value)} /></label>
          <label>Administradores, um por linha<textarea value={adminEmails} onChange={(e) => setAdminEmails(e.target.value)} /></label>
          <label>Categorias, uma por linha<textarea value={categorias} onChange={(e) => setCategorias(e.target.value)} /></label>
          <label>Prioridades, uma por linha<textarea value={prioridades} onChange={(e) => setPrioridades(e.target.value)} /></label>
          <button className="btn" disabled={salvando}><Save size={16}/> {salvando ? "Salvando..." : "Salvar configurações"}</button>
        </form>
      </section>
    </main>
  );
}
