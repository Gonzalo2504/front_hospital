import React, { useState } from 'react';
import PersistentDrawerLeft from '../components/navs/adminNav';
import PacienteTable from '../components/tables/pacientesTable';
import { useNavigate } from 'react-router-dom';
import MedicoTable from '../components/tables/medicosTable';
import EnfermeroTable from '../components/tables/enfermerosTable';

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
      case 'Pacientes':
        return <PacienteTable drawerOpen={drawerOpen} />;
      case 'Medicos':
        return <MedicoTable drawerOpen={drawerOpen} />;
      case 'Enfermeros':
        return <EnfermeroTable drawerOpen={drawerOpen} />;
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

