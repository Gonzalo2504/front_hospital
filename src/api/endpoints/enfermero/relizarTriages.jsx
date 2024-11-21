import api from "../../api";

export const createTriage = async (triageData) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post("/triages", triageData, config);
  return response.data;
};
