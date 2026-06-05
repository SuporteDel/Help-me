import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function cadastrar(e) {
    e.preventDefault();
    setErro('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      await updateProfile(userCredential.user, { displayName: nome });
      navigate('/dashboard');
    } catch {
      setErro('Erro ao criar conta. Use uma senha com pelo menos 6 caracteres.');
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={cadastrar}>
        <h1>Criar Conta</h1>
        <p>Cadastre-se para solicitar suporte técnico.</p>
        {erro && <div className="erro">{erro}</div>}
        <input placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)} required />
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
        <button className="primary">Cadastrar</button>
        <span>Já tem conta? <Link to="/login">Entrar</Link></span>
      </form>
    </main>
  );
}
