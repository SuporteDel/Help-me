import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function cadastrar(e) {
    e.preventDefault(); setErro("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha);
      await updateProfile(cred.user, { displayName: nome });
      navigate("/");
    } catch {
      setErro("Erro ao criar conta. Use uma senha com pelo menos 6 caracteres.");
    }
  }

  return <main className="auth-page"><section className="auth-card">
    <span className="eyebrow">Novo acesso</span><h1>Criar conta</h1><p>Cadastre-se para abrir chamados.</p>
    {erro && <div className="alert error">{erro}</div>}
    <form onSubmit={cadastrar}>
      <input placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} required />
      <input type="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} required />
      <button className="btn full">Criar conta</button>
    </form>
    <p className="muted center">Já tem conta? <Link to="/login">Entrar</Link></p>
  </section></main>;
}
