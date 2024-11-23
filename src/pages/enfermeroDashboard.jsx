import React, { useState } from 'react';
import PersistentDrawerLeft from '../components/navs/enfermeroNav';
import PacienteAtendidoTable from '../components/tables/enfermeroTables/pacientesAtendidos';
import PacienteEnEsperaTable from '../components/tables/enfermeroTables/pacientesEnEspera';
import { useNavigate } from 'react-router-dom';

function App() {
  const [selectedComponent, setSelectedComponent] = useState(' ');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuSelection = (selection) => {
    setSelectedComponent(selection);
  };

  const toggleSidebar = () => {
    setDrawerOpen(!drawerOpen);
  };

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'En espera':
        return <PacienteEnEsperaTable drawerOpen={drawerOpen} />;
      case 'Atendidos':
        return <PacienteAtendidoTable drawerOpen={drawerOpen} />;
      case 'Cerrar Sesion':
        localStorage.removeItem('token');
        navigate('/');
      default:
        return (<PacienteEnEsperaTable drawerOpen={drawerOpen} />);
    }
  };

  return (
    <div>
      <PersistentDrawerLeft onMenuSelect={handleMenuSelection} open={drawerOpen} toggleSidebar={toggleSidebar} />
      {renderSelectedComponent()}
    </div>
  );
}

export default App;

