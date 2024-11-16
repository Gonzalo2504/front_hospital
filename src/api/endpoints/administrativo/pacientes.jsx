import api from "../../api";

export const getPacientes = async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get("/pacientes", config);
  return response.data;
};

export const createPaciente = async (formData) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post("/pacientes", formData, config);
  return response.data;
};

export const deletePaciente = async (id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.delete(`/pacientes/${id}`, config);
  return response.data;
};

export const updatePaciente = async (id, formData) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.put(`/pacientes/${id}`, formData, config);
  return response.data;
};

export default { getPacientes, createPaciente ,deletePaciente, updatePaciente };  