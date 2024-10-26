import React, { useState } from 'react';
import './dashboard.css';
import Map from './map';
import { FaBars, FaUser, FaSearch } from 'react-icons/fa';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
  const [searchQuery, setSearchQuery] = useState(''); // Search state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar open/close
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Search for:", searchQuery); // Add your search logic here
  };

  return (
    <div className='dashboard'>
      {/* Header */}
      <div className='header'>
        <FaBars className='barras' onClick={toggleSidebar} />
        <h1 className='header-title'>Dashboard</h1>
        <FaUser className='usuario' style={{ marginLeft: 'auto' }} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ul className='sidebarButtons'>
          <li className='sidebarSair'>Sair</li>
        </ul>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="search-bar"
      style={{ marginLeft: isSidebarOpen ? '175px' : '0' }} // Ajusta a margem com base no estado da sidebar
      >
        <div className="search-input-container">
          <FaSearch className='searchIcon' />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
          />
        </div>
      </form>

      {/* Main Content */}
      <div
        className='mapa'
        style={{ marginLeft: isSidebarOpen ? '350px' : '0' }} // Adjust margin based on sidebar state
      >
        <Map />
        <div className='optionsDashboard'>
          <label>
            <input type='checkbox' /> 1km
          </label>
          <label>
            <input type='checkbox' /> 5km
          </label>
          <label>
            <input type='checkbox' /> 10km
          </label>
        </div>
        <button type="submit" className="buttonSendAlert">Enviar Alerta</button>
      </div>
    </div>
  );
}

export default App;
