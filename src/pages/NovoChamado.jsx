import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

export default function NovoChamado({ user }) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Computador");
  const [prioridade, setPrioridade] = useState("Média");
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
        reject(
          new Error(
            "Arquivo muito grande. Envie uma imagem com no máximo 700KB."
          )
        );
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        resolve({
          nome: file.name,
          tipo: file.type,
          tamanho: file.size,
          base64: reader.result
        });
      };

      reader.onerror = () => {
        reject(new Error("Erro ao ler o arquivo."));
      };

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

        const atual = counterSnap.exists()
          ? counterSnap.data().ultimoNumero
          : 0;

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

          mensagens: [
            {
              texto: descricao,
              autor: user.displayName || user.email,
              email: user.email,
              data: new Date().toISOString()
            }
          ],

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
      <section className="panel">
        <span className="eyebrow">Solicitação</span>
        <h1>Novo chamado</h1>
        <p>Descreva o problema e envie um print, caso tenha.</p>

        {erro && <div className="alert error">{erro}</div>}

        <form onSubmit={enviar} className="form">
          <input
            placeholder="Título do problema"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <div className="row">
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option>Computador</option>
              <option>Monitor</option>
              <option>Internet</option>
              <option>Sistema</option>
              <option>Impressora</option>
              <option>Acesso</option>
              <option>Outro</option>
            </select>

            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
            >
              <option>Baixa</option>
              <option>Média</option>
              <option>Alta</option>
              <option>Urgente</option>
            </select>
          </div>

          <textarea
            placeholder="Descreva o erro com detalhes"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />

          <label className="upload">
            Anexo / print do erro
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => setArquivo(e.target.files[0])}
            />
            <small>Máximo 700KB. Use print em JPG, PNG ou WEBP.</small>
          </label>

          <button className="btn" disabled={loading}>
            {loading ? "Enviando..." : "Enviar chamado"}
          </button>
        </form>
      </section>
    </main>
  );
}
