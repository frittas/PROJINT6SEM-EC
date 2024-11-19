import React, { useState } from 'react';
import './dashboard.css';
import Map from './map';
import { FaBars, FaUser} from 'react-icons/fa';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar open/close
  };

  return (
    <div className='dashboard'>
      {/* Header */}
      <div className='header'>
        <FaBars className='barras' onClick={toggleSidebar} />
        <h1 className='header-title'>RAMS</h1>
        <FaUser className='usuario' style={{ marginLeft: 'auto' }} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ul className='sidebarButtons'>
          <li className='sidebarSair'>Sair</li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className='mapa'
        style={{ marginLeft: isSidebarOpen ? '350px' : '0' }} // Ajusta a margem com base no estado da sidebar
      >
        <Map />
      </div>
    </div>
  );
}

export default App;
