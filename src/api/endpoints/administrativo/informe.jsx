import api from "../../api";

export const getInforme = async (pacienteId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await api.get(`/pacientes/${pacienteId}/realizar_informe`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `informe_paciente_${pacienteId}.pdf`);
    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Error al descargar el informe:", error);
    throw error;
  }
};

export const getPacientesConInformeFinal = async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get(`/pacientes/con-informe-final/lista`, config);
  return response.data;
};

