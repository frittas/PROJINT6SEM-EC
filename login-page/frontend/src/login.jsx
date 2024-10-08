import React, { useState } from 'react';
import './login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Navigate } from 'react-router-dom'; // Importar Navigate

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <body className='login'>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className='input-box'>
            <input
              type="text"
              placeholder='Username'
              value={username} // Controlar o valor com estado
              onChange={(e) => setUsername(e.target.value)} // Atualizar o estado quando o usuário digitar
              required
            />
            <FaUser className='icon' />
          </div>
          <div className='input-box'>
            <input
              type="password"
              placeholder='Password'
              value={password} // Controlar o valor com estado
              onChange={(e) => setPassword(e.target.value)} // Atualizar o estado quando o usuário digitar
              required
            />
            <FaLock className='icon' />
          </div>

          <div className='remember-forgot'>
            <label><input type="checkbox" />Remember Me</label>
            <a href='#'>Esqueci Minha Senha</a>
          </div>

          <button type='submit'>Login</button>

          <div className='register-link'>
            <p>Não tem uma conta? <a href="#">Registre</a></p>
          </div>
        </form>
      </div>
    </body>
  );
};

export default Login;
