import api from "../../api";
export const getUltimaOrdenMedicaPorPaciente = async (idPaciente) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get(`/ordenes_medicas/ultima_por_paciente/${idPaciente}`, config);
  console.log(response.data);
  return response.data;
};
