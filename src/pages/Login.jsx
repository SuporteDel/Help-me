import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function entrar(e) {
    e.preventDefault();
    setErro('');
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate('/dashboard');
    } catch {
      setErro('E-mail ou senha inválidos.');
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={entrar}>
        <h1>Sistema de Chamados</h1>
        <p>Entre para abrir ou acompanhar seus chamados de TI.</p>
        {erro && <div className="erro">{erro}</div>}
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
        <button className="primary">Entrar</button>
        <span>Não tem conta? <Link to="/cadastro">Criar conta</Link></span>
      </form>
    </main>
  );
}
