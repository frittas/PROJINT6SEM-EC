import React, { useState } from 'react';
import './dashboard.css';
import Map from './map';
import { FaBars, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Usar o hook useNavigate para redirecionar

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar open/close
  };

  const redirectToLogin = () => {
    window.location.assign('/'); // Redireciona para a página inicial
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="header">
        <FaBars className="barras" onClick={toggleSidebar} />
        <h1 className="header-title">RAMS</h1>
        <FaUser className="usuario" style={{ marginLeft: 'auto' }} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ul className="sidebarButtons">
          <button type="button" className="sidebarSair" onClick={redirectToLogin}>
            Sair
          </button>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className="mapa"
        style={{ marginLeft: isSidebarOpen ? '350px' : '0' }} // Ajusta a margem com base no estado da sidebar
      >
        <Map />
      </div>
    </div>
  );
}

export default App;
