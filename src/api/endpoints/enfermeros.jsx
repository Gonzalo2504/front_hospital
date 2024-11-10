import api from "../api";

export const getEnfermeros = async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get("/enfermeros", config);
  return response.data;
};

export const createEnfermero = async (formData) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post("/enfermeros", formData, config);
  return response.data;
};

export const updateEnfermero = async (id, formData) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.put(`/enfermeros/${id}`, formData, config);
  return response.data;
};

export const deleteEnfermero = async (id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.delete(`/enfermeros/${id}`, config);
  return response.data;
};

export default { getEnfermeros, createEnfermero, updateEnfermero, deleteEnfermero };
