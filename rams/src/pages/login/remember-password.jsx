import './login.css';
import React, { useState } from 'react';
import { auth } from './firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FaUser } from "react-icons/fa";
import { Navigate } from 'react-router-dom';

 const RememberPassword = () => {
  const [email, setEmail] = useState('');
  const [shouldRedirectLogin, setshouldRedirectLogin] = useState(false);

  const handleRecovery = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Email enviado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar o email de recuperação de senha.');
    }
  };

  if (shouldRedirectLogin) {
    return <Navigate to="/" />; // Redireciona para a página de esqueci minha senha
  }

  return (
    <div className="login">
      <div className="wrapper">
        <form onSubmit= {handleRecovery}>
          <div className="form-header">
            <img src="/RAMSLogo.ico" alt="Logo" className="logo-image" />
            <div className="text-container">
              <h1 className="logo-text">RAMS</h1>
              <h2 className="subtitle">Risk Area Monitoring System</h2>
            </div>
          </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Atualiza o estado com o valor do input
                required
              />
              <FaUser className="icon" />
            </div>
            <div className="options2">
          <a onClick={() => setshouldRedirectLogin(true)} className="forgot-password2">Voltar para o Login </a> {/* INSERIR LINK */}
          </div>
          <button type="submit">Enviar Email</button>
        </form >
      </div>
    </div>
  );

}

export default RememberPassword;

