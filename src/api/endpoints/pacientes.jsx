import api from "../api";

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
