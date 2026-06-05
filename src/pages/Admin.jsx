import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar.jsx';
import { db } from '../firebase';

export default function Admin() {
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'chamados'), snapshot => {
      setChamados(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  async function atualizar(id, campo, valor) {
    await updateDoc(doc(db, 'chamados', id), { [campo]: valor });
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <h1>Painel do TI</h1>
        <p className="muted">Aqui o administrador visualiza e responde todos os chamados.</p>
        <div className="ticket-list">
          {chamados.map(chamado => (
            <article className="ticket admin-ticket" key={chamado.id}>
              <div>
                <h2>{chamado.titulo}</h2>
                <p>{chamado.descricao}</p>
                <small>{chamado.usuarioNome} — {chamado.usuarioEmail}</small>
                <textarea
                  placeholder="Responder chamado"
                  defaultValue={chamado.resposta}
                  onBlur={e => atualizar(chamado.id, 'resposta', e.target.value)}
                />
              </div>
              <select value={chamado.status} onChange={e => atualizar(chamado.id, 'status', e.target.value)}>
                <option>Aberto</option>
                <option>Em andamento</option>
                <option>Resolvido</option>
              </select>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
