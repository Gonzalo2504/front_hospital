import api from "../../api";

export const getPacientesEnEspera = async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get("/pacientes/en_espera/lista", config);
  return response.data;
};

export const getPacientesAtendidos = async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get("/pacientes/en_tratamiento/lista", config);
  return response.data;
};
