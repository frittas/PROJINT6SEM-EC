import './dashboard.css';
import Map from './map';
import { FaBars } from "react-icons/fa";

function App() {
  return (
    <div className='dashboard'>
      <div className='header'>
        <FaBars className='barras' />
        <h1 className='header-title'>Dashboard</h1>
      </div>
      <div className='mapa'>
        <Map />
      </div>
    </div>
  );
}

export default App;
