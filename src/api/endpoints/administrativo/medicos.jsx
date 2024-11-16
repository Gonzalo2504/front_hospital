import api from "../../api";

export const getMedicos = async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get("/medicos", config);
  return response.data;
};

export const createMedico = async (formData) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post("/medicos", formData, config);
  return response.data;
};

export const updateMedico = async (id, formData) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.put(`/medicos/${id}`, formData, config);
  return response.data;
};

export const deleteMedico = async (id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.delete(`/medicos/${id}`, config);
  return response.data;
};

export default { getMedicos, createMedico, updateMedico, deleteMedico };