import React, { useState } from 'react';
import PersistentDrawerLeft from '../components/navs/enfermeroNav';
import PacienteTable from '../components/tables/pacientesTable';
import { useNavigate } from 'react-router-dom';
import MedicoTable from '../components/tables/medicosTable';

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
        return <PacienteTable drawerOpen={drawerOpen} />;
      case 'Atendidos':
        return <MedicoTable drawerOpen={drawerOpen} />;
      case 'Cerrar Sesion':
        localStorage.removeItem('token');
        navigate('/');
      default:
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            Puede seleccionar opciones de la barra lateral
          </div>
        );
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

