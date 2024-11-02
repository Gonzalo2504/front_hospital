import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import AdminDashboard from './pages/adminDashboard';
import MedicoDashboard from './pages/medicoDashboard';
import EnfermeroDashboard from './pages/enfermeroDashboard';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/medicos" element={<MedicoDashboard />} />
        <Route path="/enfermeros" element={<EnfermeroDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;