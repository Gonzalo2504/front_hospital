import React, { useState } from 'react';
import PersistentDrawerLeft from '../components/adminNav';
import SoyUnPaciente from '../components/tables/pacientesTable';
import SoyUnMedico from '../components/tables/medicosTable';
import SoyUnEnfermero from '../components/tables/enfermerosTable';
import { useNavigate } from 'react-router-dom';

function App() {
  const [selectedComponent, setSelectedComponent] = useState('Pacientes');
  const navigate = useNavigate();

  const handleMenuSelection = (selection) => {
    setSelectedComponent(selection);
  };

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'Pacientes':
        return <SoyUnPaciente />;
      case 'Medicos':
        return <SoyUnMedico />;
      case 'Enfermeros':
        return <SoyUnEnfermero />;
      case 'Cerrar Sesion':
        navigate('/');
      default:
        return <div />;
    }
  };

  return (
    <div>
      <PersistentDrawerLeft onMenuSelect={handleMenuSelection} />
      {renderSelectedComponent()}
    </div>
  );
}

export default App;
