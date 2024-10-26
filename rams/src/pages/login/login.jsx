import './login.css';
import React, { useState } from 'react';
import { FaUser, FaLock } from "react-icons/fa";
import { Navigate } from 'react-router-dom'; // Importar Navigate

const Login = () => {
  const [username, setUsername] = useState(''); // Variavel de Username
  const [password, setPassword] = useState(''); // Variavel de Senha
  const [shouldRedirect, setShouldRedirect] = useState(false); // Estado para controle de redirecionamento

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir o comportamento padrão de recarregar a página

    // Enviar os dados para o backend
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Enviar os dados do formulário como JSON
      });

      const data = await response.json();
      if (response.ok) {
        // Define o estado para redirecionar
        setShouldRedirect(true);
      } else {
        alert('Erro: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };

  // Verifica se deve redirecionar
  if (shouldRedirect) {
    return <Navigate to="/dashboard" />; // Usando Navigate para redirecionar
  }

  return (
    <body className="login">
      <div className="wrapper"> {/*Container Principal da Pagina de Login*/}
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <a href="#" className="forgot-password">Esqueci Minha Senha</a> {/*INSERIR LINK*/}
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
    </body>
  );
}

export default Login;
