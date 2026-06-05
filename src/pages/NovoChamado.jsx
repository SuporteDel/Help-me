import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar.jsx';

export default function NovoChamado() {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Suporte técnico');
  const [prioridade, setPrioridade] = useState('Média');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function salvarChamado(e) {
    e.preventDefault();
    setErro('');

    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addDoc(collection(db, 'chamados'), {
        titulo,
        categoria,
        prioridade,
        descricao,
        status: 'Aberto',
        resposta: '',
        userId: user.uid,
        usuarioNome: user.displayName || 'Usuário',
        usuarioEmail: user.email,
        criadoEm: serverTimestamp()
      });
      navigate('/historico');
    } catch {
      setErro('Erro ao abrir chamado. Confira o Firebase.');
    }
  }

  return (
    <>
      <Navbar />
      <main className="container narrow">
        <div className="panel">
          <h1>Novo Chamado</h1>
          <p>Preencha os dados abaixo para solicitar atendimento.</p>
          {erro && <div className="erro">{erro}</div>}
          <form onSubmit={salvarChamado} className="form-grid">
            <input placeholder="Título do problema" value={titulo} onChange={e => setTitulo(e.target.value)} required />
            <select value={categoria} onChange={e => setCategoria(e.target.value)}>
              <option>Suporte técnico</option>
              <option>Reportar erro</option>
              <option>Internet</option>
              <option>Computador</option>
              <option>Impressora</option>
              <option>Acesso / senha</option>
              <option>Sistema interno</option>
            </select>
            <select value={prioridade} onChange={e => setPrioridade(e.target.value)}>
              <option>Baixa</option>
              <option>Média</option>
              <option>Alta</option>
              <option>Urgente</option>
            </select>
            <textarea placeholder="Descreva o problema com detalhes" value={descricao} onChange={e => setDescricao(e.target.value)} required />
            <button className="primary">Enviar chamado</button>
          </form>
        </div>
      </main>
    </>
  );
}
