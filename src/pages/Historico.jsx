import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar.jsx';

export default function Historico() {
  const [chamados, setChamados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }

    const q = query(collection(db, 'chamados'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, snapshot => {
      setChamados(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <main className="container">
        <h1>Histórico de Chamados</h1>
        <div className="ticket-list">
          {chamados.length === 0 && <p className="empty">Nenhum chamado encontrado.</p>}
          {chamados.map(chamado => (
            <article className="ticket" key={chamado.id}>
              <div>
                <h2>{chamado.titulo}</h2>
                <p>{chamado.descricao}</p>
                {chamado.resposta && <p className="resposta">Resposta TI: {chamado.resposta}</p>}
              </div>
              <span className={`status ${chamado.status?.toLowerCase().replaceAll(' ', '-')}`}>{chamado.status}</span>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
