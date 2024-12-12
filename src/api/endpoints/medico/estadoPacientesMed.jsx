import api from "../../api";

export const getPacientesEnAtencionPorClasificacion = async (clasificacion) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get(`/pacientes/en-atencion/clasificacion/${clasificacion}`, config);
  return response.data;
};

export const getUltimoTriage = async (pacienteId) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get(`/pacientes/${pacienteId}/ultimo-triage`, config);
  console.log(response.data);
  return response.data;
};
