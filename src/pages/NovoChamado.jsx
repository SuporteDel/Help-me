import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { UploadCloud } from "lucide-react";

export default function NovoChamado({ user, appConfig }) {
  const categorias = appConfig?.categorias?.length ? appConfig.categorias : ["Computador", "Monitor", "Internet", "Sistema", "Impressora", "Acesso", "Outro"];
  const prioridades = appConfig?.prioridades?.length ? appConfig.prioridades : ["Baixa", "Média", "Alta", "Urgente"];
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState(categorias[0]);
  const [prioridade, setPrioridade] = useState(prioridades.includes("Média") ? "Média" : prioridades[0]);
  const [descricao, setDescricao] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function arquivoParaBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const tamanhoMaximo = 700 * 1024;
      if (file.size > tamanhoMaximo) {
        reject(new Error("Arquivo muito grande. Envie uma imagem com no máximo 700KB."));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve({ nome: file.name, tipo: file.type, tamanho: file.size, base64: reader.result });
      reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
      reader.readAsDataURL(file);
    });
  }

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const anexo = await arquivoParaBase64(arquivo);
      const novoId = await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, "counters", "chamados");
        const counterSnap = await transaction.get(counterRef);
        const atual = counterSnap.exists() ? counterSnap.data().ultimoNumero : 0;
        const proximo = atual + 1;
        transaction.set(counterRef, { ultimoNumero: proximo }, { merge: true });
        const chamadoRef = doc(collection(db, "chamados"));
        transaction.set(chamadoRef, {
          numero: proximo,
          titulo,
          categoria,
          prioridade,
          descricao,
          status: "Aberto",
          resposta: "",
          userId: user.uid,
          userName: user.displayName || "Usuário",
          userEmail: user.email,
          anexoNome: anexo?.nome || "",
          anexoTipo: anexo?.tipo || "",
          anexoBase64: anexo?.base64 || "",
          notifiedAdmin: true,
          notifiedUser: false,
          mensagens: [{ texto: descricao, autor: user.displayName || user.email, email: user.email, admin: false, data: new Date().toISOString() }],
          criadoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp()
        });
        return chamadoRef.id;
      });
      navigate(`/chamado/${novoId}`);
    } catch (err) {
      console.error(err);
      setErro(err.message || "Erro ao abrir chamado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container narrow">
      <section className="panel panel-form">
        <span className="eyebrow">Solicitação</span>
        <h1>Novo chamado</h1>
        <p>Descreva o problema e envie um print pequeno, caso tenha.</p>
        {erro && <div className="alert error">{erro}</div>}
        <form onSubmit={enviar} className="form">
          <input placeholder="Título do problema" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
          <div className="row">
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {categorias.map((cat) => <option key={cat}>{cat}</option>)}
            </select>
            <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
              {prioridades.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <textarea placeholder="Descreva o erro com detalhes" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
          <label className="upload upload-pro">
            <UploadCloud size={22}/>
            <span>Anexo / print do erro</span>
            <small>{arquivo ? arquivo.name : "JPG, PNG ou WEBP até 700KB. Não usa Firebase Storage."}</small>
            <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => setArquivo(e.target.files[0])} />
          </label>
          <button className="btn" disabled={loading}>{loading ? "Enviando..." : "Enviar chamado"}</button>
        </form>
      </section>
    </main>
  );
}
