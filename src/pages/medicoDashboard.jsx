import React, { useState } from 'react';
import PersistentDrawerLeft from '../components/navs/medicoNav';
import PacienteTriageVerde from '../components/tables/medicoTables/pacientesEnAtencionVerde';
import PacienteTriageAmarillo from '../components/tables/medicoTables/pacientesEnAtencionAmarillo';
import PacienteTriageRojo from '../components/tables/medicoTables/pacientesEnAtencionRojo';
import PacienteEvoluciones from '../components/tables/medicoTables/pacientesEvoluciones';
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
      case 'Codigo Rojo':
        return <PacienteTriageRojo drawerOpen={drawerOpen} />;
      case 'Codigo Amarillo':
        return <PacienteTriageAmarillo drawerOpen={drawerOpen} />;
      case 'Codigo Verde':
        return <PacienteTriageVerde drawerOpen={drawerOpen} />;
      case 'Evoluciones':
          return <PacienteEvoluciones drawerOpen={drawerOpen} />;
      case 'Cerrar Sesion':
        localStorage.removeItem('token');
        navigate('/');
      default:
        return (<PacienteTriageRojo drawerOpen={drawerOpen} />);
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

