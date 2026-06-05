import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/");
    } catch {
      setErro("E-mail ou senha inválidos.");
    }
  }

  return <main className="auth-page"><section className="auth-card">
    <span className="eyebrow">Help Desk</span><h1>Entrar</h1><p>Acesse sua central de suporte.</p>
    {erro && <div className="alert error">{erro}</div>}
    <form onSubmit={entrar}>
      <input type="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} required />
      <button className="btn full">Entrar</button>
    </form>
    <p className="muted center">Não tem conta? <Link to="/cadastro">Criar conta</Link></p>
  </section></main>;
}
