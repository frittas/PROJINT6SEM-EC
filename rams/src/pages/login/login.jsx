import './login.css';
import React, { useState } from 'react';
import { FaUser, FaLock } from "react-icons/fa";
import { Navigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Importar Firebase Auth

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Login com Firebase
      await signInWithEmailAndPassword(auth, email, password);
      setShouldRedirect(true); // Redireciona para o dashboard se o login for bem-sucedido
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErrorMessage('Falha ao autenticar. Verifique seu email e senha.');
    }
  };

  if (shouldRedirect) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="login">
      <div className="wrapper"> {/* Container Principal da Página de Login */}
        <form onSubmit={handleSubmit}>

          {/* Cabeçalho do sistema */}
          <div className="form-header">
            <img src="/RAMSLogo.ico" alt="Logo" className="logo-image" />
            <div className="text-container">
              <h1 className="logo-text">RAMS</h1>
              <h2 className="subtitle">Risk Area Monitoring System</h2>
            </div>
          </div>

          {/* Campo de Usuário */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>

          {/* Campo de Senha */}
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>

          {/* Lembrete e link de senha esquecida */}
          <div className="options">
            <label>
              <input type="checkbox" /> Lembrar-Me
            </label>
            <a href="#" className="forgot-password">Esqueci Minha Senha</a> {/* INSERIR LINK */}
          </div>

          {/* Botão de login */}
          <button type="submit" className="btn-login">Login</button>

          {/* Link de registro */}
          <div className="register-link">
            <p>
              Não tem uma conta? <a href="#">Clique Aqui!</a>
            </p>
          </div>
        </form>
      </div>
    </div>
);

};

export default Login;
