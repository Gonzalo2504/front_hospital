import React, { useState, useEffect } from "react";
import {
  getPacientesConEvolucionDeEnfermeria,
  getUltimaEvolucionPaciente,
  createEvento,
} from "../../../api/endpoints/medico/estadoPacientesMed";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";

Modal.setAppElement("#root");

const PacienteEvoluciones = ({ drawerOpen }) => {
  const [patients, setPatients] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpenEvolucion, setIsOpenEvolucion] = useState(false);
  const [isOpenEvento, setIsOpenEvento] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [idMedico, setIdMedico] = useState(null);
  const [ultimoEvolucion, setUltimoEvolucion] = useState(null);
  const [evento, setEvento] = useState({
    tipo_evento: "",
    fecha_hora: new Date(),
    observaciones: "",
    paciente_id: null,
    medico_id: null,
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await getPacientesConEvolucionDeEnfermeria();
      setPatients(response);
      setPageCount(Math.ceil(response.length / 10));
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const parts = token.split(".");
      const payload = parts[1];
      const decodedPayload = atob(payload);
      const decodedToken = JSON.parse(decodedPayload);
      setIdMedico(decodedToken.id_usuario);
    }
  }, []);

  useEffect(() => {
    if (idMedico) {
      console.log(`Hola soy el medico con el id: ${idMedico}`);
    }
  }, [idMedico]);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const handleOpenEvolucion = async (patient) => {
    try {
      const evolucion = await getUltimaEvolucionPaciente(patient.id);
      setUltimoEvolucion(evolucion);
      setSelectedPatient(patient);
      setIsOpenEvolucion(true);
    } catch (error) {
      console.error("Error fetching evolucion:", error);
    }
  };

  const handleOpenEvento = (patient) => {
    setSelectedPatient(patient);
    setEvento({
      ...evento,
      paciente_id: patient.id,
      medico_id: idMedico,
    });
    setIsOpenEvento(true);
  };

  const cleanText = (text) => text.replace(/^\s+/gm, "").trim();

  useEffect(() => {
    // Actualiza las observaciones dependiendo del tipo_evento seleccionado
    switch (evento.tipo_evento) {
      case "Internacion":
        setEvento((prev) => ({
          ...prev,
          observaciones: cleanText(`
            Diagnóstico principal: [Indicar diagnóstico aquí]
            Diagnósticos secundarios: [Indicar diagnósticos secundarios aquí]
            Signos vitales: [Indicar signos vitales aquí]
            Motivo de la internación: [Indicar motivo aquí]
            Tratamiento planificado: [Indicar tratamiento aquí]
            Riesgos identificados: [Indicar riesgos aquí]
          `),
        }));
        break;
      case "Alta Medica":
        setEvento((prev) => ({
          ...prev,
          observaciones: cleanText(`
            Mejora clínica: [Describir evolución favorable]
            Tratamiento al alta: [Indicar tratamiento aquí]
            Fecha de la próxima consulta: [Indicar fecha aquí]
            Instrucciones al paciente y/o familia: [Indicar instrucciones aquí]
          `),
        }));
        break;
      case "Tratamiento Ambulatorio":
        setEvento((prev) => ({
          ...prev,
          observaciones: cleanText(`
            Diagnóstico: [Indicar diagnóstico aquí]
            Tratamiento prescrito: [Indicar tratamiento aquí]
            Frecuencia de las visitas: [Indicar frecuencia aquí]
            Instrucciones al paciente: [Indicar instrucciones aquí]
          `),
        }));
        break;
      case "Turno con especialista":
        setEvento((prev) => ({
          ...prev,
          observaciones: cleanText(`
            Especialidad: [Indicar especialidad aquí]
            Motivo de la consulta: [Indicar motivo aquí]
            Preguntas específicas para el especialista: [Indicar preguntas aquí]
          `),
        }));
        break;
      case "Referencia a otro servicio":
        setEvento((prev) => ({
          ...prev,
          observaciones: cleanText(`
            Servicio al que se refiere: [Indicar servicio aquí]
            Motivo de la referencia: [Indicar motivo aquí]
            Instrucciones para el servicio de destino: [Indicar instrucciones aquí]
          `),
        }));
        break;
      default:
        setEvento((prev) => ({ ...prev, observaciones: "" }));
    }
  }, [evento.tipo_evento]);

  const handleSubmitEvento = async (e) => {
    e.preventDefault();
    try {
      const response = await createEvento(evento);
      console.log("Evento creado:", response.data);
      setIsOpenEvento(false);
      fetchPatients(); // Fetch patients after successful creation
    } catch (error) {
      console.error("Error creando evento:", error);
    }
  };

  return (
    <div
      style={{
        width: drawerOpen ? "calc(87vw - 2px)" : "100vw",
        margin: "0 0 0 auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Nombre</th>
            <th style={headerStyle}>Apellido</th>
            <th style={headerStyle}>DNI</th>
            <th style={headerStyle}>Teléfono</th>
            <th style={headerStyle}>Email</th>
            <th style={headerStyle}>Fecha de nacimiento</th>
            <th style={headerStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {patients
            .slice(currentPage * 10, (currentPage + 1) * 10)
            .map((patient) => (
              <tr
                key={patient.id}
                style={{
                  backgroundColor: patient.id % 2 === 0 ? "#f2f2f2" : "white",
                }}
              >
                <td style={cellStyle}>{patient.nombre}</td>
                <td style={cellStyle}>{patient.apellido}</td>
                <td style={cellStyle}>{patient.dni}</td>
                <td style={cellStyle}>{patient.telefono}</td>
                <td style={cellStyle}>{patient.email}</td>
                <td style={cellStyle}>{patient.fecha_nacimiento}</td>
                <td style={cellStyle}>
                  <button
                    onClick={() => handleOpenEvolucion(patient)}
                    style={buttonStyle}
                  >
                    Ver Evolución
                  </button>
                  <button
                    onClick={() => handleOpenEvento(patient)}
                    style={{ ...buttonStyle, marginLeft: "10px" }}
                  >
                    Crear Evento
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal para mostrar la evolución */}
      <Modal
        isOpen={isOpenEvolucion}
        onRequestClose={() => setIsOpenEvolucion(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Fondo oscuro
            display: "flex",
            alignItems: "center", // Alinea verticalmente
            justifyContent: "center", // Alinea horizontalmente
          },
          content: {
            width: "600px",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Sombra pronunciada
            border: "none", // Sin borde
            backgroundColor: "#f9f9f9", // Fondo gris claro
            position: "relative", // Elimina ajustes por defecto
            inset: "auto", // Elimina posicionamiento automático de react-modal
            maxHeight: "80vh", // Evita desbordes verticales
            overflowY: "auto", // Scroll si es necesario
          },
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#333",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          Evolución del Paciente
        </h2>

        {ultimoEvolucion ? (
          <div>
            {Object.entries(ultimoEvolucion).map(([key, value]) => {
              if (
                key === "id_orden_medica" ||
                key === "id_paciente" ||
                key === "id_enfermero"
              )
                return null;

              const label = key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());

              return (
                <div
                  key={key}
                  style={{
                    marginBottom: "12px",
                    padding: "8px 12px",
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <strong style={{ color: "#555" }}>{label}:</strong>{" "}
                  <span style={{ color: "#333" }}>{value}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>
            No hay evolución disponible para este paciente.
          </p>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => setIsOpenEvolucion(false)}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Cerrar
          </button>
        </div>
      </Modal>

      {/* Modal para crear un evento */}
      <Modal
        isOpen={isOpenEvento}
        onRequestClose={() => setIsOpenEvento(false)}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: {
            width: "60vw",
            height: "80vh",
            margin: "auto",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Crear Evento
        </h2>
        <form
          onSubmit={handleSubmitEvento}
          style={{ display: "flex", flexDirection: "column", flex: 1 }}
        >
          <label style={{ marginBottom: "10px" }}>Tipo de evento:</label>
          <select
            value={evento.tipo_evento}
            onChange={(e) =>
              setEvento({ ...evento, tipo_evento: e.target.value })
            }
            style={{
              padding: "8px",
              marginBottom: "20px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="Internacion">Internacion</option>
            <option value="Alta Medica">Alta Medica</option>
            <option value="Tratamiento Ambulatorio">
              Tratamiento Ambulatorio
            </option>
            <option value="Turno con especialista">
              Turno con especialista
            </option>
            <option value="Referencia a otro servicio">
              Referencia a otro servicio
            </option>
          </select>

          <label style={{ marginBottom: "10px" }}>Fecha y hora:</label>
          <input
            type="datetime-local"
            value={evento.fecha_hora.toISOString().slice(0, 16)}
            onChange={(e) =>
              setEvento({ ...evento, fecha_hora: new Date(e.target.value) })
            }
            style={{
              padding: "8px",
              marginBottom: "20px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <label style={{ marginBottom: "10px" }}>Observaciones:</label>
          <textarea
            value={evento.observaciones}
            onChange={(e) =>
              setEvento({ ...evento, observaciones: e.target.value })
            }
            style={{
              padding: "0",
              textAlign: "start",
              verticalAlign: "top",
              resize: "none",
              width: "100%",
              height: "200px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <button
            type="submit"
            style={{
              marginTop: "20px",
              padding: "10px",
              fontSize: "18px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Crear
          </button>
        </form>
      </Modal>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakLinkClassName={"page-link"}
          renderOnZeroPageCount={null}
        />
      </div>
      <style>
        {`
          .pagination {
            display: flex;
            list-style: none;
            padding: 0;
            margin: 0;
            align-items: center;
          }
          .page-item {
            margin: 0 5px;
          }
          .page-link {
            padding: 10px 15px;
            border: 1px solid #007bff;
            border-radius: 4px;
            color: #007bff;
            text-decoration: none;
            cursor: pointer;
          }
          .page-link:hover {
            background-color: #007bff;
            color: white;
          }
          .active .page-link {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
          }
        `}
      </style>
    </div>
  );
};

const headerStyle = { backgroundColor: "#007bff", color: "white" };
const cellStyle = { padding: "10px" };
const buttonStyle = { padding: "5px 10px", cursor: "pointer" };

export default PacienteEvoluciones;
