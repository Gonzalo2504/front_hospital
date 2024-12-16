import React, { useState, useEffect } from "react";
import {
  getPacientesEnAtencionPorClasificacion,
  getUltimoTriage,
  createOrdenMedica,
} from "../../../api/endpoints/medico/estadoPacientesMed";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";

Modal.setAppElement("#root");

const PacienteTriageRojo = ({ drawerOpen }) => {
  const [patients, setPatients] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpenTriage, setIsOpenTriage] = useState(false);
  const [isOpenOrden, setIsOpenOrden] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [ultimoTriage, setUltimoTriage] = useState(null);
  const [idMedico, setIdMedico] = useState(null);
  const [formData, setFormData] = useState({
    id_paciente: "",
    id_medico: "",
    descripcion: "",
    observaciones: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await getPacientesEnAtencionPorClasificacion("Rojo");
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

  const handleOpenTriage = async (patient) => {
    try {
      const ultimoTriage = await getUltimoTriage(patient.id);
      setUltimoTriage(ultimoTriage);
      setSelectedPatient(patient);
      setIsOpenTriage(true);
    } catch (error) {
      console.error("Error fetching triage:", error);
    }
  };

  const handleOpenOrdenMedica = (patient) => {
    setSelectedPatient(patient);
    setFormData({ ...formData, id_paciente: patient.id, id_medico: idMedico });
    setIsOpenOrden(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrdenMedica(formData);
      setIsOpenOrden(false);
      setFormData({
        id_paciente: "",
        id_medico: "",
        fecha_y_hora: "",
        descripcion: "",
        observaciones: "",
      });
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Nombre
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Apellido
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              DNI
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Teléfono
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Email
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Fecha de nacimiento
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Acciones
            </th>
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
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {patient.nombre}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {patient.apellido}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {patient.dni}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {patient.telefono}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {patient.email}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {patient.fecha_nacimiento}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => {
                      getUltimoTriage(patient.id).then((ultimoTriage) => {
                        setUltimoTriage(ultimoTriage);
                        handleOpenTriage(patient);
                      });
                    }}
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    Ver Ultimo Triage
                  </button>
                  {isOpenTriage && (
                    <Modal
                      isOpen={isOpenTriage}
                      onRequestClose={() => setIsOpenTriage(false)}
                      style={{
                        overlay: {
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        },
                        content: {
                          width: "700px",
                          maxHeight: "90vh",
                          margin: "auto",
                          padding: "20px",
                          borderRadius: "10px",
                          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                          overflow: "auto",
                        },
                      }}
                    >
                      <h2
                        style={{
                          textAlign: "center",
                          marginBottom: "20px",
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        Último Triage
                      </h2>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "20px",
                        }}
                      >
                        {ultimoTriage &&
                          Object.entries(ultimoTriage).map(([key, value]) => {
                            // Ocultar IDs del triage, paciente y enfermero
                            if (
                              key === "id_triage" ||
                              key === "id_paciente" ||
                              key === "id_enfermero"
                            )
                              return null;

                            // Convertir claves en etiquetas legibles
                            const label = key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (char) => char.toUpperCase());

                            return (
                              <div
                                key={key}
                                style={{
                                  flex: "1 1 calc(50% - 10px)",
                                  marginBottom: "10px",
                                }}
                              >
                                <label
                                  style={{
                                    display: "block",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    color: "#555",
                                    marginBottom: "5px",
                                  }}
                                >
                                  {label}:
                                </label>
                                <div
                                  style={{
                                    fontSize: "16px",
                                    color: "#333",
                                    backgroundColor: "#f5f5f5",
                                    padding: "12px",
                                    borderRadius: "5px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  {value}
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <button
                          onClick={() => setIsOpenTriage(false)}
                          style={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            padding: "12px 20px",
                            fontSize: "16px",
                            cursor: "pointer",
                          }}
                        >
                          Cerrar
                        </button>
                      </div>
                    </Modal>
                  )}
                  <button
                    onClick={() => handleOpenOrdenMedica(patient)}
                    style={{
                      backgroundColor: "#4c2882",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                  >
                    Crear Orden Médica
                  </button>
                  <Modal
                    isOpen={isOpenOrden}
                    onRequestClose={() => setIsOpenOrden(false)}
                    style={{
                      overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                      content: {
                        width: "700px",
                        maxHeight: "90vh",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        overflow: "auto",
                      },
                    }}
                  >
                    <h2
                      style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Crear Orden Médica
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "15px",
                          marginBottom: "20px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "5px",
                              fontWeight: "bold",
                              color: "#555",
                            }}
                          >
                            ID Paciente:
                          </label>
                          <input
                            type="text"
                            name="id_paciente"
                            value={formData.id_paciente}
                            onChange={handleChange}
                            required
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid #ddd",
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "5px",
                              fontWeight: "bold",
                              color: "#555",
                            }}
                          >
                            ID Médico:
                          </label>
                          <input
                            type="text"
                            name="id_medico"
                            value={formData.id_medico}
                            onChange={handleChange}
                            required
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid #ddd",
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "5px",
                              fontWeight: "bold",
                              color: "#555",
                            }}
                          >
                            Fecha y Hora:
                          </label>
                          <input
                            type="datetime-local"
                            name="fecha_y_hora"
                            value={new Date().toISOString().slice(0, 16)}
                            onChange={handleChange}
                            required
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid #ddd",
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "5px",
                              fontWeight: "bold",
                              color: "#555",
                            }}
                          >
                            Descripción:
                          </label>
                          <input
                            type="text"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            required
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid #ddd",
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "5px",
                              fontWeight: "bold",
                              color: "#555",
                            }}
                          >
                            Observaciones:
                          </label>
                          <input
                            type="text"
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            required
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid #ddd",
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <button
                          type="submit"
                          style={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            padding: "12px 20px",
                            fontSize: "16px",
                            cursor: "pointer",
                          }}
                        >
                          Enviar
                        </button>
                      </div>
                    </form>
                  </Modal>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
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

export default PacienteTriageRojo;
