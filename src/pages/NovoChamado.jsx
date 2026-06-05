import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

export default function NovoChamado({ user }) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Computador");
  const [prioridade, setPrioridade] = useState("Média");
  const [descricao, setDescricao] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function enviar(e) {
    e.preventDefault(); setErro(""); setLoading(true);
    try {
      let anexoUrl = "", anexoNome = "";
      if (arquivo) {
        const safeName = arquivo.name.replaceAll(" ", "-");
        const fileRef = ref(storage, `chamados/${user.uid}/${Date.now()}-${safeName}`);
        await uploadBytes(fileRef, arquivo);
        anexoUrl = await getDownloadURL(fileRef);
        anexoNome = arquivo.name;
      }
      const novoId = await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, "counters", "chamados");
        const counterSnap = await transaction.get(counterRef);
        const atual = counterSnap.exists() ? counterSnap.data().ultimoNumero : 0;
        const proximo = atual + 1;
        transaction.set(counterRef, { ultimoNumero: proximo }, { merge: true });
        const chamadoRef = doc(collection(db, "chamados"));
        transaction.set(chamadoRef, {
          numero: proximo,
          titulo, categoria, prioridade, descricao,
          status: "Aberto",
          resposta: "",
          userId: user.uid,
          userName: user.displayName || "Usuário",
          userEmail: user.email,
          anexoUrl, anexoNome,
          mensagens: [{ texto: descricao, autor: user.displayName || user.email, email: user.email, data: new Date().toISOString() }],
          criadoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp()
        });
        return chamadoRef.id;
      });
      navigate(`/chamado/${novoId}`);
    } catch (err) {
      console.error(err);
      setErro("Erro ao abrir chamado. Verifique Firestore, Storage e regras.");
    } finally { setLoading(false); }
  }

  return <main className="container narrow"><section className="panel">
    <span className="eyebrow">Solicitação</span><h1>Novo chamado</h1><p>Descreva o problema e envie um print, caso tenha.</p>
    {erro && <div className="alert error">{erro}</div>}
    <form onSubmit={enviar} className="form">
      <input placeholder="Título do problema" value={titulo} onChange={e=>setTitulo(e.target.value)} required />
      <div className="row"><select value={categoria} onChange={e=>setCategoria(e.target.value)}><option>Computador</option><option>Monitor</option><option>Internet</option><option>Sistema</option><option>Impressora</option><option>Acesso</option><option>Outro</option></select><select value={prioridade} onChange={e=>setPrioridade(e.target.value)}><option>Baixa</option><option>Média</option><option>Alta</option><option>Urgente</option></select></div>
      <textarea placeholder="Descreva o erro com detalhes" value={descricao} onChange={e=>setDescricao(e.target.value)} required />
      <label className="upload">Anexo / print do erro <input type="file" onChange={e=>setArquivo(e.target.files[0])} /></label>
      <button className="btn" disabled={loading}>{loading ? "Enviando..." : "Enviar chamado"}</button>
    </form>
  </section></main>;
}
