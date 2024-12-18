import React, { useState } from 'react';
import PersistentDrawerLeft from '../components/navs/adminNav';
import PacienteTable from '../components/tables/adminTables/pacientesTable';
import { useNavigate } from 'react-router-dom';
import MedicoTable from '../components/tables/adminTables/medicosTable';
import EnfermeroTable from '../components/tables/adminTables/enfermerosTable';
import Informes from '../components/tables/adminTables/informesTable';

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
      case 'Informes':
        return <Informes drawerOpen={drawerOpen} />;
      case 'Cerrar Sesion':
        localStorage.removeItem('token');
        navigate('/');
      default:
        return (<PacienteTable drawerOpen={drawerOpen} />);
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

